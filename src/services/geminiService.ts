import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const summarizeActivity = async (details: string[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an operations supervisor assistant. Summarize the following list of activity details from a daily oilfield report into a concise "Objective of Intervention" or "Summary of the Day" (max 30 words).
      
      Activities:
      ${details.join('\n')}
      `,
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating summary.";
  }
};
