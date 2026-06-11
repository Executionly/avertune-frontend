"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/ui/HeroSection";
import { fetchSamplesByMode } from "@/lib/utils/samplesCache";
import { getStoredWordLimit } from "@/lib/utils/CharLimits";
import type { Mode } from "@/lib/types";

interface ModeDetailHeroProps {
  mode: Mode;
}

export function ModeDetailHero({ mode }: ModeDetailHeroProps) {
  const [samplesByMode, setSamplesByMode] = useState<Record<string, string[]>>(
    {},
  );
  const [charLimit, setCharLimit] = useState<number>(800);

  useEffect(() => {
    // Fetch all samples grouped by mode (no token required)
    fetchSamplesByMode()
      .then(setSamplesByMode)
      .catch(() => {});

    // Fetch char limit from subscription/plans
    setCharLimit(getStoredWordLimit());
  }, []);

  const handleAnalyse = (message: string, modeId: string) => {
    sessionStorage.setItem("pendingAnalysis", message);
    sessionStorage.setItem("pendingMode", modeId);
    window.location.href = "/app";
  };

  return (
    <HeroSection
      title={mode.label}
      description={mode.description}
      placeholder={`Paste any ${mode.label.toLowerCase()} message you need to respond to...`}
      onAnalyse={handleAnalyse}
      showBackLink={false}
      backLinkHref="/#modes"
      backLinkLabel="Back to Modes"
      showModeChips={false}
      defaultMode={mode.id}
      examplesByMode={samplesByMode}
      charLimit={charLimit}
    />
  );
}
