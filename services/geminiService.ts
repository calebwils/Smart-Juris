import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Initialize the client. API_KEY is expected to be in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const checkApiKey = () => {
  return !!process.env.API_KEY;
};

/**
 * Perform a semantic legal search.
 * Returns structured data: explanation, articles, jurisprudence.
 */
export const searchLegalInfo = async (query: string, lang: Language) => {
  const promptLang = lang === 'fr' ? 'Français' : 'English';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a legal expert assisting a lawyer. Analyze the following query: "${query}".
      Respond in ${promptLang}.
      Return a structured JSON with the following fields:
      - explanation: A clear and detailed explanation in ${promptLang}.
      - articles: A list of relevant legal articles (title and summary in ${promptLang}).
      - jurisprudence: A list of relevant jurisprudence (name and summary in ${promptLang}).
      - sources: List of cited sources.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                }
              }
            },
            jurisprudence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  summary: { type: Type.STRING },
                }
              }
            },
             sources: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};

/**
 * Interactive Chat
 */
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string, lang: Language) => {
  const systemInstruction = lang === 'fr' 
    ? "Tu es Smart Juris, un assistant juridique virtuel intelligent. Tes réponses doivent être précises, professionnelles et citer les textes de loi quand c'est possible."
    : "You are Smart Juris, an intelligent virtual legal assistant. Your answers must be precise, professional, and cite legal texts whenever possible.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Generate Legal Document
 */
export const generateDocument = async (type: string, details: string, lang: Language) => {
  const prompt = lang === 'fr'
    ? `Rédige un document juridique complet de type "${type}". Détails: ${details}. Le document doit être formel, respecter les standards juridiques, et inclure des espaces réservés [ENTRE CROCHETS] pour les informations manquantes. Formate en Markdown.`
    : `Draft a complete legal document of type "${type}". Details: ${details}. The document must be formal, respect legal standards, and include placeholders [IN BRACKETS] for missing information. Format in Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Doc Gen Error:", error);
    throw error;
  }
};