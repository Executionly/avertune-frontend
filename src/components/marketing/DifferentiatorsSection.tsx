import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { cn } from "@/lib/utils";

const DIFFS = [
  {
    icon: "",
    title: "Outcome Simulation",
    desc: "Every response comes with a predicted likely outcome. Know what happens before you send.",
  },
  {
    icon: "",
    title: "Behavioural Memory",
    desc: "Avertune learns your patterns — over-apologising, over-explaining, passive tone under pressure. Auto-corrected in every output.",
  },
  {
    icon: "",
    title: "Zero Prompt Engineering",
    desc: "Paste a message. That's it. The 14-step intelligence pipeline runs automatically. You never need to write a prompt.",
  },
  {
    icon: "",
    title: "Strategic Reasoning",
    desc: "Before generating a response, Avertune builds a recommended strategy. Explicit choices, not guesses.",
  },
  {
    icon: "",
    title: "Playbook Engine",
    desc: "Enterprise teams define their own communication standards. Sales, HR, customer support playbooks — every response aligns automatically.",
  },
  {
    icon: "",
    title: "Team Communication Analytics",
    desc: "See if reps over-apologise in pricing conversations, if follow-ups are too passive, or if escalation risk is high across your team.",
  },
];

export function DifferentiatorsSection() {
  return (
    <RevealWrapper>
      <section className="bg-[#0f0f0f] py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-300 mb-3 reveal">
              Why Avertune is Different
            </p>
            <h2
              className="font-display font-medium text-[#e8ecf8] mb-4 reveal reveal-d1"
              style={{ fontSize: "clamp(28px,3.8vw,50px)", lineHeight: 1.1 }}
            >
              LLMS (ChatGPT/Claude) generates text.
              <br />
              Avertune understands the situation.
            </h2>
            <p className="text-base text-white/55 max-w-[520px] mx-auto leading-[1.7] reveal reveal-d2">
              The real moat is structured communication intelligence, memory,
              outcomes, playbooks, and organisational workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIFFS.map((d, i) => (
              <div
                key={d.title}
                className={cn(
                  "bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-violet-500/40 transition-all reveal",
                  i % 3 === 1 && "reveal-d1",
                  i % 3 === 2 && "reveal-d2",
                )}
              >
                <h3 className="text-base font-semibold text-[#e8ecf8] mb-2">
                  {d.title}
                </h3>
                <p className="text-sm text-white/55 leading-[1.65]">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
