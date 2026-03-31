import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI API KEY is not set environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export type AnalysisType =
  | "summary"
  | "qa"
  | "sentiment"
  | "entities"
  | "extract"
  | "keywords";

const baseInstruction = `You are a precise document analysis engine. Rules:
- Base every claim on the provided document content only — never hallucinate.
- Follow the requested output format exactly.
- Do NOT wrap your response in markdown code fences (\`\`\`).`;

function buildPrompt(analysisType: AnalysisType, textFallback?: string): string {
  const docSection = textFallback
    ? `\n\n--- BEGIN DOCUMENT ---\n${textFallback}\n--- END DOCUMENT ---`
    : "";

  const prompts: Record<AnalysisType, string> = {
    summary: `${baseInstruction}

Analyze the document and produce a comprehensive summary in clean Markdown.

Use this exact structure:

## Title
A single descriptive title for the document.

## Key Points
- Bullet 1
- Bullet 2
- (up to 7 bullets covering the most important facts)

## Summary
A 2-4 paragraph detailed summary capturing the document's purpose, main arguments, findings, and conclusions.

## Key Insights
- Insight 1
- Insight 2
- (non-obvious takeaways, implications, or patterns you noticed)
${docSection}`,

    qa: `${baseInstruction}

Generate 5 important question-answer pairs from this document. Choose questions that test understanding of the core content.

Respond with a valid JSON array only — no surrounding text:
[
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."}
]
${docSection}`,

    sentiment: `${baseInstruction}

Analyze the tone and emotional sentiment of this document.
If the document is mostly technical metadata, code, or binary content with no meaningful prose, set overall_sentiment to "neutral" and explain why.

Respond with a valid JSON object only — no surrounding text:
{
  "overall_sentiment": "positive" | "negative" | "neutral" | "mixed",
  "confidence": "low" | "medium" | "high",
  "tones": ["tone1", "tone2"],
  "explanation": "One sentence explaining the sentiment based on actual content."
}
${docSection}`,

    entities: `${baseInstruction}

Extract all named entities from the document. Categorize each entity. If a category has no matches, use an empty array.

Respond with a valid JSON object only — no surrounding text:
{
  "people": ["Name 1", "Name 2"],
  "organizations": ["Org 1"],
  "locations": ["Place 1"],
  "dates": ["Date 1"],
  "other": ["Misc entity"]
}
${docSection}`,

    extract: `${baseInstruction}

Extract structured information from this document. For any field with no matches, use an empty array or empty string.

Respond with a valid JSON object only — no surrounding text:
{
  "summary": "A 1-2 sentence summary.",
  "key_points": ["point 1", "point 2"],
  "important_dates": ["date 1"],
  "important_entities": ["entity 1"],
  "numbers_and_metrics": ["metric 1"],
  "action_items": ["action 1"]
}
${docSection}`,

    keywords: `${baseInstruction}

Extract the top 10 most important keywords or keyphrases from this document. Choose terms that best represent the document's subject matter.

Respond with a valid JSON array of strings only — no surrounding text:
["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"]
${docSection}`,
  };

  return prompts[analysisType];
}

/**
 * Strip markdown code fences and whitespace from an AI response
 * so the result can be parsed as JSON.
 */
export function cleanJsonResponse(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
}

/**
 * Parse a keywords response into a string array.
 * Handles JSON arrays, code-fenced JSON, and comma-separated fallback.
 */
export function parseKeywords(raw: string): string[] {
  try {
    const parsed = JSON.parse(cleanJsonResponse(raw));
    if (Array.isArray(parsed)) {
      return parsed.map((k: unknown) => String(k).trim()).filter(Boolean);
    }
    return [];
  } catch {
    return raw
      .replace(/[\[\]"]/g, "")
      .split(",")
      .map((k: string) => k.trim())
      .filter(Boolean);
  }
}

/**
 * Parse a sentiment response into a clean JSON string for storage.
 * Returns the cleaned JSON string, or a fallback JSON on failure.
 */
export function parseSentiment(raw: string): string {
  try {
    const parsed = JSON.parse(cleanJsonResponse(raw));
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify({
      overall_sentiment: "neutral",
      confidence: "low",
      tones: [],
      explanation: "Could not parse sentiment analysis.",
    });
  }
}

/**
 * Analyze a document from raw bytes.
 * Uses Gemini's inline multimodal API for PDFs/binary files.
 * Uses plain text path for .txt, .md, .docx exports, etc.
 */
export async function analyzeDocumentFromBytes(
  fileBytes: ArrayBuffer,
  mimeType: string,
  analysisType: AnalysisType,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    });

    const isPdf = mimeType === "application/pdf" || mimeType.includes("pdf");
    const isTextBased =
      mimeType.startsWith("text/") ||
      mimeType === "application/json" ||
      mimeType === "application/msword";

    if (isPdf) {
      const inlinePart = {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(fileBytes).toString("base64"),
        },
      };
      const promptText = buildPrompt(analysisType);
      const result = await model.generateContent([promptText, inlinePart]);
      return result.response.text();
    }

    if (isTextBased) {
      const text = Buffer.from(fileBytes).toString("utf-8");
      const prompt = buildPrompt(analysisType, text);
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    // Unsupported type — try as plain text anyway
    const text = Buffer.from(fileBytes).toString("utf-8");
    const prompt = buildPrompt(analysisType, text);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    return `Could not analyze for ${analysisType}`;
  }
}

/**
 * Legacy text-based overload kept for backwards compatibility.
 */
export async function analyzeDocument(
  text: string,
  analysisType: AnalysisType,
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    });
    const prompt = buildPrompt(analysisType, text);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("Gemini error:", error);
    return `Could not analyze for ${analysisType}`;
  }
}
