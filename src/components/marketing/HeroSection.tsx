"use client";

import { useState, useEffect } from "react";
import { HeroSection as BaseHeroSection } from "@/components/ui/HeroSection";
import { fetchSamplesByMode } from "@/lib/utils/samplesCache";
import { getStoredWordLimit } from "@/lib/utils/CharLimits";

export function HeroSection() {
  const [samplesByMode, setSamplesByMode] = useState<Record<string, string[]>>(
    {},
  );
  const [charLimit, setCharLimit] = useState<number>(500); // Changed from 800 to 500

  useEffect(() => {
    // Fetch samples — works with or without a token
    fetchSamplesByMode()
      .then(setSamplesByMode)
      .catch(() => {});

    // Get stored word limit (or default 500)
    setCharLimit(getStoredWordLimit());
  }, []);

  const handleAnalyse = (message: string, mode: string) => {
    sessionStorage.setItem("pendingAnalysis", message);
    sessionStorage.setItem("pendingMode", mode);
    window.location.href = "/app";
  };

  return (
    <BaseHeroSection
      badge=""
      title="Don't just write better. Think better before you respond."
      highlight="Think better"
      description="Avertune reads the situation, detects risk and intent, recommends strategy, generates the perfect response, and simulates the likely outcome."
      placeholder="Paste any message you need to respond to — a difficult email, a sales objection, a tense conversation..."
      onAnalyse={handleAnalyse}
      showModeChips={true}
      defaultMode="professional"
      examplesByMode={samplesByMode}
      charLimit={charLimit}
    />
  );
}
