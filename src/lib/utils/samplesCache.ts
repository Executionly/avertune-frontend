/**
 * Module-level cache for sample messages grouped by mode.
 * Fetched once per session and shared across all components.
 */
import { getSampleMessages } from "@/lib/api/intelligence";

let _cache: Record<string, string[]> | null = null;
let _promise: Promise<Record<string, string[]>> | null = null;

export function getSamplesCache(): Record<string, string[]> | null {
  return _cache;
}

export function fetchSamplesByMode(): Promise<Record<string, string[]>> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (!token) return Promise.resolve({});

  _promise = getSampleMessages(token)
    .then((res) => {
      const all: any[] = res?.samples ?? res?.messages ?? [];
      const grouped: Record<string, string[]> = {};
      for (const item of all) {
        const mode: string = item.mode ?? "professional";
        const msg: string = item.message ?? item.text ?? String(item);
        if (!grouped[mode]) grouped[mode] = [];
        if (grouped[mode].length < 3) grouped[mode].push(msg);
      }
      _cache = grouped;
      return grouped;
    })
    .catch(() => {
      _promise = null; // allow retry
      return {};
    });

  return _promise;
}

/** Invalidate the cache (e.g. after login/logout) */
export function invalidateSamplesCache() {
  _cache = null;
  _promise = null;
}
