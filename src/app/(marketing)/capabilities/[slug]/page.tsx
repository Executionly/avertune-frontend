import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CAPABILITIES } from "@/lib/constants/capabilities";
import { CapabilityDetailHero } from "@/components/capabilities/CapabilityDetailHero";
import { CapabilityFeatures } from "@/components/capabilities/CapabilityFeatures";
import { CtaSection } from "@/components/marketing/CtaSection";
import { SectionHeading } from "@/components/ui";

interface PageProps { params: { slug: string } }

export function generateStaticParams() {
  return CAPABILITIES.map((c) => ({ slug: c.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cap = CAPABILITIES.find((c) => c.id === params.slug);
  if (!cap) return {};
  return { title: `${cap.label} — Avertune`, description: cap.description };
}

export default function CapabilityDetailPage({ params }: PageProps) {
  const cap = CAPABILITIES.find((c) => c.id === params.slug);
  if (!cap) notFound();
  const related = CAPABILITIES.filter((c) => c.id !== cap.id).slice(0, 3);

  return (
    <>
      <CapabilityDetailHero capability={cap} />
      <CapabilityFeatures capability={cap} />
      <section className="py-16 px-10 bg-cream-100">
        <div className="max-w-[1120px] mx-auto">
          <SectionHeading eyebrow="More capabilities" title="Explore other intelligence tools" className="mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((c) => (
              <Link key={c.id} href={`/capabilities/${c.id}`}>
                <div className="bg-white border border-navy-100/80 rounded-2xl p-6 hover:border-violet-200 hover:shadow-md hover:-translate-y-1 transition-all">
                  <h3 className="text-base font-semibold text-navy-800 mb-1">{c.label}</h3>
                  <p className="text-sm text-navy-500">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
