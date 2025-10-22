
import { GoogleGenAI, Chat } from "@google/genai";

// Per instructions, assume process.env.API_KEY is pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// We will use a single chat instance for simplicity.
// In a real app, you might manage multiple chat instances.
let chatInstance: Chat | null = null;

export const getChat = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash-lite',
            config: {
                systemInstruction: 'You are a friendly and helpful oral health assistant. Keep your responses concise and easy to understand.',
            },
        });
    }
    return chatInstance;
};
