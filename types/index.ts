export type AnalysisType =
  | "summary"
  | "qa"
  | "sentiment"
  | "entities"
  | "extract"
  | "keywords";

export interface Document {
  id: string;
  name: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  aiSummary?: string;
  aiKeywords: string[];
  sentiment?: string;
  createdAt: string;
  user: {
    name?: string;
    email: string;
  };
}
