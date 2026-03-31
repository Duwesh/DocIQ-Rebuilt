"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { allowedTypes, formatFileSize } from "@/app/data/data";

interface FileUploadProps {
  onSuccess?: (documentId: string) => void;
}

export function FileUpload({ onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      toast.success("Document uploaded — choose an analysis type");
      setFile(null);

      if (onSuccess) {
        onSuccess(data.id);
      } else {
        router.push(`/dashboard/documents/${data.id}`);
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-6">
      <Upload className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Click to upload or drag and drop
      </p>
      <input
        type="file"
        className="hidden"
        id="fileInput"
        accept={allowedTypes.join(",")}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer rounded-md bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary/90"
      >
        Select File
      </label>
      {file && (
        <div className="flex flex-col items-center gap-2 mt-3 border rounded-lg p-3 bg-gray-50/50 w-full max-w-md">
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm font-medium truncate flex-1">{file.name}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({formatFileSize(file.size)})
            </span>
            <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-600 transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isUploading ? "Uploading..." : "Confirm Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
