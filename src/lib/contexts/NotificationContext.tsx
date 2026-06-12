// FILE: src/lib/contexts/NotificationContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

export type NotificationSeverity = "error" | "warning" | "info" | "credit";

export interface Notification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  /** ms before auto-dismiss. 0 = sticky. Default 8000 */
  duration?: number;
  persistent?: boolean;
  /** Called ONLY when the user explicitly clicks the dismiss (X) button */
  onDismiss?: () => void;
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (n: Omit<Notification, "id">) => string;
  /** User-initiated dismiss — runs onDismiss callback */
  dismiss: (id: string) => void;
  /** Programmatic/silent dismiss — does NOT run onDismiss callback */
  dismissSilent: (id: string) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimer = (id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  };

  // Removes the notification silently — no onDismiss side-effect.
  // Used internally for auto-expire and programmatic cleanup.
  const dismissSilent = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((x) => x.id !== id));
    clearTimer(id);
  }, []);

  // User-initiated dismiss — fires the onDismiss callback.
  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => {
      const n = prev.find((x) => x.id === id);
      if (n?.onDismiss) n.onDismiss();
      return prev.filter((x) => x.id !== id);
    });
    clearTimer(id);
  }, []);

  const notify = useCallback(
    (n: Omit<Notification, "id">): string => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const full: Notification = { duration: 8000, ...n, id };
      setNotifications((prev) => {
        // Deduplicate by title+message
        const filtered = prev.filter(
          (x) => !(x.title === full.title && x.message === full.message),
        );
        return [...filtered, full];
      });
      if (full.duration && full.duration > 0) {
        // Auto-expire is silent — user didn't click dismiss
        const t = setTimeout(() => dismissSilent(id), full.duration);
        timers.current.set(id, t);
      }
      return id;
    },
    [dismissSilent],
  );

  const dismissAll = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, notify, dismiss, dismissSilent, dismissAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
