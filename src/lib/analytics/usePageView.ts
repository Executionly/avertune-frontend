// src/lib/analytics/usePageView.ts
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { identifySession, trackPageView } from "./track";

/** Identifies the session once, then fires a pageview on every route change. */
export function usePageView() {
  const pathname = usePathname();
  const didIdentify = useRef(false);

  useEffect(() => {
    if (!didIdentify.current) {
      didIdentify.current = true;
      void identifySession();
    }
    trackPageView(pathname);
  }, [pathname]);
}
