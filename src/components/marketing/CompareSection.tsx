import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    label: "Core Capability",
    old: "Generates better text",
    new_: "Understands the situation, evaluates risk, recommends strategy",
  },
  {
    label: "Requires Prompting?",
    old: "Yes — write a detailed prompt",
    new_: "No — paste and go, pipeline runs automatically",
  },
  {
    label: "Outcome Prediction",
    old: "None",
    new_: "Every response includes a simulated likely outcome",
  },
  {
    label: "Learns Your Patterns",
    old: "No memory of communication habits",
    new_: "Behavioural memory improves every future output",
  },
  {
    label: "Team / Enterprise Layer",
    old: "Not designed for team communication intelligence",
    new_: "Playbooks, team analytics, org-level communication standards",
  },
  {
    label: "Communication Score",
    old: "No scoring or tracking",
    new_: "Full CI profile — clarity, tone, risk, negotiation strength over time",
  },
];

export function CompareSection() {
  return (
    <RevealWrapper>
      <section className="bg-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 reveal">
              Comparison
            </p>
            <h2
              className="font-display font-medium text-navy-900 mb-4 reveal reveal-d1"
              style={{ fontSize: "clamp(28px,3.8vw,50px)", lineHeight: 1.1 }}
            >
              Avertune vs everything else
            </h2>
            <p className="text-base text-navy-500 max-w-[480px] mx-auto leading-[1.7] reveal reveal-d2">
              Other tools help you write. Avertune helps you think, decide, and
              respond strategically.
            </p>
          </div>

          <div className="overflow-x-auto -mx-2 px-2 reveal">
            <div className="min-w-[560px] border border-navy-900/[0.08] rounded-[28px] overflow-hidden shadow-sm">
              <div className="grid grid-cols-[1.5fr_2fr_2fr]">
                <div className="p-4 px-5" />
                <div className="p-4 px-5 border-l border-navy-900/[0.08] text-xs font-semibold uppercase tracking-[0.08em] text-navy-400">
                  LLMs (ChatGPT / Claude)
                </div>
                <div className="p-4 px-5 border-l border-navy-900/[0.08] text-xs font-semibold uppercase tracking-[0.08em] text-violet-500">
                  Avertune
                </div>
              </div>
              {ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-[1.5fr_2fr_2fr] border-t border-navy-900/[0.08]",
                    i % 2 === 0 && "bg-cream-50",
                  )}
                >
                  <div className="p-4 px-5 text-[13px] font-semibold text-navy-700 leading-snug">
                    {row.label}
                  </div>
                  <div className="p-4 px-5 border-l border-navy-900/[0.08] text-[13px] text-navy-400 leading-snug">
                    {row.old}
                  </div>
                  <div className="p-4 px-5 border-l border-navy-900/[0.08] text-[13px] text-navy-800 font-medium flex items-start gap-1.5 leading-snug">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 flex-shrink-0" />
                    {row.new_}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
