"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import Link from "next/link";
import { DeleteDocumentButton } from "@/components/delete-document-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

import { AnalysisButton } from "@/components/analysis-button";

interface DocumentTableProps {
  documents: any[];
  isLoading?: boolean;
}

export function DocumentTable({ documents, isLoading }: DocumentTableProps) {
  const router = useRouter();
  if (isLoading) {
    return <DocumentTableSkeleton />;
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 border-2 border-dashed rounded-[2rem] bg-muted/20">
        <FileText className="h-10 w-10 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground font-medium">No documents found in this workspace.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b h-14">
            <TableHead className="w-[45%] pl-8">Document Name</TableHead>
            <TableHead className="w-[10%] text-center">Type</TableHead>
            <TableHead className="w-[20%] text-center px-4 font-bold uppercase tracking-widest text-[10px]">Analysis Status</TableHead>
            <TableHead className="w-[10%] text-center">Size</TableHead>
            <TableHead className="w-[15%] text-center px-4 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="group transition-colors h-[80px]">
              <TableCell className="font-medium px-4 pl-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110 duration-300 shrink-0 shadow-sm shadow-blue-100">
                    <FileText className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link 
                      href={`/dashboard/documents/${doc.id}`}
                      className="text-sm font-bold truncate hover:text-blue-600 transition flex items-center gap-2 group/title"
                    >
                      {doc.name}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/title:opacity-100 transition translate-x-1 group-hover/title:translate-x-0" />
                    </Link>
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 mt-0.5 uppercase tracking-wide">
                       Registered on {new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {doc.aiKeywords && doc.aiKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {doc.aiKeywords.slice(0, 5).map((kw: string) => (
                          <span 
                            key={kw}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-primary/8 border border-primary/15 text-primary text-[9px] font-bold uppercase tracking-wider"
                          >
                            {kw}
                          </span>
                        ))}
                        {doc.aiKeywords.length > 5 && (
                          <span className="text-[9px] text-muted-foreground font-bold self-center">
                            +{doc.aiKeywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center px-4">
                 <Badge 
                    variant="outline" 
                    className="h-6 px-3 text-[10px] bg-background border-muted-foreground/20 font-bold tracking-widest shadow-none"
                 >
                    {doc.fileType?.toUpperCase() || "PDF"}
                 </Badge>
              </TableCell>

              {/* Analysis Status Column */}
              <TableCell className="px-4">
               <div className="flex flex-col items-center gap-1.5">
                 {!doc.aiSummary && !doc.sentiment && (!doc.aiKeywords || doc.aiKeywords.length === 0) ? (
                   <Badge variant="outline" className="rounded-full bg-amber-500/10 border-amber-500/20 text-amber-600 font-black text-[9px] tracking-widest px-2 py-0.5 flex items-center gap-1.5">
                     <Clock className="h-2.5 w-2.5" />
                     NOT ANALYZED
                   </Badge>
                 ) : (
                   <div className="flex flex-wrap justify-center gap-1">
                     {doc.aiSummary && (
                       <Badge variant="outline" className="rounded-full bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-black text-[9px] px-2 py-0.5 flex items-center gap-1">
                         <CheckCircle2 className="h-2.5 w-2.5" /> Summary
                       </Badge>
                     )}
                     {doc.sentiment && (
                       <Badge variant="outline" className="rounded-full bg-blue-500/10 border-blue-500/20 text-blue-600 font-black text-[9px] px-2 py-0.5 flex items-center gap-1">
                         <CheckCircle2 className="h-2.5 w-2.5" /> Sentiment
                       </Badge>
                     )}
                     {doc.aiKeywords && doc.aiKeywords.length > 0 && (
                       <Badge variant="outline" className="rounded-full bg-purple-500/10 border-purple-500/20 text-purple-600 font-black text-[9px] px-2 py-0.5 flex items-center gap-1">
                         <CheckCircle2 className="h-2.5 w-2.5" /> {doc.aiKeywords.length} Keywords
                       </Badge>
                     )}
                   </div>
                 )}
                 <AnalysisButton 
                    documentId={doc.id} 
                    variant="ghost"
                    size="sm"
                    label={doc.aiSummary ? "Re-analyze" : "Analyze"}
                    className="h-7 rounded-lg text-[9px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                 />
               </div>
             </TableCell>

              <TableCell className="text-center text-xs font-bold text-muted-foreground/80 px-4">
                 {formatFileSize(doc.fileSize ?? 0)}
              </TableCell>

              <TableCell className="text-right px-4 pr-8">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl border border-transparent group-hover:border-muted">
                          <MoreHorizontal className="h-4 w-4" />
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl shadow-xl border-muted/60">
                       <DropdownMenuItem asChild>
                          <Link href={`/dashboard/documents/${doc.id}`} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg">
                             <Eye className="h-4 w-4 shrink-0 text-blue-500" />
                             <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-bold text-sm">Open Workspace</span>
                                <span className="text-[10px] text-muted-foreground">Detailed Deep Analysis</span>
                             </div>
                          </Link>
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => window.open(doc.fileUrl, "_blank")} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg">
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="font-medium text-sm">View Original PDF</span>
                       </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                          <a href={doc.fileUrl} download={doc.name} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg">
                             <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                             <span className="font-medium text-sm">Download Local Copy</span>
                          </a>
                       </DropdownMenuItem>
                       <DropdownMenuSeparator className="my-1" />
                       <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">
                          Analysis
                       </DropdownMenuLabel>
                       <DropdownMenuItem
                          className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg focus:bg-primary/5 focus:text-primary transition-all group"
                          onClick={() => {
                            fetch("/api/analyze", {
                              method: "POST",
                              body: JSON.stringify({ documentId: doc.id, analysisType: "summary" }),
                            }).then(r => {
                               if (r.ok) {
                                  toast.success("Summary analysis initiated");
                                  router.refresh();
                               } else {
                                  toast.error("Analysis failed");
                               }
                            });
                          }}
                       >
                          <Sparkles className="h-4 w-4 shrink-0 text-amber-500 group-hover:scale-110 transition-transform" />
                          <div className="flex flex-col gap-0.5 min-w-0">
                             <span className="font-bold text-xs">Deep Summary</span>
                             <span className="text-[10px] text-muted-foreground">Regenerate insights</span>
                          </div>
                       </DropdownMenuItem>

                       <DropdownMenuSeparator className="my-1" />
                       <DeleteDocumentButton documentId={doc.id} />
                    </DropdownMenuContent>
                 </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DocumentTableSkeleton() {
  return (
    <div className="rounded-[2rem] border bg-card overflow-hidden shadow-sm animate-in fade-in duration-500">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b h-14">
            <TableHead className="w-[45%] pl-8"><Skeleton className="h-4 w-32" /></TableHead>
            <TableHead className="w-[15%] text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
            <TableHead className="w-[15%] text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
            <TableHead className="w-[15%] text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
            <TableHead className="w-[10%] text-right pr-8"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i} className="h-[80px]">
              <TableCell className="pl-8">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24 mx-auto rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
              <TableCell className="pr-8"><Skeleton className="h-8 w-8 ml-auto rounded-xl" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="bg-muted/10 p-4 border-t flex justify-center items-center gap-2">
         <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
         <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Fetching Documents for Organization Ledger...
         </span>
      </div>
    </div>
  );
}
