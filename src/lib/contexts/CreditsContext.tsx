"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  getCredits,
  getCreditsHistory,
  type CreditsResponse,
  type CreditTransaction,
} from "@/lib/api/intelligence";
import { fetchCharLimit } from "@/lib/utils/CharLimits";

interface CreditsContextType {
  credits: CreditsResponse | null;
  history: CreditTransaction[];
  historyLoading: boolean;
  charLimit: number;
  refresh: () => Promise<void>;
  applyUsage: (used: number, remaining: number) => void;
  fetchHistory: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [charLimit, setCharLimit] = useState<number>(500);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getCredits(token);
      setCredits(data);
    } catch {}
  }, []);

  // Live update from SSE credits event — no extra API call needed
  const applyUsage = useCallback((used: number, remaining: number) => {
    setCredits((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        credits_used: used,
        credits_remaining: remaining,
      };
    });
  }, []);

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setHistoryLoading(true);
    try {
      const data = await getCreditsHistory(token);
      setHistory(data.transactions ?? []);
    } catch {
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Fetch credits and char limit on mount once token is available
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) refresh();
    fetchCharLimit()
      .then(setCharLimit)
      .catch(() => {});
  }, [refresh]);

  return (
    <CreditsContext.Provider
      value={{
        credits,
        history,
        historyLoading,
        charLimit,
        refresh,
        applyUsage,
        fetchHistory,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}
