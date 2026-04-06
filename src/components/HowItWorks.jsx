import { ClipboardPaste, Radar, SendHorizonal } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardPaste,
    title: "Paste the message",
    desc: "Drop in any message from email, SMS, WhatsApp, LinkedIn — any platform you use.",
    color: "var(--green)",
  },
  {
    num: "02",
    icon: Radar,
    title: "Understand the situation",
    desc: "Avertune reads tone, risk, and intent in seconds — before you write a word.",
    color: "var(--teal)",
  },
  {
    num: "03",
    icon: SendHorizonal,
    title: "Send the right response",
    desc: "Pick from strategically crafted options. Copy and send with total confidence.",
    color: "var(--blue)",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ padding: "clamp(64px,8vw,96px) 0", background: "var(--bg2)" }}
    >
      <div className="container">
        <div
          style={{ textAlign: "center", marginBottom: "clamp(40px,5vw,64px)" }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--green)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontSize: "clamp(28px,4.5vw,52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Three simple steps.
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "clamp(12px,2vw,20px)",
          }}
        >
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                style={{
                  padding: "clamp(24px,3vw,32px) clamp(20px,2.5vw,28px)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  textAlign: "center",
                  transition:
                    "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = s.color;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 48px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: s.color,
                    marginBottom: 16,
                    fontFamily: "monospace",
                  }}
                >
                  STEP {s.num}
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    margin: "0 auto 18px",
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={s.color} strokeWidth={1.8} />
                </div>
                <h3
                  style={{
                    fontSize: "clamp(16px,2vw,18px)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    marginBottom: 10,
                    color: "var(--ink)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "clamp(13px,1.5vw,14px)",
                    color: "var(--ink-3)",
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
