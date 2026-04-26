
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Coin } from "../types";

const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });

export async function analyzeCrypto(coin: Coin): Promise<AnalysisResult> {
  const prompt = `
    Analyze the following market data for ${coin.name} (${coin.symbol}):
    - Current Price: $${coin.price}
    - 24h Change: ${coin.change24h}%
    - 7d Change: ${coin.change7d}%
    - Market Cap: $${coin.marketCap}
    - 24h Volume: $${coin.volume}
    ${coin.history ? `- Historical Data Points (last 24h): ${JSON.stringify(coin.history.slice(-10).map(p => ({ time: p.timestamp, price: p.price })))}` : ''}

    Rule:
    - Return ONLY JSON.
    - No markdown formatting.
    - No investment advice (buy/sell).
    - Maintain analytical tone.
    - Based on data provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a professional crypto research analyst. You provide structured data-driven insights in Traditional Chinese (Taiwan) without making financial recommendations.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trend: { type: Type.STRING, description: "Market trend: bullish, bearish, or neutral" },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0" },
            summary: { type: Type.STRING, description: "A detailed analysis summary" },
            signals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of market signals" },
            risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential risks" },
            suggestion: { type: Type.STRING, description: "General research suggestion/direction" }
          },
          required: ["trend", "confidence", "summary", "signals", "risks", "suggestion"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate research analysis");
  }
}
