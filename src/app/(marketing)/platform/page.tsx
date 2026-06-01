import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform | Avertune",
  description: "Explore the intelligence systems behind Avertune's Communication Intelligence Platform.",
};

const PLATFORM_ELEMENTS = [
  {
    id: "intelligence-pipeline",
    title: "Intelligence Pipeline",
    tagline: "The core reasoning system behind Avertune",
    description:
      "Instead of simply generating replies, Avertune analyses the communication situation first — helping users understand tone, intent, pressure, emotional context, escalation risk, negotiation positioning, and conversational dynamics. This allows Avertune to generate responses that are not only well-written, but strategically aligned to the situation.",
    benefits: [
      "Tone analysis and intent breakdown",
      "Communication risk level assessment",
      "Recommended strategy and calibrated responses",
      "Alternative reply styles and next-best-action guidance",
    ],
    builtFor: ["Professionals", "Founders", "Recruiters", "Sales teams", "Customer-facing teams", "Managers"],
  },
  {
    id: "outcome-simulation",
    title: "Outcome Simulation",
    tagline: "Understand the likely impact before sending",
    description:
      "Outcome Simulation helps users think ahead before responding. Avertune estimates how a response may affect the conversation based on communication patterns, emotional pressure, negotiation signals, and conversational context. The goal is not prediction certainty — the goal is smarter communication decisions.",
    benefits: [
      "Likelihood of escalation or cooperation",
      "Emotional sensitivity level indicators",
      "Negotiation strength impact assessment",
      "Communication clarity scoring",
    ],
    builtFor: ["Anyone in high-stakes conversations", "Sales professionals", "Leaders and managers", "Difficult relationship moments"],
  },
  {
    id: "communication-score",
    title: "Communication Score",
    tagline: "Improve communication quality over time",
    description:
      "The Communication Score helps users understand the effectiveness and consistency of their communication patterns. Rather than focusing only on individual replies, Avertune helps users improve overall communication quality over time — designed as guidance, communication coaching, and self-improvement support, not as a judgment system.",
    benefits: [
      "Clarity, professionalism, and confidence tracking",
      "Emotional control and escalation pattern insights",
      "Negotiation balance and strategic alignment",
      "Communication consistency over time",
    ],
    builtFor: ["Individuals seeking growth", "Sales and support teams", "Managers and leaders", "Professionals in high-stakes roles"],
  },
  {
    id: "behavioural-memory",
    title: "Behavioural Memory",
    tagline: "Personalized communication intelligence",
    description:
      "Behavioural Memory helps Avertune learn communication preferences and interaction patterns over time to deliver more personalized guidance. This allows the platform to feel more like a strategic communication assistant rather than a one-time AI tool. Users maintain full control over their data at all times.",
    benefits: [
      "Preferred tone style and communication preferences",
      "Industry context and negotiation tendencies",
      "Recurring conversation pattern recognition",
      "Smarter, faster suggestions over time",
    ],
    builtFor: ["Long-term users", "Sales professionals", "Founders and consultants", "Anyone who values personalization"],
  },
  {
    id: "playbook-engine",
    title: "Playbook Engine",
    tagline: "Communication standards at scale",
    description:
      "The Playbook Engine allows individuals, teams, and organizations to align communication outputs with preferred communication standards and workflows. Instead of generic responses, Avertune can follow communication principles defined by the user or organization — enabling consistency, brand voice protection, and team alignment.",
    benefits: [
      "Sales communication frameworks",
      "Leadership and customer support standards",
      "Escalation handling structures",
      "Recruiter and negotiation playbooks",
    ],
    builtFor: ["Enterprise teams", "Sales organizations", "Customer support teams", "Founders scaling communication"],
  },
  {
    id: "team-analytics",
    title: "Team Analytics",
    tagline: "Communication insights for modern teams",
    description:
      "Team Analytics helps organizations understand communication patterns, quality trends, and operational risks across teams. Designed to support communication improvement, coaching, and workflow optimization — not invasive employee surveillance.",
    benefits: [
      "Communication activity and escalation trend tracking",
      "Negotiation quality and response consistency insights",
      "Follow-up effectiveness measurement",
      "Communication risk frequency reporting",
    ],
    builtFor: ["Sales and recruiting teams", "Support and leadership teams", "Agencies and startups", "Growing organizations"],
  },
];

export default function PlatformPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">The Platform</p>
          <h1
            className="font-display font-medium text-white mb-5 leading-[1.1]"
            style={{ fontSize: "clamp(32px,5vw,62px)" }}
          >
            Intelligence systems that work<br />together behind the scenes
          </h1>
          <p className="text-base text-white/60 max-w-[540px] mx-auto leading-[1.7]">
            Avertune is built to help individuals, professionals, teams, and organizations communicate more clearly,
            strategically, and effectively across high-stakes conversations.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <Link href="/auth/signup" className="px-6 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all">
              Start free trial
            </Link>
            <Link href="/solutions" className="px-6 py-3 rounded-xl bg-white/10 text-white text-[14px] font-medium hover:bg-white/20 transition-all">
              View solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Platform elements */}
      <section className="py-20 px-8">
        <div className="max-w-[1120px] mx-auto space-y-6">
          {PLATFORM_ELEMENTS.map((el, i) => (
            <div
              key={el.id}
              id={el.id}
              className="bg-white rounded-[28px] border border-navy-900/[0.08] overflow-hidden shadow-sm scroll-mt-24"
            >
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-500 mb-2">
                      Platform Element {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="text-[26px] md:text-[32px] font-display font-medium text-navy-900 mb-2 leading-tight">
                      {el.title}
                    </h2>
                    <p className="text-base text-navy-500 mb-5 font-medium">{el.tagline}</p>
                    <p className="text-[15px] text-navy-600 leading-[1.75] mb-8 max-w-[680px]">{el.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Benefits */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-navy-400 mb-3">
                          What you get
                        </p>
                        <ul className="space-y-2">
                          {el.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-[14px] text-navy-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Built for */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-navy-400 mb-3">
                          Built for
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {el.builtFor.map((role) => (
                            <span
                              key={role}
                              className="px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-[12px] text-violet-700 font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-8 border-t border-navy-900/[0.06]">
        <div className="max-w-[640px] mx-auto text-center">
          <h2
            className="font-display font-medium text-navy-900 mb-4"
            style={{ fontSize: "clamp(24px,3.5vw,40px)" }}
          >
            Ready to communicate more intelligently?
          </h2>
          <p className="text-base text-navy-500 mb-8 leading-[1.7]">
            Start for free — no prompt engineering required. Paste a message and the Intelligence Pipeline does the rest.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/auth/signup"
              className="inline-flex h-11 px-6 text-[14px] font-medium bg-violet-600 text-white rounded-xl items-center hover:bg-violet-500 transition-colors"
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 px-6 text-[14px] font-medium border border-navy-200 text-navy-800 rounded-xl items-center hover:border-violet-300 hover:text-violet-600 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
