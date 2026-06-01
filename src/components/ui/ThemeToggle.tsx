// src/components/ui/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse", className)} />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-8 h-8 rounded-md border flex items-center justify-center transition-all cursor-pointer",
        isDark
          ? "bg-[#1e1e2a] border-white/10 text-yellow-400 hover:bg-white/5"
          : "bg-white border-navy-200 text-navy-500 hover:border-violet-300 hover:text-violet-500",
        className,
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        /* Sun icon */
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        /* Moon icon */
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path d="M15 10.5a6 6 0 1 1-6-6 4.5 4.5 0 0 0 6 6z" />
        </svg>
      )}
    </button>
  );
}
