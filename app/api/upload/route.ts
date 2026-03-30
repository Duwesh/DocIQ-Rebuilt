import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { analyzeDocumentFromBytes } from "@/lib/gemini";

export async function POST(req: Request): Promise<NextResponse> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");

  if (!filename || !req.body) {
    return new NextResponse("Missing filename or body", { status: 400 });
  }

  try {
    const bodyAsBlob = await req.blob();
    const fileSize = bodyAsBlob.size;
    const fileExt = filename.split(".").pop()?.toLowerCase() || "txt";

    // Determine MIME type from extension
    const mimeMap: Record<string, string> = {
      pdf: "application/pdf",
      txt: "text/plain",
      md: "text/markdown",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
    };
    const mimeType = mimeMap[fileExt] || "text/plain";

    const blob = await put(filename, bodyAsBlob, {
      access: "public",
    });

    const activeOrgId = orgId || "none_for_personal";

    const createdDoc = await db.document.create({
      data: {
        name: filename,
        fileUrl: blob.url,
        fileSize: fileSize,
        fileType: fileExt,
        organizationId: activeOrgId,
        userId: userId,
      },
    });

    // Instant AI analysis — run all core types on upload
    try {
      const fileBytes = await bodyAsBlob.arrayBuffer();

      const [summary, sentiment, keywordsRaw] = await Promise.all([
        analyzeDocumentFromBytes(fileBytes, mimeType, "summary"),
        analyzeDocumentFromBytes(fileBytes, mimeType, "sentiment"),
        analyzeDocumentFromBytes(fileBytes, mimeType, "keywords"),
      ]);

      let keywords: string[] = [];
      try {
        const cleaned = keywordsRaw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        keywords = Array.isArray(parsed) ? parsed : [];
      } catch {
        keywords = keywordsRaw
          .replace(/[\[\]"]/g, "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean);
      }

      await db.document.update({
        where: { id: createdDoc.id },
        data: {
          aiSummary: summary,
          sentiment: sentiment,
          aiKeywords: keywords,
        },
      });
    } catch (err) {
      console.error("Instant AI Analysis Failed:", err);
    }

    return NextResponse.json({ ...blob, id: createdDoc.id });
  } catch (error) {
    console.log({ error });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
