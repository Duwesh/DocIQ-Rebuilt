import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { db } from "@/lib/db";
import { DocumentTable, DocumentTableSkeleton } from "@/components/document-table";
import { Suspense } from "react";

async function DocumentRegistry() {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const documents = await db.document.findMany({
    where: {
      organizationId: orgId || "none_for_personal",
    },
    orderBy: { createdAt: "desc" },
  });

  return <DocumentTable documents={documents} />;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Documents</h1>
        <p className="text-muted-foreground font-medium">Manage and analyze your files with AI intelligence.</p>
      </div>
      <FileUpload />
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 px-2">
          Document Registry
        </h2>
        <Suspense fallback={<DocumentTableSkeleton />}>
          <DocumentRegistry />
        </Suspense>
      </div>
    </div>
  );
}
