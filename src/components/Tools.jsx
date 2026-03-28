import {
  Activity,
  MessageSquare,
  ShieldCheck,
  Swords,
  Clock,
} from "lucide-react";

const tools = [
  {
    icon: Activity,
    slug: "tone-checker",
    title: "Tone Checker",
    desc: "Understand the emotional tone of any message before responding.",
    color: "var(--green)",
  },
  {
    icon: MessageSquare,
    slug: "reply-generator",
    title: "Reply Generator",
    desc: "Paste a message and generate calm, clear reply options instantly.",
    color: "var(--teal)",
  },
  {
    icon: ShieldCheck,
    slug: "boundary-builder",
    title: "Boundary Builder",
    desc: "Turn weak responses into respectful, confident boundaries.",
    color: "var(--green)",
  },
  {
    icon: Swords,
    slug: "negotiation-reply",
    title: "Sales & Negotiation",
    desc: "Respond strategically when someone pressures you in a negotiation.",
    color: "var(--teal)",
  },
  {
    icon: Clock,
    slug: "follow-up-writer",
    title: "Follow-Up Writer",
    desc: "Generate effective follow-up messages that actually get responses.",
    color: "var(--blue)",
  },
  {
    icon: Clock,
    slug: "difficult-email",
    title: "Difficult Email",
    desc: "Rewrite sensitive workplace emails into safe, polished versions.",
    color: "#f59e0b",
  },
  {
    icon: Clock,
    slug: "intent-detector",
    title: "Intent Detector",
    desc: "Decode the hidden meaning and real intent behind any message.",
    color: "#a78bfa",
  },
];

export default function Tools({ onTool, onSignup }) {
  return (
    <section
      id="tools"
      style={{ padding: "clamp(64px,8vw,96px) 0", background: "var(--bg2)" }}
    >
      <div className="container">
        <div
          style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--blue)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Communication tools
          </p>
          <h2
            style={{
              fontSize: "clamp(26px,4vw,48px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: 12,
            }}
          >
            Built for everyday situations.
          </h2>
          <p
            style={{
              fontSize: "clamp(14px,1.8vw,16px)",
              color: "var(--ink-3)",
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            Understand messages, respond better, communicate with confidence.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(min(100%,280px),1fr))",
            gap: "clamp(10px,1.5vw,16px)",
            marginBottom: "clamp(24px,3vw,40px)",
          }}
        >
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.slug}
                style={{
                  padding: "clamp(20px,2.5vw,26px)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: `${t.color}12`,
                    border: `1px solid ${t.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 15,
                  }}
                >
                  <Icon size={18} color={t.color} strokeWidth={1.8} />
                </div>
                <h3
                  style={{
                    fontSize: "clamp(14px,1.8vw,15.5px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: 7,
                    color: "var(--ink)",
                  }}
                >
                  {t.title}
                </h3>
                <p
                  style={{
                    fontSize: "clamp(12.5px,1.4vw,13.5px)",
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                    flex: 1,
                    marginBottom: 18,
                  }}
                >
                  {t.desc}
                </p>
                <button
                  onClick={() => onTool?.(t.slug)}
                  style={{
                    alignSelf: "flex-start",
                    padding: "7px 15px",
                    borderRadius: 8,
                    border: "1px solid var(--border2)",
                    background: "transparent",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    fontSize: 12.5,
                    color: "var(--ink-2)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = t.color;
                    e.currentTarget.style.color = "#000";
                    e.currentTarget.style.borderColor = t.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--ink-2)";
                    e.currentTarget.style.borderColor = "var(--border2)";
                  }}
                >
                  Open Tool →
                </button>
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: "clamp(20px,3vw,28px) clamp(20px,3vw,32px)",
            background:
              "linear-gradient(135deg,rgba(34,197,94,0.06),rgba(45,212,191,0.06) 50%,rgba(56,189,248,0.06))",
            border: "1px solid var(--border2)",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "clamp(15px,2vw,17px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Explore the full Avertune communication toolkit.
          </p>
          <button
            onClick={onSignup}
            className="btn-green"
            style={{
              padding: "clamp(10px,1.5vw,12px) clamp(22px,3vw,30px)",
              borderRadius: 10,
              fontSize: 14,
              display: "block",
              margin: "0 auto 10px",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Start Free Trial
          </button>
          <p style={{ fontSize: 12.5, color: "var(--ink-4)" }}>
            Unlock all tools with a free account.
          </p>
        </div>
      </div>
    </section>
  );
}
