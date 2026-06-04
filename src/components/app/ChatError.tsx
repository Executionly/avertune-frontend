"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ChatErrorProps {
  message: string;
  onDismiss: () => void;
}

export function ChatError({ message, onDismiss }: ChatErrorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t = requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 6s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 6000);
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={cn(
        "w-full max-w-[720px] mx-auto transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border border-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.12)]">
        {/* Icon */}
        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4 text-red-400"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-red-400 mb-0.5">
            Something went wrong
          </p>
          <p className="text-[12.5px] text-[var(--text-secondary)] leading-[1.55]">
            {message}
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-3 h-3"
          >
            <path d="M2 2l8 8M10 2L2 10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
