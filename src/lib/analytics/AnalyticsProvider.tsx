// src/lib/analytics/AnalyticsProvider.tsx
"use client";

import { ReactNode } from "react";
import { usePageView } from "./usePageView";

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  usePageView();
  return <>{children}</>;
}
