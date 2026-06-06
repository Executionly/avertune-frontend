"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getSampleMessages } from "@/lib/api/intelligence";
import type { ModeId } from "@/lib/types";

interface ModeSampleDropdownProps {
  onSelect: (message: string) => void;
}

const CATEGORIES: { id: ModeId; label: string }[] = [
  { id: "professional", label: "Professional messages" },
  { id: "sales",        label: "Sales & negotiation"  },
  { id: "relationship", label: "Relationship advice"  },
];

export function ModeSampleDropdown({ onSelect }: ModeSampleDropdownProps) {
  const [openTab, setOpenTab] = useState<ModeId | null>(null);
  const [dropUp, setDropUp] = useState(true);
  const [samples, setSamples] = useState<Record<ModeId, string[]>>({
    professional: [],
    sales: [],
    relationship: [],
  });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<ModeId, HTMLButtonElement>>>({});
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
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

  useEffect(() => {
    if (!openTab) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenTab(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openTab]);

  const handleToggle = (id: ModeId) => {
    if (openTab === id) {
      setOpenTab(null);
      return;
    }
    // Detect whether to open up or down based on available space
    const btn = buttonRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 280 || spaceAbove > spaceBelow);
    }
    setOpenTab(id);
  };

  const handleSelect = (msg: string) => {
    onSelect(msg);
    setOpenTab(null);
  };

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((cat) => {
        const isOpen = openTab === cat.id;
        const catSamples = samples[cat.id] ?? [];

        return (
          <div key={cat.id} className="relative">
            <button
              ref={(el) => { if (el) buttonRefs.current[cat.id] = el; }}
              onClick={() => handleToggle(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[13px] border transition-all",
                isOpen
                  ? "border-violet-500/50 text-violet-400 bg-violet-500/10"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-violet-400/60 hover:text-[var(--text-primary)]",
              )}
            >
              {cat.label}
            </button>

            {isOpen && (
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-[340px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl overflow-hidden z-50",
                  dropUp ? "bottom-full mb-2" : "top-full mt-2",
                )}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                  </div>
                ) : catSamples.length === 0 ? (
                  <p className="text-[12px] text-[var(--text-muted)] text-center py-6 px-4">
                    No samples available.
                  </p>
                ) : (
                  <div className="max-h-[260px] overflow-y-auto">
                    {catSamples.map((msg, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(msg)}
                        className="w-full text-left px-4 py-3 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--card-muted-bg)] hover:text-[var(--text-primary)] transition-colors leading-[1.55] border-b border-[var(--border-default)] last:border-b-0"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
