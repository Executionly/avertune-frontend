import {
  Shield,
  Users,
  Globe,
  CheckCircle2,
  Sparkles,
  Languages,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
export function SecuritySection() {
  return (
    <section
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
              color: "var(--green)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Trust & Privacy
          </p>
          <h2
            style={{
              fontSize: "clamp(26px,4vw,46px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Private, Compliant, and Secure
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(16px,2vw,24px)",
          }}
        >
          {[
            {
              icon: Shield,
              title: "Your data stays yours",
              desc: "Messages are never stored. We don’t train on your conversations.",
            },
            {
              icon: CheckCircle2,
              title: "GDPR & SOC 2 ready",
              desc: "Built to meet the highest compliance standards for your peace of mind.",
            },
            {
              icon: Sparkles,
              title: "Enterprise-grade security",
              desc: "End-to-end encryption and regular third-party audits.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(24px,3vw,32px)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                transition: "transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "var(--green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(34,197,94,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <item.icon size={24} color="var(--green)" />
              </div>
              <h3
                style={{
                  fontSize: "clamp(16px,2vw,18px)",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "clamp(13px,1.5vw,14px)",
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection() {
  const audiences = [
    {
      title: "Professionals & Executives",
      desc: "Navigate tense conversations, protect your reputation, and save hours of mental energy.",
    },
    {
      title: "Sales & Customer Support",
      desc: "Reply to objections, diffuse frustration, and close deals with confidence.",
    },
    {
      title: "Founders & Small Teams",
      desc: "Communicate like a pro in every email, DM, or text—without overthinking.",
    },
    {
      title: "Job Seekers & Recruiters",
      desc: "Craft follow‑ups, negotiation replies, and professional outreach that stands out.",
    },
    {
      title: "Students & Academics",
      desc: "Write polished emails to professors, advisors, and peers with clarity.",
    },
    {
      title: "Anyone Who Communicates",
      desc: "Whether it’s dating, family, or friendship – reply with confidence.",
    },
  ];

  return (
    <section
      style={{ padding: "clamp(64px,8vw,96px) 0", background: "var(--bg)" }}
    >
      <div className="container">
        <div
          style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--teal)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            For Everyone
          </p>
          <h2
            style={{
              fontSize: "clamp(26px,4vw,46px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Who Can Benefit from Avertune?
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(12px,1.5vw,20px)",
          }}
        >
          {audiences.map((a, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(20px,2.5vw,26px)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(15px,1.8vw,17px)",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {a.title}
              </h3>
              <p
                style={{
                  fontSize: "clamp(12.5px,1.4vw,13.5px)",
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                }}
              >
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AccuracySection() {
  return (
    <section
      style={{ padding: "clamp(64px,8vw,96px) 0", background: "var(--bg2)" }}
    >
      <div className="container">
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(45,212,191,0.06))",
            borderRadius: 28,
            padding: "clamp(40px,5vw,64px)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px,4vw,40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 16,
            }}
          >
            AI‑powered communication that feels human
          </h2>
          <p
            style={{
              fontSize: "clamp(14px,1.8vw,16px)",
              color: "var(--ink-3)",
              maxWidth: 560,
              margin: "0 auto 32px",
            }}
          >
            Natural, thoughtful replies tailored to your situation.
          </p>

          {/* Metrics row – no icons, with animated numbers */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "clamp(32px,5vw,64px)",
              flexWrap: "wrap",
              borderTop: "1px solid rgba(34,197,94,0.15)",
              borderBottom: "1px solid rgba(34,197,94,0.15)",
              padding: "clamp(24px,3vw,36px) 0",
              marginTop: 16,
            }}
          >
            <StatItem value="99.9" suffix="%" label="accuracy" />
            <StatItem value="Human-like" suffix="" label="replies" />
            <StatItem value="10" suffix="+" label="languages" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // For numeric values, animate; for text like "Human-like" just set directly
          if (!isNaN(parseFloat(value))) {
            let start = 0;
            const end = parseFloat(value);
            const duration = 1500;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = end / steps;
            let current = start;
            const timer = setInterval(() => {
              current += increment;
              if (current >= end) {
                clearInterval(timer);
                setCount(end);
              } else {
                setCount(current);
              }
            }, stepTime);
            return () => clearInterval(timer);
          } else {
            // For non‑numeric (e.g., "Human-like"), just show it immediately
            setCount(value);
          }
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const displayValue =
    typeof count === "number"
      ? count % 1 === 0
        ? count
        : count.toFixed(1)
      : count;

  return (
    <div ref={ref} style={{ textAlign: "center", minWidth: 120 }}>
      <div
        style={{
          fontSize: "clamp(28px,4vw,38px)",
          fontWeight: 800,
          color: "var(--green)",
        }}
      >
        {displayValue}
        {suffix}
      </div>
      <div style={{ fontSize: 14, color: "var(--ink-3)" }}>{label}</div>
    </div>
  );
}
