import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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
    const blob = await put(filename, req.body, {
      access: "public",
    });

    if (orgId) {
      await db.document.create({
        data: {
          name: filename,
          fileUrl: blob.url,
          fileSize: 0, // Simplified for now
          fileType: filename.split(".").pop(),
          organizationId: orgId,
          userId: userId,
        },
      });
    }

    return NextResponse.json(blob);
  } catch (error) {
    console.log({ error });
    return new NextResponse("Internal Error", { status: 500 });
  }
}
