
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, PersonalizedPlan, SymptomCheckResult, DentistSearchResult, SmileDesignResult, DailyLog, GroundingChunk, Dentist } from '../types';

// Per instructions, assume process.env.API_KEY is pre-configured and available in the execution context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
    try {
        // The API might return markdown with JSON.
        const cleanedString = jsonString.replace(/^```json\s*|```\s*$/g, '').trim();
        return JSON.parse(cleanedString) as T;
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        console.error("Original string:", jsonString);
        return fallback;
    }
};


export const generatePersonalizedPlan = async (profile: UserProfile): Promise<PersonalizedPlan> => {
    const prompt = `
        Based on the following user biometrics, generate a personalized oral health biohacking plan.
        The user wants actionable advice. The plan should include a rationale, key alerts, and specific recommendations for supplements, nutrition, and morning/evening routines.
        - Saliva pH: ${profile.salivaPH}
        - Genetic Risk for Periodontitis: ${profile.geneticRisk}
        - Bruxism (Teeth Grinding): ${profile.bruxism}
        - Health Goals: ${profile.goals.map(g => g.text).join(', ')}
        - Lifestyle Notes: ${profile.lifestyle}
        - Dietary Restrictions: ${profile.dietaryRestrictions}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    planRationale: { type: Type.STRING },
                    alerts: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                marker: { type: Type.STRING },
                                status: { type: Type.STRING, enum: ['Good', 'Fair', 'Poor'] },
                                advice: { type: Type.STRING }
                            },
                            required: ['marker', 'status', 'advice']
                        }
                    },
                    supplements: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                dosage: { type: Type.STRING },
                                reason: { type: Type.STRING }
                            },
                             required: ['name', 'dosage', 'reason']
                        }
                    },
                    nutrition: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                recommendation: { type: Type.STRING },
                                reason: { type: Type.STRING }
                            },
                            required: ['recommendation', 'reason']
                        }
                    },
                    morningRoutines: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                frequency: { type: Type.STRING },
                                instructions: { type: Type.STRING }
                            },
                            required: ['name', 'frequency', 'instructions']
                        }
                    },
                    eveningRoutines: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                frequency: { type: Type.STRING },
                                instructions: { type: Type.STRING }
                            },
                            required: ['name', 'frequency', 'instructions']
                        }
                    }
                },
                required: ['planRationale', 'alerts', 'supplements', 'nutrition', 'morningRoutines', 'eveningRoutines']
            }
        }
    });

    const jsonText = response.text;
    return safeJsonParse(jsonText, { planRationale: 'Could not generate plan.', alerts: [], supplements: [], nutrition: [], morningRoutines: [], eveningRoutines: [] });
};

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomCheckResult> => {
    const prompt = `
        A user has the following oral health symptoms: "${symptoms}".
        Analyze these symptoms and provide:
        1. A few possible conditions with their likelihood (e.g., High, Medium, Low).
        2. A triage level: 'Self-Care', 'See a Dentist Soon', or 'Urgent Dental Care Recommended'.
        3. A list of concrete care recommendations.
        4. A clear disclaimer that this is not medical advice and they should consult a professional.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    possibleConditions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                likelihood: { type: Type.STRING }
                            },
                             required: ['name', 'likelihood']
                        }
                    },
                    triageLevel: { type: Type.STRING, enum: ['Self-Care', 'See a Dentist Soon', 'Urgent Dental Care Recommended'] },
                    careRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    disclaimer: { type: Type.STRING }
                },
                required: ['possibleConditions', 'triageLevel', 'careRecommendations', 'disclaimer']
            }
        }
    });
    
    const jsonText = response.text;
    return safeJsonParse(jsonText, { possibleConditions: [], triageLevel: 'See a Dentist Soon', careRecommendations: ['Consult a dental professional.'], disclaimer: 'This is an AI-generated analysis and not a substitute for professional medical advice.' });
};

export const findDentists = async (latitude: number, longitude: number): Promise<DentistSearchResult> => {
    const prompt = `Find good dentists near me. For each dentist, provide the name, full address, and phone number. Format the output with each dentist clearly separated. Return a list of at least 3 dentists.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleMaps: {}}],
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: latitude,
                        longitude: longitude,
                    }
                }
            }
        },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    // Rudimentary parsing since we can't enforce JSON with googleMaps tool
    const dentists: Dentist[] = text.split(/\n(?=Name:)/g).map(block => {
        const nameMatch = block.match(/Name:\s*(.*)/);
        const addressMatch = block.match(/Address:\s*(.*)/);
        const phoneMatch = block.match(/Phone:\s*(.*)/);

        if (nameMatch && addressMatch && phoneMatch) {
            return {
                name: nameMatch[1].trim(),
                address: addressMatch[1].trim(),
                phone: phoneMatch[1].trim(),
            };
        }
        return null;
    }).filter((d): d is Dentist => d !== null);

    if (dentists.length === 0 && text.length > 10) {
        dentists.push({
            name: "Could not parse dentist info",
            address: text.substring(0, 100) + '...',
            phone: 'N/A'
        });
    }

    return { dentists, sources };
};

export const generateSmileDesign = async (base64ImageData: string, mimeType: string): Promise<SmileDesignResult> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: 'Enhance this person\'s smile. Make the teeth look healthy, well-aligned, and naturally white. Do not alter the rest of the face. Only return the edited image.',
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let image = '';
    let text = '';
    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            text += part.text;
        } else if (part.inlineData) {
            image = part.inlineData.data;
        }
    }
    return { image, text };
};

export const analyzeDietLog = async (log: DailyLog): Promise<string> => {
    const prompt = `
        Analyze the following daily diet log for its impact on oral health.
        - Breakfast: ${log.Breakfast?.map(i => i.text).join(', ') || 'None'}
        - Lunch: ${log.Lunch?.map(i => i.text).join(', ') || 'None'}
        - Dinner: ${log.Dinner?.map(i => i.text).join(', ') || 'None'}
        - Snacks: ${log.Snacks?.map(i => i.text).join(', ') || 'None'}
        
        Provide a concise analysis (2-3 sentences) focusing on sugary/acidic foods, and offer one simple, actionable tip for improvement.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
};

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64ImageData, mimeType: mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("API did not return an image.");
};

export const analyzeImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    const fullPrompt = `Analyze this image of a person's mouth/teeth. ${prompt}. Provide a descriptive answer. IMPORTANT: Add a disclaimer that you are an AI and this is not a medical diagnosis.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { data: base64ImageData, mimeType: mimeType } },
                { text: fullPrompt },
            ]
        },
    });
    return response.text;
};
