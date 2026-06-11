// FILE: src/components/ui/HeroSection.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { HeroInput } from "./HeroInput";
import { RevealWrapper } from "./RevealWrapper";
import { cn } from "@/lib/utils";

// Fallback sample pills shown when no API samples are loaded yet
const FALLBACK_SAMPLES: Record<string, string[]> = {
  professional: [
    "My manager hasn't replied to my promotion request in 2 weeks",
    "A colleague keeps taking credit for my work in team meetings",
    "I need to decline a project without burning bridges",
  ],
  sales: [
    "The prospect said they need to think about it and will get back to me",
    "We lost to a cheaper competitor — how do I respond?",
    "Client ghosted me after sending the proposal",
  ],
  relationship: [
    "My partner is upset but won't tell me what's wrong",
    "A close friend hasn't been responding to my messages",
    "I need to have a difficult conversation with a family member",
  ],
};

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

  // Pick samples: prefer API data, fall back to hardcoded
  const apiSamples = examplesByMode
    ? (examplesByMode[currentMode] ?? [])
    : exampleMessages;
  const visibleExamples = (
    apiSamples.length > 0 ? apiSamples : (FALLBACK_SAMPLES[currentMode] ?? [])
  ).slice(0, 3);

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
          "min-h-[calc(100vh-112px)] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 text-center bg-cream-100",
          className,
        )}
      >
        <div className="max-w-[1120px] w-full mx-auto">
          {showBackLink && (
            <div className="flex justify-start mb-6">
              <Link
                href={backLinkHref}
                className="inline-flex items-center gap-1.5 text-[13px] text-navy-500 hover:text-navy-800 transition-colors"
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                >
                  <path d="M8 2L4 6l4 4" />
                </svg>
                {backLinkLabel}
              </Link>
            </div>
          )}

          {badge && (
            <span className="inline-block px-3 py-1 rounded-full text-[12px] font-medium bg-violet-50 border border-violet-200 text-violet-600 mb-4 reveal reveal-d0">
              {badge}
            </span>
          )}

          <h1 className="font-display font-medium text-[clamp(28px,4.5vw,56px)] leading-[1.2] text-navy-900 mb-4 sm:mb-5 reveal reveal-d1 max-w-[900px] mx-auto">
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

          <p className="text-navy-500 max-w-[580px] leading-[1.7] mb-8 sm:mb-10 mx-auto reveal reveal-d2 text-[15px] sm:text-base">
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

          {/* Sample message pills — same width as input */}
          {visibleExamples.length > 0 && (
            <div className="mt-5 sm:mt-6 reveal flex justify-center">
              <div className="w-full max-w-[820px]">
                <p className="text-[12px] text-navy-400 text-center mb-3 reveal reveal-d1">
                  Try a quick example — click any message to get started
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {visibleExamples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSampleClick(ex)}
                      className={cn(
                        "px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-navy-200 rounded-full",
                        "text-[12px] sm:text-[13px] text-navy-500 text-left",
                        "hover:border-violet-400 hover:text-violet-500 hover:bg-violet-50 transition-all",
                        "max-w-[calc(100vw-32px)] sm:max-w-[360px]",
                        idx === 0 && "reveal-d1",
                        idx === 1 && "reveal-d2",
                        idx === 2 && "reveal-d3",
                      )}
                    >
                      <span className="line-clamp-2 sm:line-clamp-1">
                        {ex.length > 72 ? ex.slice(0, 72) + "…" : ex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </RevealWrapper>
  );
}
