import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyzeDocument } from "@/lib/gemini";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { documentId } = await req.json();

  const doc = await db.document.findUnique({
    where: { id: documentId },
  });

  if (!doc || !doc.fileUrl) return new NextResponse("Document not found", { status: 404 });

  // In a real app, read file from fileUrl before sending to Gemini
  // For simplicity, we assume we have text content or a small file
  const analysis = await analyzeDocument(doc.content || "N/A - File content placeholder");

  await db.document.update({
    where: { id: documentId },
    data: {
      aiSummary: analysis.summary,
      aiKeywords: analysis.keywords,
      sentiment: analysis.sentiment,
    },
  });

  return NextResponse.json(analysis);
}
