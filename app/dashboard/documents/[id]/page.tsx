import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  FileText,
  ArrowLeft,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatFileSize } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDocumentButton } from "@/components/delete-document-button";
import { DocumentAnalysisPanel } from "@/components/document-analysis-panel";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  const document = await db.document.findFirst({
    where: {
      id: id,
      organizationId: orgId || "none_for_personal",
    },
  });

  if (!document) notFound();

  const hasAnalysis = !!(document.aiSummary || document.content);

  return (
    <div className="flex flex-col h-full space-y-8 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ================= NAVIGATION & HEADER ================= */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl shadow-sm">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
                {document.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>
                    {new Date(document.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0" />
                  <span>
                    {formatFileSize(document.fileSize ?? 0)} (
                    {document.fileType?.toUpperCase() || "PDF"})
                  </span>
                </div>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                {hasAnalysis ? (
                  <Badge className="h-5 px-2 text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200 font-bold shadow-none flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    <span>INSIGHTS READY</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="h-5 px-2 text-[10px] text-amber-600 border-amber-200 bg-amber-50/50 font-bold shadow-none flex items-center gap-1.5"
                  >
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>AWAITING ANALYSIS</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              asChild
              className="rounded-xl shadow-sm hover:bg-muted/50"
            >
              <a
                href={document.fileUrl ?? undefined}
                target="_blank"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4 shrink-0" />
                <span>View Original</span>
              </a>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-muted/50 border"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                <DropdownMenuItem asChild>
                  <a
                    href={document.fileUrl ?? undefined}
                    download={document.name}
                    className="flex items-center gap-3 cursor-pointer rounded-lg p-2.5"
                  >
                    <Download className="h-4 w-4 shrink-0" />
                    <span className="font-bold text-sm">Download File</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteDocumentButton
                  documentId={document.id}
                  redirectPath="/dashboard"
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ================= ANALYSIS PANEL ================= */}
      <DocumentAnalysisPanel
        documentId={document.id}
        initialSummary={document.aiSummary}
        initialSentiment={document.sentiment}
        initialKeywords={document.aiKeywords as string[]}
        initialContent={document.content}
      />
    </div>
  );
}
