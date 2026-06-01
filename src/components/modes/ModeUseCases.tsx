import type { Mode } from "@/lib/types";
import { SectionHeading } from "@/components/ui";

interface ModeUseCasesProps {
  mode: Mode;
}

export function ModeUseCases({ mode }: ModeUseCasesProps) {
  return (
    <section className="py-20 px-10 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Use Cases */}
          <div>
            <SectionHeading
              eyebrow="Use Cases"
              title="What you can handle<br/>with this mode"
              className="mb-8"
            />
            <ul className="flex flex-col gap-4">
              {mode.useCases.map((uc) => (
                <li
                  key={uc}
                  className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl border border-navy-100/60"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                  <span className="text-[15px] text-navy-700 leading-[1.6]">
                    {uc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Users */}
          <div>
            <SectionHeading
              eyebrow="Who it's for"
              title="Built for these<br/>professionals"
              className="mb-8"
            />
            <ul className="flex flex-col gap-4">
              {mode.targetUsers.map((user) => (
                <li
                  key={user}
                  className="flex items-center gap-4 p-5 bg-white border border-navy-100/80 rounded-xl hover:border-violet-200 hover:shadow-sm transition-all"
                >
                  <span className="text-[15px] font-medium text-navy-800">
                    {user}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
