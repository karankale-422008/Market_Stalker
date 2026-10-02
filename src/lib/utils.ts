import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return "Invalid Date";
    return format(date, "dd MMM yyyy, hh:mm a");
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Just now";
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return "Recently";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Recently";
  }
}

export function getSentimentBadgeClass(sentiment: string | undefined): {
  bg: string;
  text: string;
  border: string;
} {
  switch (sentiment?.toLowerCase()) {
    case "bullish":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-950/40",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
      };
    case "bearish":
      return {
        bg: "bg-rose-500/10 dark:bg-rose-950/40",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/30",
      };
    case "neutral":
    default:
      return {
        bg: "bg-slate-500/10 dark:bg-slate-800/60",
        text: "text-slate-600 dark:text-slate-400",
        border: "border-slate-500/30",
      };
  }
}

export function getImportanceBadgeClass(importance: number = 50): {
  bg: string;
  text: string;
  label: string;
} {
  if (importance >= 80) {
    return {
      bg: "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400",
      text: "text-amber-600 dark:text-amber-400",
      label: "Critical (High Impact)",
    };
  } else if (importance >= 50) {
    return {
      bg: "bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-400",
      text: "text-blue-600 dark:text-blue-400",
      label: "Significant",
    };
  } else {
    return {
      bg: "bg-slate-500/15 border-slate-500/30 text-slate-600 dark:text-slate-400",
      text: "text-slate-600 dark:text-slate-400",
      label: "Routine",
    };
  }
}
