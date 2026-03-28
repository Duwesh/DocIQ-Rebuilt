"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { analysisTypes } from "@/app/data/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AnalysisButtonProps {
  documentId: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  label?: string;
}

export function AnalysisButton({ 
  documentId, 
  className, 
  variant = "default", 
  size = "default",
  showLabel = true,
  label
}: AnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (type: string) => {
    try {
      setIsAnalyzing(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          documentId,
          analysisType: type,
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze");

      toast.success(`${type.toUpperCase()} analysis initiated`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Deep analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          disabled={isAnalyzing}
          variant={variant}
          size={size}
          className={className}
        >
          {isAnalyzing ? (
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          ) : (
            <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          {showLabel && (
             <span className="ml-2 flex items-center gap-1.5 whitespace-nowrap">
               {isAnalyzing ? "Processing..." : (label || "Analyze")}
               <ChevronDown className="h-3 w-3 opacity-50" />
             </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-muted shadow-2xl">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">
          Intelligence Protocol
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-muted/50 my-1" />
        {analysisTypes.map((type) => (
          <DropdownMenuItem 
            key={type.value} 
            onClick={() => handleAnalyze(type.value)}
            className="rounded-xl flex items-center gap-3 p-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-all group"
          >
            <div className="p-2 rounded-lg bg-background border border-muted group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
              <type.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-xs">{type.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {type.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
