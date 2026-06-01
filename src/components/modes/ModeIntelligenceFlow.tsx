import { SectionHeading } from "@/components/ui";
import { CAPABILITIES } from "@/lib/constants/capabilities";
import type { Mode } from "@/lib/types";
import Link from "next/link";

interface ModeIntelligenceFlowProps {
  mode: Mode;
}

export function ModeIntelligenceFlow({ mode }: ModeIntelligenceFlowProps) {
  const relatedCapabilities = CAPABILITIES.filter((c) =>
    c.usedIn.includes(mode.id),
  );

  return (
    <section className="py-20 px-10 bg-cream-100">
      <div className="max-w-[1120px] mx-auto">
        <SectionHeading
          eyebrow="Intelligence Engines"
          title="Capabilities powering<br/>this mode"
          subtitle={`${mode.label} uses these internal engines to analyse and respond to your specific communication context.`}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedCapabilities.map((cap) => (
            <Link key={cap.id} href={`/capabilities/${cap.id}`}>
              <div className="bg-white border border-navy-100/80 rounded-2xl p-6 hover:border-violet-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer h-full">
                <h3 className="text-base font-semibold text-navy-800 mb-2">
                  {cap.label}
                </h3>
                <p className="text-sm text-navy-500 leading-[1.65] mb-4">
                  {cap.tagline}
                </p>
                <ul className="flex flex-col gap-1">
                  {cap.features.slice(0, 3).map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[12px] text-navy-400"
                    >
                      <span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-violet-500 font-medium mt-4">
                  View capability →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
