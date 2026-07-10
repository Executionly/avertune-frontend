"use client";

import { useEffect, useRef, useState } from "react";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useNotification } from "@/lib/contexts/NotificationContext";

type CreditState = "safe" | "low";

function getCreditState(remaining: number, total: number): CreditState {
  if (total <= 0) return "safe";
  const percent = (remaining / total) * 100;
  return percent <= 20 ? "low" : "safe";
}

export function CreditReminder() {
  const { credits } = useCredits();
  const { user } = useAuth();
  const { notify, dismissSilent } = useNotification();

  const activeIdRef = useRef<string | null>(null);
  const prevStateRef = useRef<CreditState | null>(null);

  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null);

  const isDismissed = dismissedUntil !== null && Date.now() < dismissedUntil;

  useEffect(() => {
    const stored = localStorage.getItem("credit_reminder_dismissed");
    if (stored) setDismissedUntil(Number(stored));
  }, []);

  useEffect(() => {
    if (!credits || !user) return;
    if (isDismissed) return;

    const remaining = credits.credits_remaining ?? 0;
    const total = credits.credits_limit ?? 0;

    const state = getCreditState(remaining, total);

    // 🚫 only trigger when user crosses threshold
    if (prevStateRef.current === state) return;
    prevStateRef.current = state;

    if (activeIdRef.current) {
      dismissSilent(activeIdRef.current);
      activeIdRef.current = null;
    }

    const handleDismiss = () => {
      const snoozeMs = 4 * 60 * 1000;
      const until = Date.now() + snoozeMs;
      localStorage.setItem("credit_reminder_dismissed", String(until));
      setDismissedUntil(until);
    };

    if (state !== "low") return;

    const planTier = user.plan_tier || "trial";

    // Trial has fully ended — the "Trial ended" banner already tells the
    // user what's going on. Piling a "low credits" nudge on top is redundant
    // and confusing, so skip it entirely in this state.
    if (planTier === "trial" && (user.trial_days_left ?? 0) <= 0) return;

    const isHighestPlan = planTier === "pro" || planTier === "pro_annual";

    // Pro (highest plan) users can't upgrade further — only offer top-up.
    if (isHighestPlan) {
      activeIdRef.current = notify({
        severity: "warning",
        title: "You're running low on credits",
        message: "You're approaching your usage limit. Top up to keep going.",
        actionLabel: "Top Up Credits →",
        actionHref: "/pricing#addons",
        duration: 0,
        onDismiss: handleDismiss,
      });
      return;
    }

    activeIdRef.current = notify({
      severity: "warning",
      title: "You're running low on credits",
      message:
        "You're approaching your usage limit. Top up or upgrade your plan.",
      actionLabel: "Top Up or Upgrade →",
      actionHref: "/pricing#addons",
      duration: 0,
      onDismiss: handleDismiss,
    });
  }, [credits, user, dismissedUntil, isDismissed, notify, dismissSilent]);

  return null;
}
