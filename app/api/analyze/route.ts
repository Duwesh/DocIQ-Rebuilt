import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeDocumentFromBytes } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { documentId, analysisType } = await req.json();

    if (!documentId || !analysisType) {
      return new NextResponse("Missing documentId or analysisType", { status: 400 });
    }

    const document = await db.document.findUnique({
      where: {
        id: documentId,
        organizationId: orgId || "none_for_personal",
      },
    });

    if (!document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    if (!document.fileUrl) {
      return new NextResponse("Document has no file URL", { status: 400 });
    }

    // Fetch the raw bytes + MIME type — no .text() on PDFs!
    const fileResponse = await fetch(document.fileUrl);
    const mimeType =
      fileResponse.headers.get("content-type") ||
      (document.fileType === "pdf" ? "application/pdf" : "text/plain");
    const fileBytes = await fileResponse.arrayBuffer();

    const analysisResult = await analyzeDocumentFromBytes(fileBytes, mimeType, analysisType as any);

    // Route each analysis type to the correct database field
    const updateData: any = {};

    if (analysisType === "summary") {
      updateData.aiSummary = analysisResult;
    } else if (analysisType === "sentiment") {
      updateData.sentiment = analysisResult;
    } else if (analysisType === "keywords") {
      try {
        const cleaned = analysisResult.replace(/```json|```/g, "").trim();
        const keywords: string[] = JSON.parse(cleaned);
        updateData.aiKeywords = Array.isArray(keywords) ? keywords : [];
      } catch {
        updateData.aiKeywords = analysisResult
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean);
      }
    } else {
      // entities, extract, qa → content field (don't overwrite summary)
      updateData.content = `[${analysisType.toUpperCase()}]\n${analysisResult}`;
    }

    const updatedDoc = await db.document.update({
      where: { id: documentId },
      data: updateData,
    });

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error("[ANALYZE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
