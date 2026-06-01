import Link from "next/link";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { Badge } from "@/components/ui";
import { MODES } from "@/lib/constants/modes";
import { cn } from "@/lib/utils";

const EMOJI_BG: Record<string, string> = {
  "mode-em-pro": "from-violet-50 to-violet-100 border-violet-200",
  "mode-em-sales": "from-amber-50 to-amber-100 border-amber-200",
  "mode-em-rel": "from-green-50 to-green-100 border-green-200",
};
const BADGE_MAP = { violet: "violet", amber: "amber", green: "green" } as const;

export function ModesSection() {
  return (
    <RevealWrapper>
      <section className="bg-cream-100 py-20 px-8" id="modes">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 reveal">
            Three Core Modes
          </p>
          <h2
            className="font-display font-medium text-navy-900 mb-4 reveal reveal-d1"
            style={{ fontSize: "clamp(28px,3.8vw,50px)", lineHeight: 1.1 }}
          >
            One platform. Three intelligence modes.
            <br />
            Every high-stakes conversation covered.
          </h2>
          <p className="text-base text-navy-500 max-w-[540px] leading-[1.7] mb-12 reveal reveal-d2">
            Each mode has a dedicated intelligence engine trained on the
            psychology, dynamics, and stakes of that specific context.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MODES.map((mode, i) => (
              <Link key={mode.id} href={`/modes/${mode.id}`}>
                <div
                  className={cn(
                    "bg-white border border-navy-100/80 rounded-[28px] p-8 flex flex-col gap-5 h-full cursor-pointer reveal transition-all hover:-translate-y-1 hover:shadow-lg hover:border-violet-200",
                    i === 1 && "reveal-d1",
                    i === 2 && "reveal-d2",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div>
                      <Badge variant={BADGE_MAP[mode.badgeVariant]}>
                        {mode.badge}
                      </Badge>
                      <h3 className="text-xl font-semibold text-navy-800 mt-1.5">
                        {mode.label}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-navy-500 leading-[1.65]">
                    {mode.description}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {mode.useCases.map((uc) => (
                      <li
                        key={uc}
                        className="flex items-start gap-2 text-[13px] text-navy-500"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
