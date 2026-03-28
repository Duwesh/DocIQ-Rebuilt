import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeDocument(content: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the following document content and provide:
  1. A concise summary.
  2. Keywords (max 10).
  3. Sentiment (Positive, Negative, or Neutral).

  Format as JSON:
  {
    "summary": "...",
    "keywords": ["...", "..."],
    "sentiment": "..."
  }
  
  Content: ${content}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
     const jsonClean = text.replace(/```json|```/g, "").trim();
     return JSON.parse(jsonClean);
  } catch (error) {
     return {
       summary: "Failed to analyze document summary",
       keywords: [],
       sentiment: "Neutral"
     };
  }
}
