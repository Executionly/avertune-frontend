import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MODES } from "@/lib/constants/modes";
import { ModeDetailHero } from "@/components/modes/ModeDetailHero";
import { ModeUseCases } from "@/components/modes/ModeUseCases";
import { ModeIntelligenceFlow } from "@/components/modes/ModeIntelligenceFlow";
import { CtaSection } from "@/components/marketing/CtaSection";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return MODES.map((m) => ({ slug: m.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const mode = MODES.find((m) => m.id === params.slug);
  if (!mode) return {};
  return { title: `${mode.label} — Avertune`, description: mode.description };
}

export default function ModeDetailPage({ params }: PageProps) {
  const mode = MODES.find((m) => m.id === params.slug);
  if (!mode) notFound();
  return (
    <>
      {/* Pass the specific mode so input only shows this mode, not all three */}
      <ModeDetailHero mode={mode} />
      <ModeUseCases mode={mode} />
      <ModeIntelligenceFlow mode={mode} />
      <CtaSection />
    </>
  );
}
