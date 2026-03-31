"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  FileStack,
  ChevronDown,
  CheckCircle2,
  Clock,
  X
} from "lucide-react";
import { DocumentTable } from "@/components/document-table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RegistryViewProps {
  initialDocuments: any[];
}

export function RegistryView({ initialDocuments }: RegistryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  // 1. FILTER LOGIC
  const filteredDocuments = useMemo(() => {
    return initialDocuments.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.aiSummary?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || 
                           (statusFilter === "ready" && doc.aiSummary) ||
                           (statusFilter === "pending" && !doc.aiSummary);

      const matchesType = typeFilter.length === 0 || 
                         typeFilter.includes(doc.fileType?.toLowerCase() || "pdf");

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [initialDocuments, searchQuery, statusFilter, typeFilter]);

  // 2. EXPORT LOGIC
  const exportToCSV = () => {
    try {
      if (filteredDocuments.length === 0) {
        toast.error("No records found to export");
        return;
      }

      const headers = ["Name", "Status", "Size", "Type", "Created At", "URL"];
      const rows = filteredDocuments.map(doc => [
        `"${doc.name}"`,
        doc.aiSummary ? "READY" : "ANALYZING",
        doc.fileSize,
        doc.fileType || "pdf",
        new Date(doc.createdAt).toISOString(),
        doc.fileUrl
      ]);

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `DocIQ_Registry_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${filteredDocuments.length} records successfully`);
    } catch (error) {
      toast.error("Failed to generate export");
    }
  };

  const activeFiltersCount = (statusFilter ? 1 : 0) + typeFilter.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* ================= UTILITY BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
         <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full md:w-[360px] shadow-inner group focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
               placeholder="Search records..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none outline-hidden text-sm font-medium w-full placeholder:text-muted-foreground/50 text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-white transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
         </div>

         <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 h-auto text-sm font-bold transition-all relative">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  Filter
                  {activeFiltersCount > 0 && (
                     <Badge className="ml-1.5 bg-primary text-white h-4 w-4 flex items-center justify-center p-0 rounded-full text-[9px] animate-in zoom-in">
                        {activeFiltersCount}
                     </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl glass-card border-white/10 shadow-2xl">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-2">Analysis Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "ready"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "ready" ? null : "ready")}
                  className="rounded-lg flex items-center gap-2 p-2 font-bold text-xs cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Insights Ready
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "pending"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "pending" ? null : "pending")}
                  className="rounded-lg flex items-center gap-2 p-2 font-bold text-xs cursor-pointer"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-500" /> Analyzing...
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator className="bg-white/5 my-1.5" />

                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-2">File Extensions</DropdownMenuLabel>
                {["pdf", "docx", "txt", "xlsx"].map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={typeFilter.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) setTypeFilter([...typeFilter, type]);
                      else setTypeFilter(typeFilter.filter(t => t !== type));
                    }}
                    className="rounded-lg p-2 font-bold text-xs uppercase cursor-pointer"
                  >
                    .{type}
                  </DropdownMenuCheckboxItem>
                ))}

                {(statusFilter || typeFilter.length > 0) && (
                   <>
                    <DropdownMenuSeparator className="bg-white/5 my-1.5" />
                    <DropdownMenuItem
                      onClick={() => { setStatusFilter(null); setTypeFilter([]); }}
                      className="rounded-lg p-2 font-bold text-xs text-destructive hover:text-white hover:bg-destructive/10 cursor-pointer flex justify-center"
                    >
                      Reset All Filters
                    </DropdownMenuItem>
                   </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export Button */}
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 px-4 py-2 h-auto text-sm font-bold transition-all text-primary"
            >
               <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
         </div>
      </div>

      {/* ================= REGISTRY CONTENT ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-white/80">
              {searchQuery || statusFilter || typeFilter.length > 0 ? "Filtered Pipeline" : "Intelligence Assets"}
            </h3>
            <Badge variant="outline" className="rounded-full bg-white/5 border-white/10 text-muted-foreground font-black text-[9px]">
              {filteredDocuments.length} Records
            </Badge>
          </div>
          <div className="h-px flex-1 bg-linear-to-r from-white/5 to-transparent mx-4" />
        </div>

        <div className="p-0.5 rounded-2xl bg-linear-to-b from-white/10 to-transparent">
          <div className="rounded-[0.9rem] overflow-hidden glass-card">
            <DocumentTable documents={filteredDocuments} />
          </div>
        </div>
      </div>
    </div>
  );
}
