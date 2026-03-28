import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI API KEY is not set environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export type AnalysisType = "summary" | "qa" | "sentiment" | "entities" | "extract" | "keywords";

const baseInstruction = `
You are an expert AI assistant specialized in document analysis.
Follow these rules strictly:
- Only use the provided document content (no assumptions or hallucination)
- Be concise but informative
- Use structured output
- Do not include explanations unless asked
`;

function buildPrompt(analysisType: AnalysisType, textFallback?: string): string {
  const docSection = textFallback ? `\n\nDocument:\n${textFallback}` : "";

  const prompts: Record<AnalysisType, string> = {
    summary: `${baseInstruction}

Task: Summarize the document.

Output format:
- Title:
- Key Points (bullet list):
- Detailed Summary (paragraph):
- Key Insights:
${docSection}`,

    qa: `${baseInstruction}

Task: Generate 5 important question-answer pairs.

Output format (JSON):
[
  {
    "question": "...",
    "answer": "..."
  }
]
${docSection}`,

    sentiment: `${baseInstruction}

Task: Analyze the sentiment of the human-readable text in this document.
If the document is mostly technical metadata or binary content with no meaningful text, say so clearly.

Output format (JSON):
{
  "overall_sentiment": "positive | negative | neutral",
  "confidence": "low | medium | high",
  "tones": ["tone1", "tone2"],
  "explanation": "brief explanation based on actual document content"
}
${docSection}`,

    entities: `${baseInstruction}

Task: Extract named entities from the document.

Output format (JSON):
{
  "people": [],
  "organizations": [],
  "locations": [],
  "dates": [],
  "other": []
}
${docSection}`,

    extract: `${baseInstruction}

Task: Extract structured key information.

Output format (JSON):
{
  "summary": "...",
  "key_points": [],
  "important_dates": [],
  "important_entities": [],
  "numbers_and_metrics": [],
  "action_items": []
}
${docSection}`,

    keywords: `${baseInstruction}

Task: Extract the top 10 most important keywords or keyphrases from this document.

Output format (JSON array of strings only, no extra explanation):
["keyword1", "keyword2", "keyword3", ...]
${docSection}`,
  };

  return prompts[analysisType];
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
      // Pass PDF bytes directly — Gemini can read the visual/text layers natively
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
