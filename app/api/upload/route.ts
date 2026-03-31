import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// 10 uploads per minute per user
const UPLOAD_LIMIT = 10;
const UPLOAD_WINDOW_MS = 60_000;

export async function POST(req: Request): Promise<NextResponse> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { success, remaining, resetInMs } = rateLimit(
    `upload:${userId}`,
    UPLOAD_LIMIT,
    UPLOAD_WINDOW_MS,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(resetInMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
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

    const blob = await put(filename, bodyAsBlob, {
      access: "public",
      addRandomSuffix: true,
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

    return NextResponse.json({ ...blob, id: createdDoc.id });
  } catch (error) {
    console.log({ error });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
