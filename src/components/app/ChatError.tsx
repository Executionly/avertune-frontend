"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const RETRYABLE = new Set([
  "CREDIT_DEDUCTION_FAILED",
  "GENERATION_FAILED",
  "PROCESSING_ERROR",
]);

const UPGRADE_CODES = new Set(["CAPABILITY_LOCKED", "TRIAL_EXPIRED"]);

interface ChatErrorProps {
  message: string;
  errorCode?: string | null;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ChatError({
  message,
  errorCode,
  onDismiss,
  onRetry,
}: ChatErrorProps) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const isUpgrade = errorCode ? UPGRADE_CODES.has(errorCode) : false;
  const isTrialExpired = errorCode === "TRIAL_EXPIRED";
  const isRetryable = errorCode ? RETRYABLE.has(errorCode) : false;
  const isWordLimit = errorCode === "WORD_LIMIT_EXCEEDED";

  const title = isTrialExpired
    ? "Trial ended"
    : isUpgrade
      ? "Plan upgrade required"
      : isWordLimit
        ? "Message too long"
        : "Something went wrong";

  const borderColor = isUpgrade ? "border-violet-500/30" : "border-red-500/30";
  const shadowColor = isUpgrade
    ? "shadow-[0_4px_20px_rgba(124,79,232,0.12)]"
    : "shadow-[0_4px_20px_rgba(239,68,68,0.12)]";
  const iconColor = isUpgrade ? "text-violet-400" : "text-red-400";
  const iconBg = isUpgrade
    ? "bg-violet-500/10 border-violet-500/20"
    : "bg-red-500/10 border-red-500/20";
  const titleColor = isUpgrade ? "text-violet-400" : "text-red-400";

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 8000);
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleRetry = () => {
    setVisible(false);
    setTimeout(() => {
      onDismiss();
      onRetry?.();
    }, 300);
  };

  return (
    <div
      className={cn(
        "w-full max-w-[720px] mx-auto transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[var(--card-bg)] border",
          borderColor,
          shadowColor,
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border",
            iconBg,
          )}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={cn("w-4 h-4", iconColor)}
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-[13px] font-semibold mb-0.5", titleColor)}>
            {title}
          </p>
          <p className="text-[12.5px] text-[var(--text-secondary)] leading-[1.55]">
            {message}
          </p>
          {isRetryable && onRetry && (
            <button
              onClick={handleRetry}
              className="mt-2 px-3 py-1 rounded-lg text-[12px] font-medium bg-[var(--card-muted-bg)] border border-[var(--border-default)] text-[var(--text-primary)] hover:border-violet-400/50 transition-all"
            >
              Try again
            </button>
          )}
          {isUpgrade && (
            <button
              onClick={() => router.push("/pricing")}
              className="mt-2 px-3 py-1 rounded-lg text-[12px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-all"
            >
              Upgrade
            </button>
          )}
        </div>

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
