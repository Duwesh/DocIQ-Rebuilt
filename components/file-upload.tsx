"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      if (response.ok) {
        toast.success("File uploaded successfully");
        setFile(null);
        router.refresh();
      } else {
        toast.error("Cloud storage error");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-10">
      <Upload className="h-10 w-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
      <input
        type="file"
        className="hidden"
        id="fileInput"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Select File
      </label>
      {file && (
        <div className="flex items-center gap-2">
          <span>{file.name}</span>
          <button onClick={() => setFile(null)}><X className="h-4 w-4" /></button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-1 text-white hover:bg-green-700"
          >
            {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUploading ? "Uploading..." : "Confirm Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
