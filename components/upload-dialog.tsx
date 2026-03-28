"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-primary hover:bg-primary/90 px-8 py-7 h-auto text-lg font-black shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] group transition-all active:scale-[0.98] border border-white/20">
          <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
          Ingest Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-[3rem] p-0 overflow-hidden border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.6)] bg-background">
        <div className="bg-linear-to-br from-primary via-blue-600 to-accent p-12 text-white relative h-[280px] flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Plus className="h-48 w-48 rotate-12" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]" />
          
          <DialogHeader className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white mb-4 w-fit">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Secure Protocol
            </div>
            <DialogTitle className="text-5xl font-black tracking-tighter text-white mb-4 leading-none">
              Asset Ingestion
            </DialogTitle>
            <DialogDescription className="text-white/80 font-medium text-lg max-w-md leading-snug">
              Securely register your intelligence assets. 
              Our neural engines will begin extraction immediately.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-12 bg-linear-to-b from-white/2 to-transparent">
          <FileUpload onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
