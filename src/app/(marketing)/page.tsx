import { HeroSection } from "@/components/marketing/HeroSection";
import { ModesSection } from "@/components/marketing/ModesSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { IntelligenceScoreSection } from "@/components/marketing/IntelligenceScoreSection";
import { DifferentiatorsSection } from "@/components/marketing/DifferentiatorsSection";
import { CompareSection } from "@/components/marketing/CompareSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaSection } from "@/components/marketing/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ModesSection />
      <HowItWorksSection />
      <IntelligenceScoreSection />
      <DifferentiatorsSection />
      <CompareSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
