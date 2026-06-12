"use client";

import { useSearchParams } from "next/navigation";

export function useReferral() {
  const searchParams = useSearchParams();
  return searchParams.get("ref");
}
