import { AnalysisType } from "@/types";
import {
  Brain,
  Hash,
  List,
  MessageCircle,
  MessageSquare,
  Shield,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";

export const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Get instant summaries and insights with Google Gemini AI",
  },
  {
    icon: Users,
    title: "Multi-Tenant",
    description: "Separate organizations with isolated document storage",
  },
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag & drop or select files in multiple formats",
  },
  {
    icon: Shield,
    title: "Secure",
    description: "Your documents are encrypted and stored securely",
  },
];

export const steps = [
  "Sign up for free account",
  "Create an organization",
  "Upload documents",
  "Get AI analysis instantly",
];

export const allowedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "text/markdown",
];

export const analysisTypes: {
  value: AnalysisType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}[] = [
  {
    value: "summary",
    label: "Summary",
    description: "Generate comprehensive document summary",
    icon: Sparkles,
  },
  {
    value: "qa",
    label: "Q&A",
    description: "Generate questions and answers from document",
    icon: MessageCircle,
  },
  {
    value: "sentiment",
    label: "Sentiment",
    description: "Analyze tone and emotional sentiment",
    icon: MessageSquare,
  },
  {
    value: "entities",
    label: "Entities",
    description: "Extract names, places, organizations",
    icon: Hash,
  },
  {
    value: "extract",
    label: "Extract",
    description: "Extract structured information",
    icon: List,
  },
];

// Format file size
export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return bytes + " bytes";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
