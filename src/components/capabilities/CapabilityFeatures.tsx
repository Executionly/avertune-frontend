import type { Capability } from "@/lib/types";
import { SectionHeading } from "@/components/ui";

interface CapabilityFeaturesProps {
  capability: Capability;
}

export function CapabilityFeatures({ capability }: CapabilityFeaturesProps) {
  return (
    <section className="py-20 px-10 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Features List */}
          <div>
            <SectionHeading
              eyebrow="What it does"
              title="Key features"
              className="mb-8"
            />
            <ul className="flex flex-col gap-4">
              {capability.features.map((feat, i) => (
                <li key={feat} className="flex items-start gap-4 p-5 bg-cream-50 border border-navy-100/60 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-violet-500 text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-[15px] text-navy-700 leading-[1.6]">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example Preview */}
          {capability.example && (
            <div>
              <SectionHeading
                eyebrow="Example"
                title="See it in action"
                className="mb-8"
              />
              <div className="rounded-2xl overflow-hidden border border-navy-100/80 shadow-sm">
                {/* Input */}
                <div className="bg-navy-800 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/40 mb-2">Message received</p>
                  <p className="text-sm text-white/85 leading-[1.65]">{capability.example.input}</p>
                </div>
                {/* Arrow */}
                <div className="bg-violet-500 px-5 py-2.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <svg viewBox="0 0 12 14" fill="currentColor" className="w-3 h-3"><path d="M7 1L1 8h5l-1 5 6-7H6l1-5z"/></svg>
                  </div>
                  <span className="text-[12px] font-semibold text-white">Avertune Intelligence Pipeline</span>
                </div>
                {/* Output */}
                <div className="bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-navy-400 mb-2">Recommended response</p>
                  <p className="text-sm text-navy-800 leading-[1.65] italic">{capability.example.output}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-1 text-[11px] font-medium bg-teal-50 text-teal-600 border border-teal-200 rounded-full">94% Confidence</span>
                    <span className="px-2 py-1 text-[11px] font-medium bg-violet-50 text-violet-600 border border-violet-200 rounded-full">Outcome: Positive</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
