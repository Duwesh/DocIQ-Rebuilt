import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DocumentTable, DocumentTableSkeleton } from "@/components/document-table";
import { Suspense } from "react";
import { 
  Plus, 
  FileStack, 
  Search,
  Filter
} from "lucide-react";
import { UploadDialog } from "@/components/upload-dialog";
import { Button } from "@/components/ui/button";

/**
 * Documents Registry Page
 * Provides a high-level overview of intelligence assets.
 */

import { RegistryView } from "@/components/registry-view";

async function DocumentRegistry() {
  const { userId } = await auth();
  if (!userId) return null;

  // Show all documents uploaded by the current user (across all orgs)
  const documents = await db.document.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: "desc" },
  });

  return <RegistryView initialDocuments={documents} />;
}

export default async function DocumentsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 font-sans">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 px-6 rounded-[3rem] bg-linear-to-br from-primary/10 via-background to-accent/5 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Intelligence Protocol
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <FileStack className="h-10 w-10 text-primary" />
            </div>
            Registry Index
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl leading-relaxed">
            A real-time, high-fidelity ledger of your organization's recorded knowledge. 
            Filter, search, and export intelligence assets with one tap.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <UploadDialog />
        </div>
      </div>

      {/* ================= REGISTRY CONTENT ================= */}
      <div className="space-y-6">
        <Suspense fallback={<DocumentTableSkeleton />}>
          <DocumentRegistry />
        </Suspense>
      </div>
    </div>
  );
}
