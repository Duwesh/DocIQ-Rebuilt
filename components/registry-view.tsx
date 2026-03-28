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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* ================= UTILITY BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-[2.5rem] glass-card">
         <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full md:w-[450px] shadow-inner group focus-within:ring-2 focus-within:ring-primary/40 transition-all duration-300">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
               placeholder="Search intelligence records..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none outline-hidden text-base font-semibold w-full placeholder:text-muted-foreground/50 text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
         </div>
         
         <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 px-8 py-6 h-auto text-base font-bold transition-all hover:scale-[1.02] relative">
                  <Filter className="h-5 w-5 mr-3 text-primary" /> 
                  Filter
                  {activeFiltersCount > 0 && (
                     <Badge className="ml-2 bg-primary text-white h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px] animate-in zoom-in">
                        {activeFiltersCount}
                     </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl glass-card border-white/10 shadow-2xl">
                <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground p-3">Analysis Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem 
                  checked={statusFilter === "ready"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "ready" ? null : "ready")}
                  className="rounded-xl flex items-center gap-2 p-3 font-bold text-sm cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Insights Ready
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={statusFilter === "pending"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "pending" ? null : "pending")}
                  className="rounded-xl flex items-center gap-2 p-3 font-bold text-sm cursor-pointer"
                >
                  <Clock className="h-4 w-4 text-amber-500" /> Analyzing...
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                
                <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground p-3">File Extensions</DropdownMenuLabel>
                {["pdf", "docx", "txt", "xlsx"].map((type) => (
                  <DropdownMenuCheckboxItem 
                    key={type}
                    checked={typeFilter.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) setTypeFilter([...typeFilter, type]);
                      else setTypeFilter(typeFilter.filter(t => t !== type));
                    }}
                    className="rounded-xl p-3 font-bold text-sm uppercase cursor-pointer"
                  >
                    .{type}
                  </DropdownMenuCheckboxItem>
                ))}

                {(statusFilter || typeFilter.length > 0) && (
                   <>
                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                    <DropdownMenuItem 
                      onClick={() => { setStatusFilter(null); setTypeFilter([]); }}
                      className="rounded-xl p-3 font-bold text-sm text-destructive hover:text-white hover:bg-destructive/10 cursor-pointer flex justify-center"
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
              className="rounded-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 px-8 py-6 h-auto text-base font-bold transition-all text-primary hover:scale-[1.02]"
            >
               <Download className="h-5 w-5 mr-3" /> Export CSV
            </Button>
         </div>
      </div>

      {/* ================= REGISTRY CONTENT ================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold tracking-tight text-white/80">
              {searchQuery || statusFilter || typeFilter.length > 0 ? "Filtered Pipeline" : "Intelligence Assets"}
            </h3>
            <Badge variant="outline" className="rounded-full bg-white/5 border-white/10 text-muted-foreground font-black text-[10px]">
              {filteredDocuments.length} Records Found
            </Badge>
          </div>
          <div className="h-px flex-1 bg-linear-to-r from-white/5 to-transparent mx-6" />
        </div>
        
        <div className="p-1 rounded-[2.5rem] bg-linear-to-b from-white/10 to-transparent">
          <div className="rounded-[2.4rem] overflow-hidden glass-card">
            <DocumentTable documents={filteredDocuments} />
          </div>
        </div>
      </div>
    </div>
  );
}
