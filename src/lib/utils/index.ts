import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format timestamp for display */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Generate a random ID */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/** Truncate text to a max length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

/** Convert slug to title case */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Get risk badge color */
export function getRiskColor(risk: "low" | "medium" | "high"): string {
  const map = {
    low: "text-teal-600 bg-teal-50 border-teal-200",
    medium: "text-amber-700 bg-amber-50 border-amber-200",
    high: "text-red-600 bg-red-50 border-red-200",
  };
  return map[risk];
}

/** Get mode accent color */
// Days remaining until an ISO date string (e.g. subscription current_period_end).
// Rounds up so "2 days, 4 hours left" reads as 3, not 2.
export function daysUntil(dateString?: string | null): number | null {
  if (!dateString) return null;
  const target = new Date(dateString).getTime();
  if (Number.isNaN(target)) return null;
  const diffMs = target - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getModeColor(mode: string): string {
  const map: Record<string, string> = {
    professional: "violet",
    sales: "amber",
    relationship: "green",
  };
  return map[mode] ?? "violet";
}
