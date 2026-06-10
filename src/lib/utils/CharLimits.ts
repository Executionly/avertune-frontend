// src/lib/utils/CharLimits.ts

export type CharCountStatus = "ok" | "warning" | "error";

export function getCharCountStatus(
  length: number,
  limit: number,
): CharCountStatus {
  if (length >= limit) return "error";
  if (length >= limit * 0.85) return "warning";
  return "ok";
}

// Simple sync function to get stored word limit
export function getStoredWordLimit(): number {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("avertune_word_limit");
    if (stored) return parseInt(stored, 10);
  }
  return 800;
}
