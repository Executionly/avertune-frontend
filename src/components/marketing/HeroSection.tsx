"use client";

import { useState, useEffect } from "react";
import { HeroSection as BaseHeroSection } from "@/components/ui/HeroSection";
import { fetchSamplesByMode } from "@/lib/utils/samplesCache";
import { getStoredWordLimit } from "@/lib/utils/CharLimits";

export function HeroSection() {
  const [samplesByMode, setSamplesByMode] = useState<Record<string, string[]>>(
    {},
  );
  const [charLimit, setCharLimit] = useState<number>(500);

  useEffect(() => {
    fetchSamplesByMode()
      .then(setSamplesByMode)
      .catch(() => {});

    setCharLimit(getStoredWordLimit());
  }, []);

  const handleAnalyse = (
    message: string,
    mode: string,
    filePayload?: { base64: string; name: string; type: string },
  ) => {
    localStorage.setItem("pendingAnalysis", message);
    localStorage.setItem("pendingMode", mode);
    if (filePayload) {
      localStorage.setItem(
        "pendingFile",
        JSON.stringify({ ...filePayload, text: message }),
      );
    }
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
