import { GoogleGenAI } from "@google/genai";
import { GroundingChunk, EducationalContentResult } from '../types';

// Per instructions, assume process.env.API_KEY is pre-configured and available in the execution context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateEducationalContent = async (topic: string): Promise<EducationalContentResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Explain the following oral health topic in a clear, concise, and informative way suitable for a patient. Provide actionable advice where possible. Topic: "${topic}"`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{googleSearch: {}}],
        systemInstruction: "You are an AI assistant for an oral health application. Your goal is to provide accurate, safe, and easy-to-understand educational content. Always base your answers on the provided search results. Do not provide medical advice, and include a disclaimer that the user should consult a dental professional for personal health concerns."
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { text, sources };

  } catch (error) {
    console.error("Error generating educational content:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred while generating content.";
    throw new Error(`Failed to generate content: ${message}`);
  }
};