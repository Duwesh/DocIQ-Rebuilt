"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 px-5 py-2.5 h-auto text-sm font-bold shadow-md hover:shadow-lg group transition-all active:scale-[0.98] border border-white/20">
          <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
          Ingest Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-[3rem] p-0 overflow-hidden border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.6)] bg-background">
        <div className="bg-linear-to-br from-primary via-blue-600 to-accent p-8 text-white relative h-[200px] flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Plus className="h-36 w-36 rotate-12" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]" />

          <DialogHeader className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white mb-4 w-fit">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Secure Protocol
            </div>
            <DialogTitle className="text-3xl font-black tracking-tighter text-white mb-2 leading-none">
              Asset Ingestion
            </DialogTitle>
            <DialogDescription className="text-white/80 font-medium text-sm max-w-md leading-snug">
              Upload your document. You&apos;ll choose how to analyze it next.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-8 bg-linear-to-b from-white/2 to-transparent">
          <FileUpload
            onSuccess={(documentId) => {
              setOpen(false);
              router.push(`/dashboard/documents/${documentId}`);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
