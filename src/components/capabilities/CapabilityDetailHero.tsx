"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/ui/HeroSection";
import { fetchSamplesByMode } from "@/lib/utils/samplesCache";
import { getStoredWordLimit } from "@/lib/utils/CharLimits";
import type { Capability } from "@/lib/types";

interface CapabilityDetailHeroProps {
  capability: Capability;
}

export function CapabilityDetailHero({
  capability,
}: CapabilityDetailHeroProps) {
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
    localStorage.setItem("pendingCapability", capability.id);
    if (filePayload) {
      localStorage.setItem(
        "pendingFile",
        JSON.stringify({ ...filePayload, text: message }),
      );
    }
    window.location.href = "/app";
  };

  return (
    <HeroSection
      title={capability.label}
      description={capability.description}
      placeholder={`Paste any message — Avertune will use ${capability.label} to help you respond.`}
      onAnalyse={handleAnalyse}
      showBackLink={false}
      backLinkHref="/#capabilities"
      backLinkLabel="Back to Capabilities"
      showModeChips={true}
      defaultMode={capability.usedIn?.[0] || "professional"}
      examplesByMode={samplesByMode}
      charLimit={charLimit}
    />
  );
}
