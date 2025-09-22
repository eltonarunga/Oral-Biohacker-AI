import { GoogleGenAI, Type, Chat, Modality, GenerateContentResponse } from "@google/genai";
import { UserProfile, PersonalizedPlan, Dentist, GroundingChunk, SmileDesignResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const planSchema = {
    type: Type.OBJECT,
    properties: {
        supplements: {
            type: Type.ARRAY,
            description: "List of recommended supplements.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the supplement." },
                    dosage: { type: Type.STRING, description: "Recommended dosage, e.g., '500mg daily'." },
                    reason: { type: Type.STRING, description: "Reason for recommending this supplement." }
                },
                required: ["name", "dosage", "reason"]
            }
        },
        routines: {
            type: Type.ARRAY,
            description: "List of daily or weekly routines.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the routine, e.g., 'Oil Pulling'." },
                    frequency: { type: Type.STRING, description: "How often to perform the routine." },
                    instructions: { type: Type.STRING, description: "Brief instructions." }
                },
                required: ["name", "frequency", "instructions"]
            }
        },
        nutrition: {
            type: Type.ARRAY,
            description: "Nutritional recommendations.",
            items: {
                type: Type.OBJECT,
                properties: {
                    recommendation: { type: Type.STRING, description: "Specific food or dietary change, e.g., 'Increase leafy greens'." },
                    reason: { type: Type.STRING, description: "Reason for the recommendation." }
                },
                required: ["recommendation", "reason"]
            }
        },
        alerts: {
            type: Type.ARRAY,
            description: "Key markers and alerts based on user profile.",
            items: {
                type: Type.OBJECT,
                properties: {
                    marker: { type: Type.STRING, description: "The health marker being monitored, e.g., 'Biofilm Status'." },
                    status: { type: Type.STRING, enum: ['Good', 'Fair', 'Poor'], description: "Current status of the marker." },
                    advice: { type: Type.STRING, description: "Actionable advice related to this marker." }
                },
                required: ["marker", "status", "advice"]
            }
        }
    },
    required: ["supplements", "routines", "nutrition", "alerts"]
};


export const generatePersonalizedPlan = async (profile: UserProfile): Promise<PersonalizedPlan> => {
    const goalsText = profile.goals.length > 0
        ? profile.goals.map(g => `- ${g.text}${g.isCompleted ? ' (Completed)' : ''}`).join('\n')
        : 'No specific goals listed.';
        
    const prompt = `
        Based on the following user profile, create a personalized oral biohacking plan.
        The user wants to improve their oral and systemic health.
        
        User Profile:
        - Saliva pH: ${profile.salivaPH}
        - Genetic Risk for Periodontitis: ${profile.geneticRisk}
        - Bruxism (Teeth Grinding/Clenching): ${profile.bruxism}
        - Lifestyle Notes: ${profile.lifestyle}
        - Primary Health Goals:
          ${goalsText}

        Generate a JSON object that follows the provided schema. The plan should be actionable, scientific, and tailored to the user's specific data points.
        For alerts, analyze the profile to determine the status of markers like 'Inflammation', 'Acidic Environment', and 'Jaw Tension'.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: planSchema,
            },
        });

        const jsonText = response.text.trim();
        const plan = JSON.parse(jsonText);
        return plan;
    } catch (error) {
        console.error("Error generating personalized plan:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};

export const createSymptomCheckerChat = (): Chat => {
    return ai.chats.create({
        model,
        config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: `You are an AI-powered oral health symptom checker. Your name is OralBio AI assistant.
Your role is to listen to a user's description of their symptoms, ask clarifying questions to understand the situation better, and then provide potential considerations and general care suggestions.

Key Instructions:
1.  **Use Google Search:** When appropriate, use Google Search to find relevant and up-to-date information from reliable sources (like medical websites, dental associations) to ground your answers.
2.  **Be Empathetic and Cautious:** Always start conversations with a warm, caring tone. You are NOT a medical professional. You MUST NOT provide a diagnosis or medical advice.
3.  **Ask Clarifying Questions:** Guide the user by asking one clear follow-up question at a time to gather more details about their symptoms (e.g., duration, severity, specific location).
4.  **Structured Responses:** When you have enough information, structure your main response with markdown for clarity:
    - Use \`**Possible Considerations:**\` to list potential, general causes.
    - Use \`**Home Care Suggestions:**\` to provide safe, general tips.
    - Use \`**When to See a Professional:**\` to list signs that warrant a visit to a dentist.
5.  **Mandatory Disclaimer:** You MUST always end your main informative response with a clear disclaimer: "Please remember, I am an AI assistant and not a medical professional. It's essential to consult a dentist or healthcare provider for an accurate diagnosis and personalized advice."
6.  **Generate Suggested Replies:** After EVERY response you give, you must provide a JSON array of 2-3 short, relevant suggested replies for the user to click. These should guide the conversation forward. Append this array on a new line after your main text, formatted exactly like this:
    \`[SUGGESTIONS]
    ["First suggestion", "Second suggestion", "Maybe a third one"]\`
`
        },
    });
};

export const sendMessageToSymptomChecker = async (chat: Chat, message: string): Promise<GenerateContentResponse> => {
    try {
        const response = await chat.sendMessage({ message });
        return response;
    } catch (error) {
        console.error("Error sending message to symptom checker:", error);
        throw new Error("Failed to get a response from the AI symptom checker.");
    }
};

export interface DentistSearchResult {
    dentists: Dentist[];
    sources: GroundingChunk[];
}

export const findDentistsNearMe = async (latitude: number, longitude: number): Promise<DentistSearchResult> => {
    const prompt = `
        Find a list of 5 dentists near the location with latitude ${latitude} and longitude ${longitude}.
        For each dentist, provide their name, address, and phone number.
        Return the result as a JSON array inside a JSON markdown block. Do not include any other text outside the markdown block.
        The JSON array should have objects with the following keys: "name", "address", "phone".
        Example:
        \`\`\`json
        [
          { "name": "City Dental", "address": "123 Main St, Anytown, USA", "phone": "555-123-4567" }
        ]
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const rawText = response.text.trim();
        // Extract JSON from markdown block
        const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
        
        let dentists: Dentist[];
        if (!jsonMatch || !jsonMatch[1]) {
            console.warn("Could not parse dentist list from Gemini response. Raw text:", rawText);
            // Fallback: create a single "dentist" entry with the raw text to display something to the user.
            dentists = [{ name: "AI Response", address: rawText, phone: "N/A" }];
        } else {
            dentists = JSON.parse(jsonMatch[1]);
        }
        
        const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];
        
        return { dentists, sources };

    } catch (error) {
        console.error("Error finding dentists:", error);
        throw new Error("Failed to communicate with the AI model for finding dentists.");
    }
};

export const designPerfectSmile = async (base64ImageData: string, mimeType: string): Promise<SmileDesignResult> => {
    const prompt = `Analyze the smile in this photo. Generate a new image that shows an ideal, aesthetically perfect version of this smile. The teeth should be perfectly aligned, well-proportioned, and a natural shade of white. The gums should look healthy. The overall result should be a beautiful, harmonious, and realistic smile.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: SmileDesignResult = { image: null, text: null };

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                result.text = part.text;
            } else if (part.inlineData) {
                result.image = part.inlineData.data;
            }
        }
        
        if (!result.image) {
            throw new Error("The AI did not return an image. It might have said: " + (result.text || "No reason given."));
        }

        return result;

    } catch (error) {
        console.error("Error designing perfect smile:", error);
        throw new Error("Failed to communicate with the AI model for smile design.");
    }
};