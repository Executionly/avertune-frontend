"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getSampleMessages } from "@/lib/api/intelligence";
import type { ModeId } from "@/lib/types";

interface ModeSampleDropdownProps {
  onSelect: (message: string) => void;
}

const CATEGORIES: { id: ModeId; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "sales", label: "Sales" },
  { id: "relationship", label: "Relationship" },
];

export function ModeSampleDropdown({ onSelect }: ModeSampleDropdownProps) {
  const [openTab, setOpenTab] = useState<ModeId | null>(null);
  const [samples, setSamples] = useState<Record<ModeId, string[]>>({
    professional: [],
    sales: [],
    relationship: [],
  });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) return;

    setLoading(true);
    getSampleMessages(token)
      .then((res) => {
        const all: any[] = res?.samples ?? res?.messages ?? [];
        const grouped: Record<string, string[]> = {
          professional: [],
          sales: [],
          relationship: [],
        };
        for (const item of all) {
          const m: string = item.mode ?? "professional";
          const msg: string = item.message ?? item.text ?? String(item);
          if (grouped[m]) grouped[m].push(msg);
        }
        setSamples(grouped as any);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!openTab) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenTab(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openTab]);

  const handleToggle = (id: ModeId) => {
    setOpenTab((prev) => (prev === id ? null : id));
  };

  const handleSelect = (msg: string) => {
    onSelect(msg);
    setOpenTab(null);
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Category tabs — same labels on all screen sizes */}
      <div className="flex gap-2 justify-center flex-wrap">
        {CATEGORIES.map((cat) => {
          const isOpen = openTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleToggle(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[13px] border transition-all whitespace-nowrap",
                isOpen
                  ? "border-violet-500/50 text-violet-400 bg-violet-500/10"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-violet-400/60 hover:text-[var(--text-primary)]",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Inline panel — shown below the buttons, part of normal flow */}
      {openTab && (
        <div
          className={cn(
            "mt-2 w-full max-w-[480px] mx-auto",
            "bg-[var(--card-bg)]",
            "border border-[var(--card-border)]",
            "rounded-2xl",
            "shadow-lg",
            "overflow-hidden",
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
          ) : (samples[openTab] ?? []).length === 0 ? (
            <p className="text-[12px] text-[var(--text-muted)] text-center py-6 px-4">
              No samples available.
            </p>
          ) : (
            <div className="max-h-[240px] overflow-y-auto overscroll-contain">
              {(samples[openTab] ?? []).map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(msg)}
                  className="w-full text-left px-4 py-3 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--card-muted-bg)] hover:text-[var(--text-primary)] transition-colors leading-[1.55] border-b border-[var(--border-default)] last:border-b-0"
                >
                  <span className="line-clamp-3">{msg}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
