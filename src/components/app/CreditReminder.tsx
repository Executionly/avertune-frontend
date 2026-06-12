"use client";

import { useEffect, useRef, useState } from "react";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useNotification } from "@/lib/contexts/NotificationContext";

type CreditState = "safe" | "warning" | "critical";

function getCreditState(remaining: number, total: number): CreditState {
  const percent = total > 0 ? (remaining / total) * 100 : 0;

  if (remaining <= 0) return "critical";

  if (remaining <= 10 || percent <= 10) return "critical";

  if (remaining <= 50 || percent <= 25) return "warning";

  return "safe";
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
      const snoozeMs =
        state === "critical"
          ? 60 * 1000 // test mode
          : 4 * 60 * 1000;

      const until = Date.now() + snoozeMs;
      localStorage.setItem("credit_reminder_dismissed", String(until));
      setDismissedUntil(until);
    };

    if (state === "warning") {
      activeIdRef.current = notify({
        severity: "warning",
        title: "You're running low on credits",
        message: "You’re approaching your usage limit. Top up soon.",
        actionLabel: "Buy Credits →",
        actionHref: "/pricing#addons",
        duration: 0,
        onDismiss: handleDismiss,
      });
      return;
    }

    if (state === "critical") {
      activeIdRef.current = notify({
        severity: "error",
        title: "Credits almost depleted",
        message: "Top up now to avoid service interruption.",
        actionLabel: "Upgrade Now →",
        actionHref: "/pricing#addons",
        duration: 0,
        onDismiss: handleDismiss,
      });
      return;
    }
  }, [credits, user, dismissedUntil, isDismissed, notify, dismissSilent]);

  return null;
}
