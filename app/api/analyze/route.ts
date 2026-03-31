import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  analyzeDocumentFromBytes,
  cleanJsonResponse,
  parseKeywords,
  parseSentiment,
  type AnalysisType,
} from "@/lib/gemini";
import { rateLimit } from "@/lib/rate-limit";

const ANALYZE_LIMIT = 20;
const ANALYZE_WINDOW_MS = 60_000;

const VALID_TYPES = new Set<string>([
  "summary",
  "qa",
  "sentiment",
  "entities",
  "extract",
  "keywords",
]);

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { success, resetInMs } = rateLimit(
      `analyze:${userId}`,
      ANALYZE_LIMIT,
      ANALYZE_WINDOW_MS,
    );
    if (!success) {
      return NextResponse.json(
        { error: "Too many analysis requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(resetInMs / 1000)),
          },
        },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { documentId, analysisType } = body;

    if (!documentId || !analysisType) {
      return NextResponse.json(
        { error: "Missing documentId or analysisType" },
        { status: 400 },
      );
    }

    if (!VALID_TYPES.has(analysisType)) {
      return NextResponse.json(
        { error: `Invalid analysis type: ${analysisType}` },
        { status: 400 },
      );
    }

    const document = await db.document.findUnique({
      where: {
        id: documentId,
        organizationId: orgId || "none_for_personal",
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    if (!document.fileUrl) {
      return NextResponse.json(
        { error: "Document has no file URL" },
        { status: 400 },
      );
    }

    // Fetch the raw bytes + MIME type
    const fileResponse = await fetch(document.fileUrl);
    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch document file from storage" },
        { status: 502 },
      );
    }

    const mimeType =
      fileResponse.headers.get("content-type") ||
      (document.fileType === "pdf" ? "application/pdf" : "text/plain");
    const fileBytes = await fileResponse.arrayBuffer();

    const analysisResult = await analyzeDocumentFromBytes(
      fileBytes,
      mimeType,
      analysisType as AnalysisType,
    );

    if (analysisResult.startsWith("Could not analyze")) {
      return NextResponse.json(
        { error: "AI analysis failed. The model could not process this document." },
        { status: 502 },
      );
    }

    // Route each analysis type to the correct database field
    const updateData: Record<string, unknown> = {};

    switch (analysisType) {
      case "summary":
        updateData.aiSummary = analysisResult;
        break;

      case "sentiment":
        updateData.sentiment = parseSentiment(analysisResult);
        break;

      case "keywords":
        updateData.aiKeywords = parseKeywords(analysisResult);
        break;

      case "entities":
      case "extract":
      case "qa": {
        const cleaned = cleanJsonResponse(analysisResult);
        updateData.content = `[${analysisType.toUpperCase()}]\n${cleaned}`;
        break;
      }
    }

    const updatedDoc = await db.document.update({
      where: { id: documentId },
      data: updateData,
    });

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("[ANALYZE_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
