// FILE: src/components/ui/HeroSection.tsx (UPDATED)
"use client";

import Link from "next/link";
import { useState } from "react";
import { HeroInput } from "./HeroInput";
import { RevealWrapper } from "./RevealWrapper";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  badge?: string;
  title: string;
  highlight?: string;
  description: string;
  placeholder?: string;
  onAnalyse: (message: string, mode: string) => void;
  showBackLink?: boolean;
  backLinkHref?: string;
  backLinkLabel?: string;
  showModeChips?: boolean;
  defaultMode?: string;
  exampleMessages?: string[];
  examplesByMode?: Record<string, string[]>;
  className?: string;
  charLimit?: number;
}

export function HeroSection({
  badge,
  title,
  highlight,
  description,
  placeholder,
  onAnalyse,
  showBackLink = false,
  backLinkHref = "/",
  backLinkLabel = "Back",
  showModeChips = true,
  defaultMode = "professional",
  exampleMessages = [],
  examplesByMode,
  className,
  charLimit = 500,
}: HeroSectionProps) {
  const [pasteValue, setPasteValue] = useState("");
  const [currentMode, setCurrentMode] = useState(defaultMode);

  // If we have mode-specific examples, pick from those; otherwise use the flat list
  const visibleExamples = examplesByMode
    ? (examplesByMode[currentMode] ?? []).slice(0, 3)
    : exampleMessages;

  const handleAnalyse = (message: string, mode: string) => {
    setCurrentMode(mode);
    onAnalyse(message, mode);
  };

  // Sample click → paste into textarea, don't submit
  const handleSampleClick = (msg: string) => {
    setPasteValue(msg);
  };

  return (
    <RevealWrapper>
      <section
        className={cn(
          "min-h-[calc(100vh-112px)] flex flex-col items-center justify-center px-6 py-20 text-center bg-cream-100",
          className,
        )}
      >
        <div className="max-w-[1120px] mx-auto">
          <h1 className="font-display font-medium text-[clamp(32px,4.5vw,56px)] leading-[1.2] text-navy-900 mb-5 reveal reveal-d1 max-w-[900px] mx-auto">
            {highlight ? (
              <>
                <span className="block">{title.split(highlight)[0]}</span>
                <span className="block">
                  <em className="text-violet-500 not-italic italic">
                    {highlight}
                  </em>
                  {title.split(highlight)[1]}
                </span>
              </>
            ) : (
              <span className="block">{title}</span>
            )}
          </h1>

          <p className="text-navy-500 max-w-[580px] leading-[1.7] mb-10 mx-auto reveal reveal-d2">
            {description}
          </p>

          <div className="reveal reveal-d3">
            <HeroInput
              placeholder={placeholder}
              onAnalyse={handleAnalyse}
              defaultMode={defaultMode}
              showModeChips={showModeChips}
              pasteValue={pasteValue}
              onPasteConsumed={() => setPasteValue("")}
              charLimit={charLimit}
              onModeChange={setCurrentMode}
            />
          </div>

          {visibleExamples.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center mt-6 reveal">
              {visibleExamples.map((ex, idx) => (
                <button
                  key={ex}
                  onClick={() => handleSampleClick(ex)}
                  className={cn(
                    "px-4 py-2 bg-white border border-navy-200 rounded-full text-[13px] text-navy-500",
                    "hover:border-violet-400 hover:text-violet-500 hover:bg-violet-50 transition-all",
                    idx === 0 && "reveal-d1",
                    idx === 1 && "reveal-d2",
                    idx === 2 && "reveal-d3",
                  )}
                >
                  {ex.length > 60 ? ex.slice(0, 60) + "..." : ex}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </RevealWrapper>
  );
}
