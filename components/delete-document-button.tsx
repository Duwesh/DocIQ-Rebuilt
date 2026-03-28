"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DeleteDocumentButtonProps {
  documentId: string;
  variant?: "menuitem" | "button";
  className?: string;
  redirectPath?: string;
}

export function DeleteDocumentButton({ 
  documentId, 
  variant = "menuitem",
  className,
  redirectPath
}: DeleteDocumentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this document registry? This action is IRREVERSIBLE.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete record");

      toast.success("Document registry purged successfully");
      
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Deletion failed. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (variant === "menuitem") {
    return (
      <DropdownMenuItem 
        onClick={handleDelete} 
        disabled={isDeleting}
        className={cn(
          "text-destructive cursor-pointer p-3 rounded-xl focus:bg-destructive/10 focus:text-destructive group/delete",
          className
        )}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 mr-3 animate-spin" />
        ) : (
          <Trash className="h-4 w-4 mr-3 group-hover/delete:scale-110 transition-transform" /> 
        )}
        <span className="font-bold text-sm">Delete Ledger Record</span>
      </DropdownMenuItem>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={cn(
        "flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors disabled:opacity-50",
        className
      )}
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
      <span className="font-medium">Delete</span>
    </button>
  );
}
