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
  Sparkles,
  Download,
  Eye,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { formatFileSize } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnalysisButton } from "@/components/analysis-button";
import { DeleteDocumentButton } from "@/components/delete-document-button";

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
                   <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(document.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                   </div>
                   <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                   <div className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" />
                      {formatFileSize(document.fileSize ?? 0)} ({document.fileType?.toUpperCase() || "PDF"})
                   </div>
                   <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
                   {document.aiSummary ? (
                      <Badge className="h-5 px-2 text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200 font-bold gap-1 shadow-none">
                         <CheckCircle2 className="h-3 w-3" /> INSIGHTS READY
                      </Badge>
                   ) : (
                      <Badge variant="outline" className="h-5 px-2 text-[10px] text-amber-600 border-amber-200 bg-amber-50/50 font-bold gap-1 shadow-none">
                         <Clock className="h-3 w-3" /> AWAITING ANALYSIS
                      </Badge>
                   )}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <Button variant="outline" asChild className="rounded-xl shadow-sm hover:bg-muted/50">
                <a href={document.fileUrl ?? undefined} target="_blank" className="flex items-center gap-2">
                   <Eye className="h-4 w-4" /> View Original
                </a>
             </Button>
             
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50 border">
                      <MoreVertical className="h-4 w-4" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                   <DropdownMenuItem asChild>
                      <a href={document.fileUrl ?? undefined} download={document.name} className="flex items-center cursor-pointer">
                         <Download className="h-4 w-4 mr-2" /> Download File
                      </a>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DeleteDocumentButton documentId={document.id} redirectPath="/dashboard" />
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-fit">
        {/* ANALYSIS PANEL (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-[2rem] overflow-hidden shadow-lg min-h-[600px] h-[calc(100vh-320px)] flex flex-col group transition-all duration-300 hover:shadow-xl">
             <div className="bg-linear-to-r from-blue-600/5 to-transparent px-8 py-5 border-b shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg text-blue-900/80">
                   <Sparkles className="h-5 w-5 text-blue-500" />
                   AI Intelligence Research
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                      {document.sentiment ?? "Standardized Analysis"}
                   </span>
                </div>
             </div>
             
             <ScrollArea className="flex-1 w-full bg-white/40 dark:bg-black/20 backdrop-blur-sm">
                <div className="p-6 sm:p-10 prose prose-blue dark:prose-invert max-w-none wrap-break-word">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {document.aiSummary ?? "This document is currently in PQ (Processing Queue). Run a deep analysis to extract core insights."}
                   </ReactMarkdown>
                </div>
             </ScrollArea>
             
             <div className="px-8 py-3 bg-muted/10 border-t shrink-0">
                <p className="text-[10px] text-muted-foreground/60 text-center font-medium tracking-wide">
                   DocIQ can make mistakes. Please verify all AI-generated insights for critical documents.
                </p>
             </div>
          </div>
        </div>

        {/* METADATA PANEL (Right 1/3) */}
        <div className="space-y-6 h-full">
           {/* KEYWORDS CARD */}
           <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                 <Tag className="h-4 w-4 text-blue-500" /> Key Entities
              </h3>
              <div className="flex flex-wrap gap-2.5">
                 {document.aiKeywords && Array.isArray(document.aiKeywords) && document.aiKeywords.length > 0 ? (
                    (document.aiKeywords as string[]).map((tag: string) => (
                       <span 
                          key={tag}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors cursor-default"
                       >
                          #{tag}
                       </span>
                    ))
                 ) : (
                    <p className="text-xs text-muted-foreground italic">No entities extracted yet.</p>
                 )}
              </div>
           </div>

           {/* ACTIONS CARD */}
           {(!document.aiSummary) && (
              <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl space-y-6">
                 <div className="space-y-2">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                       <Sparkles className="h-5 w-5" /> Analyze Deeply
                    </h3>
                    <p className="text-blue-50/80 text-sm leading-relaxed">
                       Extract hidden insights, summaries, and key data points from this file using Gemini Pro.
                    </p>
                 </div>
                 <AnalysisButton 
                    documentId={document.id}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl py-6 text-lg transition-transform active:scale-[0.98]"
                 />
              </div>
           )}

           {/* FILE INFO CARD */}
           <div className="bg-muted/30 border border-dashed rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Technical Registry</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Registry ID</span>
                    <span className="font-mono">{document.id.slice(0, 12)}...</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-bold uppercase tracking-widest">{document.fileType || "PDF"}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Cloud Link</span>
                    <Link href={document.fileUrl ?? "#"} target="_blank" className="text-blue-600 underline truncate max-w-[120px]">
                       View Blob
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
