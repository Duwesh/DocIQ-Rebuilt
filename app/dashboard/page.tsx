import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { db } from "@/lib/db";
import { DocumentCard } from "@/components/document-card";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();

  if (!userId) redirect("/sign-in");

  const documents = await db.document.findMany({
    where: {
      organizationId: orgId || "none_for_personal",
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Documents</h1>
        <p className="text-muted-foreground">Manage and analyze your files with AI intelligence.</p>
      </div>
      <FileUpload />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
