"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  redirectPath,
}: DeleteDocumentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete record");

      toast.success("Document deleted successfully");

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
      setShowConfirm(false);
    }
  };

  const trigger =
    variant === "menuitem" ? (
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        disabled={isDeleting}
        className={cn(
          "text-destructive cursor-pointer p-2.5 rounded-lg focus:bg-destructive/10 focus:text-destructive group/delete flex items-center gap-3",
          className
        )}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        ) : (
          <Trash className="h-4 w-4 shrink-0 group-hover/delete:scale-110 transition-transform" />
        )}
        <span className="font-bold text-sm">Delete Document</span>
      </DropdownMenuItem>
    ) : (
      <button
        onClick={() => setShowConfirm(true)}
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

  return (
    <>
      {trigger}

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10">
              <TriangleAlert className="text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document and all associated
              analysis data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 shrink-0" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
