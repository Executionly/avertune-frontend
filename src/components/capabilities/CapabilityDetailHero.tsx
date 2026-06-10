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
    // Fetch all samples (no token required) and group by mode
    fetchSamplesByMode()
      .then(setSamplesByMode)
      .catch(() => {});

    // Fetch char limit from subscription/plans
    setCharLimit(getStoredWordLimit());
  }, []);

  const handleAnalyse = (message: string, mode: string) => {
    sessionStorage.setItem("pendingAnalysis", message);
    sessionStorage.setItem("pendingMode", mode);
    sessionStorage.setItem("pendingCapability", capability.id);
    window.location.href = "/app";
  };

  return (
    <HeroSection
      title={capability.label}
      description={capability.description}
      placeholder={`Paste any message — Avertune will use ${capability.label} to help you respond.`}
      onAnalyse={handleAnalyse}
      showBackLink={true}
      backLinkHref="/#capabilities"
      backLinkLabel="Back to Capabilities"
      showModeChips={true}
      defaultMode={capability.usedIn?.[0] || "professional"}
      examplesByMode={samplesByMode}
      charLimit={charLimit}
    />
  );
}
