"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { useAuth } from "@/lib/contexts/AuthContext";

interface CreditReminderProps {
  onDismiss?: () => void;
}

type ReminderType =
  | "credits_low"
  | "credits_critical"
  | "trial_expiring"
  | "subscription_expiring"
  | null;

export function CreditReminder({ onDismiss }: CreditReminderProps) {
  const { credits } = useCredits();
  const { user } = useAuth();
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null);
  const [reminder, setReminder] = useState<{
    type: ReminderType;
    message: string;
    action: string;
    actionLink: string;
    severity: "warning" | "critical" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dismissed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("credit_reminder_dismissed");
    if (stored) {
      setDismissedUntil(parseInt(stored, 10));
    }
  }, []);

  // Handle dismiss - defined before it's used
  const handleDismiss = () => {
    // Dismiss for 24 hours
    const dismissUntil = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("credit_reminder_dismissed", String(dismissUntil));
    setDismissedUntil(dismissUntil);
    setReminder(null);
    onDismiss?.();
  };

  // Check for reminders - only run when credits data is loaded
  useEffect(() => {
    // Wait for credits to be loaded (not null)
    if (!credits) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    // Check if reminder was dismissed recently (within 24 hours)
    if (dismissedUntil && Date.now() < dismissedUntil) {
      setReminder(null);
      return;
    }

    const remainingCredits = credits.credits_remaining ?? 0;
    const totalCredits = credits.credits_limit ?? 0;

    // Calculate percentage REMAINING
    const remainingPercent =
      totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 100;

    // If you have plenty of credits, don't show reminder
    if (remainingCredits > 50 && remainingPercent > 30) {
      setReminder(null);
      return;
    }

    const isTrial = user?.plan_tier === "trial";
    const trialDaysLeft = user?.trial_days_left ?? 0;

    // Priority 1: Critical credits (less than 5% remaining OR less than 5 credits)
    if (remainingCredits <= 5 || remainingPercent <= 5) {
      setReminder({
        type: "credits_critical",
        message: `⚠️ Critical: Only ${remainingCredits} credit${remainingCredits !== 1 ? "s" : ""} remaining!`,
        action: "Buy Credits →",
        actionLink: "/pricing#addons",
        severity: "critical",
      });
      return;
    }

    // Priority 2: Trial expiring soon (3 days or less)
    if (isTrial && trialDaysLeft > 0 && trialDaysLeft <= 3) {
      setReminder({
        type: "trial_expiring",
        message: `Your free trial ends in ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""}. Upgrade to continue using Avertune.`,
        action: "View Plans →",
        actionLink: "/pricing",
        severity: "warning",
      });
      return;
    }

    // Priority 3: Low credits (less than 20% remaining OR less than 20 credits)
    if (remainingCredits <= 20 || remainingPercent <= 20) {
      setReminder({
        type: "credits_low",
        message: `Low credits: ${remainingCredits} credit${remainingCredits !== 1 ? "s" : ""} remaining.`,
        action: "Get More →",
        actionLink: "/pricing#addons",
        severity: "warning",
      });
      return;
    }

    // No reminder needed
    setReminder(null);
  }, [credits, user, dismissedUntil]);

  // Don't show anything while loading
  if (isLoading || !credits) return null;
  if (!reminder) return null;

  const severityStyles = {
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    critical: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  };

  return (
    <div
      className={cn(
        "mx-4 mb-4 rounded-xl border p-3 flex items-center justify-between gap-3",
        severityStyles[reminder.severity],
      )}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {reminder.severity === "critical" && (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 flex-shrink-0 text-red-400"
          >
            <circle cx="10" cy="10" r="8.5" />
            <path d="M10 6v5M10 13v.5" strokeLinecap="round" />
          </svg>
        )}
        {reminder.severity === "warning" && (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 flex-shrink-0 text-amber-400"
          >
            <path d="M10 2L2 18h16L10 2z" strokeLinejoin="round" />
            <path d="M10 7v5M10 14v.5" strokeLinecap="round" />
          </svg>
        )}
        {reminder.severity === "info" && (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5 flex-shrink-0 text-blue-400"
          >
            <circle cx="10" cy="10" r="8.5" />
            <path d="M10 8v4M10 14v.5" strokeLinecap="round" />
          </svg>
        )}
        <span className="text-[13px] leading-relaxed">{reminder.message}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={reminder.actionLink}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all",
            reminder.severity === "critical"
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : reminder.severity === "warning"
                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
          )}
        >
          {reminder.action}
        </Link>
        <button
          onClick={handleDismiss}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-3 h-3"
          >
            <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
