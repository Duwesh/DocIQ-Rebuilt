"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { analysisTypes } from "@/app/data/data";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocumentAnalysisPanelProps {
  documentId: string;
  initialSummary: string | null;
  initialSentiment: string | null;
  initialKeywords: string[];
  initialContent: string | null;
}

type AnalysisState = "idle" | "analyzing" | "done" | "error";

function parseSentimentLabel(raw: string | null): {
  label: string;
  color: string;
} {
  if (!raw) return { label: "Pending", color: "text-muted-foreground" };
  try {
    const parsed = JSON.parse(raw);
    const sentiment = parsed.overall_sentiment?.toLowerCase() ?? "neutral";
    const colorMap: Record<string, string> = {
      positive: "text-emerald-600",
      negative: "text-red-500",
      neutral: "text-slate-500",
      mixed: "text-amber-600",
    };
    return {
      label: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
      color: colorMap[sentiment] || "text-muted-foreground",
    };
  } catch {
    return { label: "Analyzed", color: "text-muted-foreground" };
  }
}

export function DocumentAnalysisPanel({
  documentId,
  initialSummary,
  initialSentiment,
  initialKeywords,
  initialContent,
}: DocumentAnalysisPanelProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [sentiment, setSentiment] = useState(initialSentiment);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [content, setContent] = useState(initialContent);
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [activeType, setActiveType] = useState<string | null>(null);
  const router = useRouter();

  const sentimentDisplay = parseSentimentLabel(sentiment);

  const handleAnalyze = async (type: string) => {
    setAnalysisState("analyzing");
    setActiveType(type);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, analysisType: type }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Analysis failed");
      }

      const updatedDoc = await res.json();

      // Update local state from the response
      if (updatedDoc.aiSummary !== undefined) setSummary(updatedDoc.aiSummary);
      if (updatedDoc.sentiment !== undefined) setSentiment(updatedDoc.sentiment);
      if (updatedDoc.aiKeywords !== undefined) setKeywords(updatedDoc.aiKeywords);
      if (updatedDoc.content !== undefined) setContent(updatedDoc.content);

      setAnalysisState("done");
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} analysis complete`);
      router.refresh();

      setTimeout(() => {
        setAnalysisState("idle");
        setActiveType(null);
      }, 2000);
    } catch (error: any) {
      setAnalysisState("error");
      toast.error(error.message || "Analysis failed. Please try again.");
      setTimeout(() => {
        setAnalysisState("idle");
        setActiveType(null);
      }, 3000);
    }
  };

  const activeLabel = activeType
    ? analysisTypes.find((t) => t.value === activeType)?.label ?? activeType
    : "";

  // Determine what to show in the content area
  const displayContent = summary || content;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-280px)] min-h-[500px] max-h-[900px]">
      {/* ANALYSIS PANEL (Left 2/3) */}
      <div className="lg:col-span-2 min-h-0">
        <div className="bg-card border rounded-[2rem] overflow-hidden shadow-lg h-full flex flex-col group transition-all duration-300 hover:shadow-xl relative">
          <div className="bg-linear-to-r from-blue-600/5 to-transparent px-8 py-5 border-b shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg text-blue-900/80">
              <Sparkles className="h-5 w-5 shrink-0 text-blue-500" />
              <span>AI Intelligence Research</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${sentimentDisplay.color}`}
              >
                {sentimentDisplay.label}
              </span>
            </div>
          </div>

          {/* Loading overlay */}
          {analysisState === "analyzing" && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                <div className="relative bg-blue-600 rounded-full p-4">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-foreground">
                  Running {activeLabel} Analysis
                </p>
                <p className="text-sm text-muted-foreground">
                  Processing document with Gemini AI...
                </p>
                <div className="flex items-center justify-center gap-1 pt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Done overlay */}
          {analysisState === "done" && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
              <div className="bg-emerald-600 rounded-full p-4">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-bold text-emerald-600">
                {activeLabel} Analysis Complete
              </p>
            </div>
          )}

          {/* Error overlay */}
          {analysisState === "error" && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
              <div className="bg-red-600 rounded-full p-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-lg font-bold text-red-600">
                Analysis Failed
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again
              </p>
            </div>
          )}

          <ScrollArea className="flex-1 min-h-0 w-full bg-white/40 dark:bg-black/20 backdrop-blur-sm">
            <div className="p-6 sm:p-10 prose prose-blue dark:prose-invert max-w-none break-words">
              {displayContent ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {displayContent}
                </ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="bg-blue-50 rounded-full p-5">
                    <Sparkles className="h-10 w-10 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-foreground/70">
                      No analysis yet
                    </p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Choose an analysis type from the panel on the right to
                      extract insights from this document.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="px-8 py-3 bg-muted/10 border-t shrink-0">
            <p className="text-[10px] text-muted-foreground/60 text-center font-medium tracking-wide">
              DocIQ can make mistakes. Please verify all AI-generated insights
              for critical documents.
            </p>
          </div>
        </div>
      </div>

      {/* METADATA PANEL (Right 1/3) */}
      <div className="space-y-6 h-full overflow-y-auto pr-1">
        {/* ANALYSIS OPTIONS CARD */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0" />
              <span>
                {displayContent ? "Run Analysis" : "Choose Analysis"}
              </span>
            </h3>
            <p className="text-blue-50/70 text-sm leading-relaxed">
              {displayContent
                ? "Re-run or try a different analysis type."
                : "Select what you want to extract from this document."}
            </p>
          </div>

          <div className="space-y-2">
            {analysisTypes.map((type) => (
              <Button
                key={type.value}
                onClick={() => handleAnalyze(type.value)}
                disabled={analysisState === "analyzing"}
                className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/10 rounded-xl py-3 h-auto justify-start gap-3 font-medium transition-all cursor-pointer disabled:opacity-50"
              >
                {analysisState === "analyzing" &&
                activeType === type.value ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <type.icon className="h-4 w-4 shrink-0" />
                )}
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-bold">{type.label}</span>
                  <span className="text-[10px] text-white/60 leading-tight">
                    {type.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* KEYWORDS CARD */}
        {keywords.length > 0 && (
          <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="h-4 w-4 shrink-0 text-blue-500">
                #
              </span>
              <span>Keywords</span>
            </h3>
            <div className="flex flex-wrap gap-2.5 max-h-[200px] overflow-y-auto">
              {keywords.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
