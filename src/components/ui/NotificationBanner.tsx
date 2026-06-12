// FILE: src/components/ui/NotificationBanner.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useNotification,
  type Notification,
  type NotificationSeverity,
} from "@/lib/contexts/NotificationContext";

// ── Per-severity visual tokens ────────────────────────────────────────────────
const SEVERITY_STYLES: Record<
  NotificationSeverity,
  {
    wrapper: string;
    icon: string;
    title: string;
    action: string;
  }
> = {
  error: {
    wrapper:
      "border-red-500/30 bg-[var(--card-bg)] shadow-[0_4px_24px_rgba(239,68,68,0.10)]",
    icon: "bg-red-500/10 border-red-500/20 text-red-400",
    title: "text-red-400",
    action:
      "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
  },
  warning: {
    wrapper:
      "border-amber-500/30 bg-[var(--card-bg)] shadow-[0_4px_24px_rgba(245,158,11,0.10)]",
    icon: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    title: "text-amber-400",
    action:
      "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20",
  },
  info: {
    wrapper:
      "border-blue-500/30 bg-[var(--card-bg)] shadow-[0_4px_24px_rgba(59,130,246,0.10)]",
    icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    title: "text-blue-400",
    action:
      "bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20",
  },
  credit: {
    wrapper:
      "border-violet-500/30 bg-[var(--card-bg)] shadow-[0_4px_24px_rgba(124,58,237,0.10)]",
    icon: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    title: "text-violet-400",
    action:
      "bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20",
  },
};

// ── SVG icons per severity ────────────────────────────────────────────────────
function NotifIcon({ severity }: { severity: NotificationSeverity }) {
  if (severity === "error")
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-4 h-4"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 5v3.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
      </svg>
    );
  if (severity === "warning")
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-4 h-4"
      >
        <path d="M8 1.5L14.5 13H1.5L8 1.5z" strokeLinejoin="round" />
        <path d="M8 6v3.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r=".6" fill="currentColor" stroke="none" />
      </svg>
    );
  if (severity === "credit")
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-4 h-4"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 5v3.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
      </svg>
    );
  // info
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-4 h-4"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7v4" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r=".6" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Single notification card ──────────────────────────────────────────────────
function NotificationCard({
  notif,
  onDismiss,
}: {
  notif: Notification;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const styles = SEVERITY_STYLES[notif.severity];

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 280);
  };

  return (
    <div
      className={cn(
        "w-full transition-all duration-280 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 px-3 py-3 sm:px-4 sm:py-3.5",
          "rounded-xl sm:rounded-2xl border",
          styles.wrapper,
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border",
            styles.icon,
          )}
        >
          <NotifIcon severity={notif.severity} />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-[12.5px] sm:text-[13px] font-semibold mb-0.5 leading-snug",
              styles.title,
            )}
          >
            {notif.title}
          </p>
          <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] leading-[1.55]">
            {notif.message}
          </p>
          {notif.actionLabel && notif.actionHref && (
            <Link
              href={notif.actionHref}
              className={cn(
                "inline-block mt-2 px-3 py-1 rounded-lg text-[11.5px] sm:text-[12px] font-medium transition-all",
                styles.action,
              )}
            >
              {notif.actionLabel}
            </Link>
          )}
        </div>

        {/* Dismiss */}
        {!notif.persistent && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss notification"
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
        )}
      </div>
    </div>
  );
}

// ── Main export: renders all active notifications in one fixed position ───────
/**
 * Place this component ONCE in the app layout (inside the /app shell).
 * It renders at the bottom-centre of the screen above the chat input.
 *
 * Pass `offsetBottom` (px) to shift it above the ChatInput bar.
 * Default: 84px which matches the current ChatInput height.
 */
export function NotificationBanner({
  offsetBottom = 84,
  maxWidth = 720,
}: {
  offsetBottom?: number;
  maxWidth?: number;
}) {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      className="absolute inset-x-0 z-50 px-3 sm:px-4 flex flex-col gap-2 items-center pointer-events-none"
      style={{ bottom: offsetBottom }}
    >
      <div
        className="w-full pointer-events-auto flex flex-col gap-2"
        style={{ maxWidth }}
      >
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            notif={n}
            onDismiss={() => dismiss(n.id)}
          />
        ))}
      </div>
    </div>
  );
}
