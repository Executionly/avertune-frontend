import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { Badge } from "@/components/ui";

const METRICS = [
  {
    label: "Clarity",
    val: 92,
    display: "9.2",
    color: "from-violet-400 to-violet-500",
  },
  {
    label: "Tone Control",
    val: 88,
    display: "8.8",
    color: "from-teal-400 to-teal-500",
  },
  {
    label: "Negotiation Strength",
    val: 76,
    display: "7.6",
    color: "from-navy-400 to-navy-500",
  },
  {
    label: "Boundary Strength",
    val: 72,
    display: "7.2",
    color: "from-amber-400 to-amber-500",
  },
  {
    label: "Escalation Control",
    val: 85,
    display: "8.5",
    color: "from-violet-400 to-violet-500",
  },
];

const INSIGHTS = [
  {
    icon: "",
    title: "Behavioural Pattern Detected",
    body: "You tend to over-apologise under pressure. Avertune automatically adjusts your responses to maintain confidence without losing warmth.",
  },
  {
    icon: "",
    title: "Improvement This Month",
    body: "Your escalation control score improved by 14 points. You've handled 3 high-risk conversations without triggering defensive responses.",
  },
  {
    icon: "",
    title: "Coaching Insight",
    body: "In sales conversations, you frequently over-explain when challenged on price. Your new responses are 38% more concise and hold leverage 2x better.",
  },
  {
    icon: "",
    title: "Outcome Feedback Loop",
    body: "Of your last 24 responses, 87% were rated 'Worked' or 'Partially worked.' Avertune is learning your preferences and improving its outputs.",
  },
];

export function IntelligenceScoreSection() {
  return (
    <RevealWrapper>
      <section className="bg-cream-100 py-20 px-8" id="intelligence">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 reveal">
            Communication Intelligence Score
          </p>
          <h2
            className="font-display font-medium text-navy-900 mb-4 reveal reveal-d1"
            style={{ fontSize: "clamp(28px,3.8vw,50px)", lineHeight: 1.1 }}
          >
            Your communication patterns,
            <br />
            tracked and improved over time.
          </h2>
          <p className="text-base text-navy-500 max-w-[540px] leading-[1.7] mb-12 reveal reveal-d2">
            Every interaction builds your Communication Intelligence Profile —
            exposing patterns, coaching blind spots, and making you measurably
            better.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Score card */}
            <div className="bg-white border border-navy-100/80 rounded-[28px] p-8 shadow-sm reveal">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-navy-800">
                  Communication Intelligence Profile
                </h3>
                <Badge variant="violet">Live</Badge>
              </div>
              <div
                className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-violet-500 to-navy-700 flex items-center justify-center mx-auto mb-6"
                style={{ boxShadow: "0 8px 28px rgba(97,48,221,0.28)" }}
              >
                <span className="text-4xl font-bold text-white">87</span>
              </div>
              <div className="flex flex-col gap-3.5">
                {METRICS.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="text-[13px] text-navy-500 w-[150px] flex-shrink-0">
                      {m.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                        style={{ width: `${m.val}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-semibold text-navy-800 min-w-[32px] text-right">
                      {m.display}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="flex flex-col gap-4 reveal reveal-d1">
              {INSIGHTS.map((ins) => (
                <div
                  key={ins.title}
                  className="bg-white border border-navy-100/80 rounded-2xl p-5 hover:border-violet-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-md bg-violet-50 flex items-center justify-center text-base">
                      {ins.icon}
                    </div>
                    <h4 className="text-sm font-semibold text-navy-800">
                      {ins.title}
                    </h4>
                  </div>
                  <p className="text-[13px] text-navy-500 leading-[1.6]">
                    {ins.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
