import { SurveyStatus } from "../types/survey";

export const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

// Styles
export const getStatusStyles = (status: string) => {
  switch (status) {
    case SurveyStatus.PUBLISHED:
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case SurveyStatus.DRAFT:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    case SurveyStatus.CLOSED:
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export const filterStyles: Record<string, string> = {
  PUBLISHED:
    "border-green-500/50 text-green-400 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
  DRAFT:
    "border-gray-500/50 text-gray-400 bg-gray-500/5 shadow-[0_0_15px_rgba(107,114,128,0.1)]",
  CLOSED:
    "border-red-500/50 text-red-400 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  ALL: "border-blue-500/50 text-blue-400 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;