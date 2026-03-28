import { del } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { documentId } = await params;

    // Find the document and verify ownership/org access
    const document = await db.document.findFirst({
      where: {
        id: documentId,
        // Ensure the user owns it or belongs to the org
        OR: [
          { userId: userId },
          { organizationId: orgId || "none_for_personal" }
        ]
      },
    });

    if (!document) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // 1. Delete from Vercel Blob if URL exists
    if (document.fileUrl) {
      try {
        await del(document.fileUrl);
      } catch (blobError) {
        console.error("Failed to delete from Vercel Blob:", blobError);
        // We continue even if blob deletion fails to ensure the DB stays clean
      }
    }

    // 2. Delete from Prisma
    await db.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("[DOCUMENT_DELETE] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
