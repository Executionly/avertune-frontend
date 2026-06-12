// FILE: src/components/app/CreditReminder.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useNotification } from "@/lib/contexts/NotificationContext";

/**
 * Headless component — fires credit/expiry notifications into the central
 * NotificationContext. Renders nothing itself.
 * Mount it once inside the /app shell.
 */
export function CreditReminder() {
  const { credits } = useCredits();
  const { user } = useAuth();
  const { notify, dismissSilent } = useNotification();
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null);
  const activeIdRef = useRef<string | null>(null);

  // Load dismissed state from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem("credit_reminder_dismissed");
    if (stored) setDismissedUntil(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (!credits) return;

    // Silently remove any previous credit notification (no onDismiss side-effect)
    if (activeIdRef.current) {
      dismissSilent(activeIdRef.current);
      activeIdRef.current = null;
    }

    // Check if the user explicitly dismissed within the last 24 hours
    if (dismissedUntil && Date.now() < dismissedUntil) return;

    const remainingCredits = credits.credits_remaining ?? 0;
    const totalCredits = credits.credits_limit ?? 0;
    const remainingPercent =
      totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 100;

    // Plenty of credits — nothing to show
    if (remainingCredits > 50 && remainingPercent > 30) return;

    const isTrial = user?.plan_tier === "trial";
    const trialDaysLeft = user?.trial_days_left ?? 0;

    // onDismiss is only called when the user clicks the X button,
    // NOT when we call dismissSilent() programmatically above.
    const handleUserDismiss = () => {
      const until = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("credit_reminder_dismissed", String(until));
      setDismissedUntil(until);
    };

    // Priority 1: Critical credits
    if (remainingCredits <= 5 || remainingPercent <= 5) {
      activeIdRef.current = notify({
        severity: "error",
        title: "Critical: credits almost gone",
        message: `Only ${remainingCredits} credit${remainingCredits !== 1 ? "s" : ""} remaining. Top up now to keep using Avertune.`,
        actionLabel: "Buy Credits →",
        actionHref: "/pricing#addons",
        duration: 0,
        onDismiss: handleUserDismiss,
      });
      return;
    }

    // Priority 2: Trial expiring soon
    if (isTrial && trialDaysLeft > 0 && trialDaysLeft <= 3) {
      activeIdRef.current = notify({
        severity: "warning",
        title: "Trial ending soon",
        message: `Your free trial ends in ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""}. Upgrade to continue using Avertune.`,
        actionLabel: "View Plans →",
        actionHref: "/pricing",
        duration: 0,
        onDismiss: handleUserDismiss,
      });
      return;
    }

    // Priority 3: Low credits
    if (remainingCredits <= 20 || remainingPercent <= 20) {
      activeIdRef.current = notify({
        severity: "warning",
        title: "Low credits",
        message: `${remainingCredits} credit${remainingCredits !== 1 ? "s" : ""} remaining. Consider topping up soon.`,
        actionLabel: "Get More →",
        actionHref: "/pricing#addons",
        duration: 0,
        onDismiss: handleUserDismiss,
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credits, user, dismissedUntil]);

  return null;
}
