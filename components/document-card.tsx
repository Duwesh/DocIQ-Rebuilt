import { FileText, Tag, MessageSquare } from "lucide-react";

export function DocumentCard({ doc }: { doc: any }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="h-6 w-6 text-blue-500" />
        <h3 className="font-semibold truncate">{doc.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
        {doc.aiSummary || "No summary available. Start analysis to generate one."}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {doc.aiKeywords?.map((keyword: string) => (
          <span key={keyword} className="bg-secondary px-2 py-1 rounded-md text-xs">
            {keyword}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Tag className="h-3 w-3" />
          <span>{doc.sentiment || "Neutral"}</span>
        </div>
      </div>
    </div>
  );
}
