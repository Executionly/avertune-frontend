"use client";

import { useState, useRef, useEffect } from "react";
import type { ModeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { getCharCountStatus } from "@/lib/utils/CharLimits";

interface ChatInputProps {
  onSend: (content: string) => void;
  activeMode: ModeId;
  onModeChange: (mode: ModeId) => void;
  modeLocked?: boolean;
  pasteValue?: string;
  onPasteConsumed?: () => void;
}

const MODES: { id: ModeId; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "sales", label: "Sales" },
  { id: "relationship", label: "Relationship" },
];

export function ChatInput({
  onSend,
  activeMode,
  onModeChange,
  modeLocked = false,
  pasteValue,
  onPasteConsumed,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { charLimit } = useCredits();

  const charStatus = getCharCountStatus(value.length, charLimit);

  // When a sample message is clicked, paste it into the textarea
  useEffect(() => {
    if (pasteValue) {
      setValue(pasteValue);
      onPasteConsumed?.();
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [pasteValue, onPasteConsumed]);

  const handleSend = () => {
    if (!value.trim() || charStatus === "error") return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const counterColor =
    charStatus === "error"
      ? "text-red-400"
      : charStatus === "warning"
        ? "text-amber-400"
        : "text-[var(--text-muted)]";

  return (
    <div className="flex-shrink-0 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3">
      <div className="max-w-[720px] mx-auto">
        <div
          className={cn(
            "bg-[var(--input-bg)] border rounded-2xl px-4 pt-3.5 pb-3 transition-all",
            charStatus === "error"
              ? "border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-[var(--input-border)] focus-within:border-violet-500/60 focus-within:shadow-[0_0_0_3px_rgba(124,79,232,0.1)]",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Paste a message to analyse…"
            rows={2}
            className="w-full border-none outline-none resize-none bg-transparent text-[14px] text-[var(--input-text)] leading-[1.6]
              max-h-[160px] min-h-[44px] placeholder:text-[var(--input-placeholder)] font-[var(--font-body)]"
          />

          {/* Error message when over limit */}
          {charStatus === "error" && (
            <p className="text-[11.5px] text-red-400 mb-2 flex items-center gap-1">
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-3 h-3 flex-shrink-0"
              >
                <circle cx="6" cy="6" r="5" />
                <path d="M6 4v2.5" strokeLinecap="round" />
                <circle
                  cx="6"
                  cy="8.5"
                  r=".5"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              Character limit reached. Shorten your message or upgrade your
              plan.
            </p>
          )}

          <div className="flex items-center justify-between mt-2 gap-2">
            {/* Only show mode selector for brand-new conversations */}
            {!modeLocked ? (
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[12px] text-[var(--text-muted)] mr-0.5 hidden sm:inline">
                  Mode:
                </span>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onModeChange(m.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all",
                      activeMode === m.id
                        ? "border-violet-500 text-violet-500 bg-violet-500/10"
                        : "border-[var(--input-border)] text-[var(--text-muted)] hover:border-violet-400/50 hover:text-[var(--text-primary)]",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            ) : (
              <div /> /* spacer */
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Character counter */}
              <span
                className={cn(
                  "text-[11px] tabular-nums transition-colors",
                  counterColor,
                )}
              >
                {value.length}/{charLimit}
              </span>
              <button
                onClick={handleSend}
                disabled={!value.trim() || charStatus === "error"}
                className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white flex-shrink-0
                  hover:bg-[var(--accent-hover)] disabled:opacity-35 disabled:cursor-not-allowed transition-all hover:scale-[1.05]"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="w-3.5 h-3.5"
                >
                  <line x1="8" y1="13" x2="8" y2="3" />
                  <polyline points="4,7 8,3 12,7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-2">
          Avertune analyses communication situations. Always apply your own
          judgement.
        </p>
      </div>
    </div>
  );
}
