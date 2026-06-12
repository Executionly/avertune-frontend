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
import { useAuth } from "./AuthContext";

interface CreditsContextType {
  credits: CreditsResponse | null;
  history: CreditTransaction[];
  historyLoading: boolean;
  charLimit: number;
  creditPercentage: number;
  isLow: boolean;
  isCritical: boolean;
  refresh: () => Promise<void>;
  refreshCredits: () => Promise<void>; // Add this
  applyUsage: (used: number, remaining: number) => void;
  fetchHistory: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { wordLimit, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getCredits(token);
      //console.log("Credits data from API:", data); // Debug log
      setCredits(data);
    } catch (err) {
      console.error("Failed to fetch credits:", err);
    }
  }, []);

  // Alias for refresh to match the naming in page.tsx
  const refreshCredits = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getCredits(token);
      setCredits(data);
    } catch {}
  }, []);

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

  useEffect(() => {
    if (isAuthenticated) refresh();
    else setCredits(null);
  }, [isAuthenticated, refresh]);

  const creditPercentage = credits?.credits_limit
    ? (credits.credits_used / credits.credits_limit) * 100
    : 0;
  const isLow = credits?.credits_remaining
    ? credits.credits_remaining <= 20
    : false;
  const isCritical = credits?.credits_remaining
    ? credits.credits_remaining <= 5
    : false;

  return (
    <CreditsContext.Provider
      value={{
        credits,
        history,
        historyLoading,
        charLimit: wordLimit,
        creditPercentage,
        isLow,
        isCritical,
        refresh,
        refreshCredits, // Add this
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
