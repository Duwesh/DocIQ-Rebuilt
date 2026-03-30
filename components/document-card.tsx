"use client";

import { useState } from "react";
import {
  Tag,
  FileText,
  Sparkles,
  Loader2,
  MoreVertical,
  Eye,
  Trash,
  Download,
} from "lucide-react";
import { formatFileSize, analysisTypes } from "@/app/data/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

export function DocumentCard({ doc }: { doc: any }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  
  const isAnalyzed = !!doc.aiSummary;

  const handleAnalyze = async (type: string) => {
    try {
      setIsAnalyzing(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          documentId: doc.id,
          analysisType: type,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze");

      toast.success(`${type.toUpperCase()} analysis completed`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border bg-card p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition h-[480px] overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-blue-100 p-2 rounded-lg shrink-0">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-base md:text-lg truncate">
              {doc.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
               <p className="text-xs text-muted-foreground shrink-0">
                 {formatFileSize(doc.fileSize)}
               </p>
               <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
               {isAnalyzed ? (
                 <Badge variant="secondary" className="h-4 px-1.5 text-[9px] bg-emerald-50 text-emerald-600 border-emerald-100 font-bold gap-1 shadow-none">
                    <CheckCircle2 className="h-2.5 w-2.5" /> ANALYZED
                 </Badge>
               ) : (
                 <Badge variant="outline" className="h-4 px-1.5 text-[9px] text-amber-600 border-amber-200 bg-amber-50/50 font-bold gap-1 shadow-none">
                    <Clock className="h-2.5 w-2.5 text-amber-500" /> PENDING
                 </Badge>
               )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(doc.fileUrl, "_blank")}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" /> View
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <a href={doc.fileUrl} download={doc.name} className="flex items-center cursor-pointer">
                <Download className="h-4 w-4 mr-2" /> Download
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive cursor-pointer">
              <Trash className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ================= CONTENT (SCROLL + MARKDOWN) ================= */}
      <div className="flex-1 overflow-hidden mb-4 min-h-0 bg-muted/30 rounded-xl border border-dashed border-muted/50 p-1">
        <ScrollArea className="h-full w-full">
          <div className="p-3 prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-muted/50 text-gray-700 break-words dark:text-gray-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {doc.aiSummary ||
                "No insights yet. Use AI Analysis to extract summary and data from your document."}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </div>

      {/* ================= KEYWORDS ================= */}
      <div className="shrink-0 mb-4 min-h-[32px]">
        {doc.aiKeywords?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {doc.aiKeywords.slice(0, 5).map((keyword: string) => (
              <span
                key={keyword}
                className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-blue-100"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-between pt-3 border-t mt-auto shrink-0">
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
            {doc.sentiment || "Neutral Tone"}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={isAnalyzing}
              size="sm"
              className="h-9 gap-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              {isAnalyzing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {isAnalyzed ? "Re-analyze" : "Analyze"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 rounded-xl p-1.5" align="end">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">
              Choose Analysis Type
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {analysisTypes.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => handleAnalyze(type.value)}
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary transition-all group"
              >
                <div className="p-1.5 rounded-md bg-background border border-muted group-hover:border-primary/20 group-hover:bg-primary/5 transition-all shrink-0">
                  <type.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-bold text-xs">{type.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {type.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
