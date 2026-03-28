import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI API KEY is not set environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeWithGemini(
  text: string,
  analysisType: "summary" | "qa" | "sentiment" | "entities" | "extract",
) {
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const baseInstruction = `
You are an expert AI assistant specialized in document analysis.
Follow these rules strictly:
- Only use the provided text (no assumptions or hallucination)
- Be concise but informative
- Use structured output
- Do not include explanations unless asked
`;

    const prompts = {
      summary: `
${baseInstruction}

Task: Summarize the document.

Output format:
- Title:
- Key Points (bullet list):
- Detailed Summary (paragraph):
- Key Insights:

Document:
${text}
`,

      qa: `
${baseInstruction}

Task: Generate 5 important question-answer pairs.

Output format (JSON):
[
  {
    "question": "...",
    "answer": "..."
  }
]

Document:
${text}
`,

      sentiment: `
${baseInstruction}

Task: Analyze sentiment.

Output format (JSON):
{
  "overall_sentiment": "positive | negative | neutral",
  "confidence": "low | medium | high",
  "tones": ["tone1", "tone2"],
  "explanation": "brief explanation"
}

Document:
${text}
`,

      entities: `
${baseInstruction}

Task: Extract named entities.

Output format (JSON):
{
  "people": [],
  "organizations": [],
  "locations": [],
  "dates": [],
  "other": []
}

Document:
${text}
`,

      extract: `
${baseInstruction}

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

Document:
${text}
`,
    };

    const prompt = prompts[analysisType];

    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
  } catch (error) {
    console.log("Gemini error:", error);
    return `Could not analyze for ${analysisType}`;
  }
}
