import { GoogleGenAI } from "@google/genai";

// Per guidelines, initialize with apiKey from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Generates an analytical insight based on the provided text context from workspace nodes.
 * @param inputText A string containing data from various nodes.
 * @returns A promise that resolves to a string with the AI-generated insight.
 */
export const generateInsight = async (inputText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API_KEY environment variable not set. Please configure it to use AI features.";
  }

  try {
    // Per guidelines, use ai.models.generateContent with the model name and prompt.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use gemini-2.5-flash for basic text tasks.
      contents: [{
        parts: [
          { text: "You are an expert data analyst. Analyze the following connected data points from a visual workspace and provide a concise, actionable insight. Focus on potential connections, anomalies, or next steps for an investigation. Be brief and to the point." },
          { text: `--- DATA --- \n\n${inputText}` },
        ],
      }],
    });
    
    // Per guidelines, extract the text directly from the .text property.
    const text = response.text;
    if (text) {
      return text;
    } else {
      return "The AI analysis returned no result. Please check the input data or try again.";
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    // Provide a user-friendly error message.
    if (error instanceof Error) {
        return `An error occurred while generating the insight: ${error.message}`;
    }
    return "An unknown error occurred while generating the insight.";
  }
};
