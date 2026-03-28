"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { allowedTypes, formatFileSize } from "@/app/data/data";

interface FileUploadProps {
  onSuccess?: () => void;
}

export function FileUpload({ onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      toast.success("File uploaded successfully");
      setFile(null);
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-10">
      <Upload className="h-10 w-10 text-muted-foreground" />
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
        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Select File
      </label>
      {file && (
        <div className="flex flex-col items-center gap-3 mt-4 border rounded-xl p-4 bg-gray-50/50 w-full max-w-md">
          <div className="flex items-center gap-2 w-full">
            <span className="font-medium truncate flex-1">{file.name}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              ({formatFileSize(file.size)})
            </span>
            <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-600 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUploading ? "Uploading..." : "Confirm Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
