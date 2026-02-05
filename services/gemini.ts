import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message, Role } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-now' });
};

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string
): Promise<string> => {
  const ai = getClient();
  
  // Format history for the API
  // We need to convert our internal Message format to the API's expected format if using chat mode,
  // or just append to contents. 
  // Using generateContent with system instruction is robust for single-turn or stateless multi-turn.
  // For a chat app, we should ideally use ai.chats.create, but mapping history manually allows specific control.
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage({
      message: newMessage
    });

    return result.text || "I'm sorry, I was lost in thought about love. Could you ask that again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from Duoplee.");
  }
};