// FILE: src/components/ui/HeroInput.tsx (NEW)
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const CHIPS = [
  { id: "professional", label: "Professional", dot: "bg-violet-400" },
  { id: "sales", label: "Sales", dot: "bg-amber-400" },
  { id: "relationship", label: "Relationship", dot: "bg-green-500" },
];

interface HeroInputProps {
  placeholder?: string;
  onAnalyse: (message: string, mode: string) => void;
  defaultMode?: string;
  showModeChips?: boolean;
  pasteValue?: string;
  onPasteConsumed?: () => void;
  charLimit?: number;
  onModeChange?: (mode: string) => void;
}

export function HeroInput({
  placeholder = "Paste any message you need to respond to...",
  onAnalyse,
  defaultMode = "professional",
  showModeChips = true,
  pasteValue,
  onPasteConsumed,
  charLimit = 500,
  onModeChange,
}: HeroInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [activeChip, setActiveChip] = useState(defaultMode);

  const handleChipClick = (id: string) => {
    setActiveChip(id);
    onModeChange?.(id);
  };

  // Paste a sample into the textarea without submitting
  useEffect(() => {
    if (pasteValue) {
      setInputValue(pasteValue);
      onPasteConsumed?.();
    }
  }, [pasteValue, onPasteConsumed]);

  const isOverLimit = inputValue.length > charLimit;
  const isNearLimit = inputValue.length >= charLimit * 0.85;

  const counterColor = isOverLimit
    ? "text-red-500"
    : isNearLimit
      ? "text-amber-500"
      : "text-navy-400";

  const handleSubmit = () => {
    if (!inputValue.trim() || isOverLimit) return;
    onAnalyse(inputValue, activeChip);
  };

  return (
    <div className="w-full max-w-[820px] mx-auto">
      <div
        className={cn(
          "bg-white rounded-[28px] border-[1.5px] p-5 pb-4 shadow-md transition-all",
          isOverLimit ? "border-red-400" : "border-navy-200",
        )}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border-none outline-none resize-none text-[15px] text-navy-800 bg-transparent h-[400px]"
        />

        {isOverLimit && (
          <p className="text-[12px] text-red-500 mb-2 flex items-center gap-1">
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
            Character limit reached. Please shorten your message or upgrade your
            plan.
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-900/[0.08]">
          {showModeChips && (
            <div className="flex items-center gap-2 flex-wrap">
              {CHIPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleChipClick(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium border-[1.5px]",
                    activeChip === c.id
                      ? "border-violet-500 text-violet-500 bg-violet-50"
                      : "border-navy-200 text-navy-500 hover:border-violet-300",
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {!showModeChips && <div />}

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Character counter */}
            <span
              className={cn(
                "text-[12px] tabular-nums transition-colors",
                counterColor,
              )}
            >
              {inputValue.length}/{charLimit}
            </span>
            <button
              onClick={handleSubmit}
              disabled={isOverLimit}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-navy-700 text-white hover:scale-[1.06] transition-all shadow-violet disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg
                viewBox="0 0 18 18"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                className="w-4 h-4 mx-auto"
              >
                <line x1="9" y1="14" x2="9" y2="4" />
                <polyline points="5,8 9,4 13,8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
