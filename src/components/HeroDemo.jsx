import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Check,
  Share2,
  Lock,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useMySubscription } from "../lib/useSubscription.js";

const DEMOS = [
  {
    message: '"Why haven\'t you responded yet? I need an answer today."',
    tone: "Frustrated",
    risk: "Moderate escalation",
    intent: "Applying pressure",
    strategy: "Acknowledge urgency, set a clear timeline.",
    toneColor: "var(--blue)",
    variants: [
      {
        label: "Balanced",
        color: "var(--green)",
        bg: "rgba(34,197,94,0.07)",
        border: "rgba(34,197,94,0.22)",
        text: "Thanks for following up. I'm reviewing this now and will have a complete response to you by end of day today.",
      },
      {
        label: "Firm",
        color: "var(--teal)",
        bg: "rgba(45,212,191,0.07)",
        border: "rgba(45,212,191,0.22)",
        text: "I'm working through it and will respond when I'm ready. You can expect a reply by close of business.",
      },
      {
        label: "Warm",
        color: "var(--blue)",
        bg: "rgba(56,189,248,0.07)",
        border: "rgba(56,189,248,0.22)",
        text: "I really appreciate your patience — I want to give this proper attention. I'll have something to you by end of day.",
      },
      {
        label: "Delay",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.07)",
        border: "rgba(167,139,250,0.22)",
        text: "Thanks for the nudge. I need a bit more time to put together a thorough answer — I'll follow up first thing tomorrow.",
      },
    ],
  },
  {
    message: '"I feel like you never take my concerns seriously."',
    tone: "Hurt",
    risk: "Relationship tension",
    intent: "Seeking validation",
    strategy: "Acknowledge feelings before explaining your position.",
    toneColor: "var(--teal)",
    variants: [
      {
        label: "Balanced",
        color: "var(--green)",
        bg: "rgba(34,197,94,0.07)",
        border: "rgba(34,197,94,0.22)",
        text: "I hear you, and I'm sorry it came across that way. Your concerns genuinely matter to me — can we talk through this?",
      },
      {
        label: "Firm",
        color: "var(--teal)",
        bg: "rgba(45,212,191,0.07)",
        border: "rgba(45,212,191,0.22)",
        text: "I do take your concerns seriously. I'd like to understand specifically what's made you feel otherwise.",
      },
      {
        label: "Warm",
        color: "var(--blue)",
        bg: "rgba(56,189,248,0.07)",
        border: "rgba(56,189,248,0.22)",
        text: "That really matters to hear. I never want you to feel dismissed — let's find time to sit down so I can really listen.",
      },
      {
        label: "Delay",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.07)",
        border: "rgba(167,139,250,0.22)",
        text: "I want to give this the attention it deserves. Can we set up a call tomorrow so I can fully focus on what you're sharing?",
      },
    ],
  },
  {
    message: '"We need a 30% discount or we\'re going with a competitor."',
    tone: "Assertive",
    risk: "Deal risk",
    intent: "Testing boundaries",
    strategy: "Protect your position while keeping the door open.",
    toneColor: "var(--green)",
    variants: [
      {
        label: "Balanced",
        color: "var(--green)",
        bg: "rgba(34,197,94,0.07)",
        border: "rgba(34,197,94,0.22)",
        text: "I appreciate your directness. Our pricing reflects the value we deliver — I'd love to explore a structure that works for both sides.",
      },
      {
        label: "Firm",
        color: "var(--teal)",
        bg: "rgba(45,212,191,0.07)",
        border: "rgba(45,212,191,0.22)",
        text: "Our pricing is based on the value we deliver and isn't something I can move on. Happy to discuss what's included in more detail.",
      },
      {
        label: "Warm",
        color: "var(--blue)",
        bg: "rgba(56,189,248,0.07)",
        border: "rgba(56,189,248,0.22)",
        text: "I understand budget is a real constraint. Let's see if there's a creative arrangement — I want this to work for you.",
      },
      {
        label: "Delay",
        color: "#a78bfa",
        bg: "rgba(167,139,250,0.07)",
        border: "rgba(167,139,250,0.22)",
        text: "That's a significant ask. Let me take this back internally and see what I can do — I'll come back to you by end of week.",
      },
    ],
  },
];

const PHASE = { IDLE: 0, TYPING: 1, ANALYZING: 2, RESULT: 3 };
const VARIANT_DURATION = 2800;

function TypingText({ text, speed = 34, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const idx = useRef(0);
  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    setCursor(true);
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(iv);
        setTimeout(() => {
          setCursor(false);
          onDone?.();
        }, 380);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span style={{ color: "var(--ink)", fontSize: 13.5, lineHeight: 1.65 }}>
      {displayed}
      {cursor && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            background: "var(--green)",
            marginLeft: 1,
            verticalAlign: "text-bottom",
            animation: "blink 1s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

/* Each row — copy only animates on the ONE active variant */
function VariantRow({ variant, isActive }) {
  // copyState only cycles when this row IS active
  const [copyState, setCopyState] = useState("idle");
  const timerRef = useRef([]);

  useEffect(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    if (!isActive) {
      setCopyState("idle");
      return;
    }
    // wait 900ms after becoming active, then flash
    timerRef.current.push(setTimeout(() => setCopyState("hover"), 900));
    timerRef.current.push(setTimeout(() => setCopyState("copied"), 1350));
    timerRef.current.push(setTimeout(() => setCopyState("idle"), 2600));
    return () => timerRef.current.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${isActive ? variant.border : "var(--border)"}`,
        background: isActive ? variant.bg : "transparent",
        overflow: "hidden",
        transition: "border-color 0.35s, background 0.35s",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "7px 11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: isActive
            ? `1px solid ${variant.border}`
            : "1px solid transparent",
          transition: "border-color 0.35s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: variant.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: variant.color,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            {variant.label}
          </span>
          {variant.label === "Balanced" && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 4,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "var(--green)",
                letterSpacing: "0.04em",
              }}
            >
              RECOMMENDED
            </span>
          )}
        </div>

        {/* Copy — only shows state on active; others stay grey/idle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 9px",
            borderRadius: 6,
            border: `1px solid ${isActive && copyState === "copied" ? variant.border : isActive && copyState === "hover" ? "var(--border2)" : "var(--border)"}`,
            background:
              isActive && copyState === "copied"
                ? variant.bg
                : isActive && copyState === "hover"
                  ? "var(--surface2)"
                  : "transparent",
            color:
              isActive && copyState === "copied"
                ? variant.color
                : "var(--ink-4)",
            fontSize: 10.5,
            fontWeight: 600,
            transition: "all 0.22s",
            userSelect: "none",
          }}
        >
          {isActive && copyState === "copied" ? (
            <Check size={9} />
          ) : (
            <Copy size={9} />
          )}
          <span style={{ marginLeft: 3 }}>
            {isActive && copyState === "copied" ? "Copied!" : "Copy"}
          </span>
        </div>
      </div>

      {/* Text — only expanded on active */}
      {isActive && (
        <div
          style={{
            padding: "9px 11px",
            fontSize: 12,
            lineHeight: 1.65,
            color: "var(--ink)",
            animation: "fadeIn 0.28s ease both",
          }}
        >
          {variant.text}
        </div>
      )}
    </div>
  );
}

function DemoCard({ demo, phase, onTypingDone }) {
  const [activeVariant, setActiveVariant] = useState(0);
  useEffect(() => {
    if (phase !== PHASE.RESULT) {
      setActiveVariant(0);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % demo.variants.length;
      setActiveVariant(i);
    }, VARIANT_DURATION);
    return () => clearInterval(iv);
  }, [phase, demo]);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 28px 80px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.04)",
        pointerEvents: "none",
        userSelect: "none",
        width: "100%",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          padding: "11px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--ink-3)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
          }}
        >
          Avertune · Reply Radar
        </span>
        <div style={{ width: 44 }} />
      </div>

      {/* Message */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom:
            phase > PHASE.TYPING ? "1px solid var(--border)" : "none",
          minHeight: 72,
        }}
      >
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            marginBottom: 6,
          }}
        >
          Message received
        </div>
        {phase === PHASE.IDLE ? (
          <div
            className="shimmer"
            style={{ height: 16, width: "55%", borderRadius: 4 }}
          />
        ) : (
          <TypingText
            key={demo.message}
            text={demo.message}
            onDone={phase === PHASE.TYPING ? onTypingDone : undefined}
          />
        )}
      </div>

      {/* Analyze button */}
      {phase === PHASE.ANALYZING && (
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              padding: "9px",
              borderRadius: 9,
              textAlign: "center",
              background: "var(--green)",
              fontSize: 12.5,
              fontWeight: 700,
              color: "#000",
            }}
          >
            Analyze Message
          </div>
        </div>
      )}

      {/* Analyzing loader */}
      {phase === PHASE.ANALYZING && (
        <div style={{ padding: "14px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div className="dot-loader">
              <span />
              <span />
              <span />
            </div>
            <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
              Generating message…
            </span>
          </div>
          <div
            style={{
              height: 3,
              background: "var(--surface3)",
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg,var(--green),var(--teal))",
                borderRadius: 2,
                animation:
                  "progress-bar 1.6s cubic-bezier(0.4,0,0.2,1) forwards",
              }}
            />
          </div>
          {[55, 78, 62].map((w, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 9,
                alignItems: "center",
              }}
            >
              <div
                className="shimmer"
                style={{
                  height: 10,
                  width: 44,
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              />
              <div
                className="shimmer"
                style={{ height: 10, width: `${w}%`, borderRadius: 3 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {phase === PHASE.RESULT && (
        <div
          style={{ animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {/* Radar */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 12px",
            }}
          >
            {[
              { label: "Tone", val: demo.tone, color: demo.toneColor },
              { label: "Risk", val: demo.risk, color: "var(--blue)" },
              { label: "Intent", val: demo.intent, color: "var(--teal)" },
              { label: "Strategy", val: demo.strategy, color: "var(--ink-2)" },
            ].map((r) => (
              <div key={r.label}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "var(--ink-4)",
                    marginBottom: 3,
                  }}
                >
                  {r.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: r.color,
                    lineHeight: 1.3,
                  }}
                >
                  {r.val}
                </div>
              </div>
            ))}
          </div>

          {/* 4 variants */}
          <div
            style={{
              padding: "10px 12px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.09em",
                marginBottom: 4,
                paddingLeft: 2,
              }}
            >
              Reply options
            </div>
            {demo.variants.map((v, i) => (
              <VariantRow
                key={`${demo.message}-${v.label}`}
                variant={v}
                isActive={i === activeVariant}
              />
            ))}
          </div>

          {/* Share */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "9px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 7,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--ink-2)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <Share2 size={9} /> Share Insight
            </div>
            <span style={{ fontSize: 10, color: "var(--ink-4)" }}>
              Sign up to try live →
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Paywall Modal ── */
function PaywallModal({ onClose, onSignup }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease both",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
          borderRadius: 22,
          padding: "clamp(24px,4vw,36px)",
          maxWidth: 440,
          width: "100%",
          position: "relative",
          animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "var(--ink-3)",
            padding: 4,
            borderRadius: 7,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-3)")}
        >
          <X size={18} />
        </button>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            margin: "0 auto 20px",
            background:
              "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(45,212,191,0.1))",
            border: "1px solid rgba(34,197,94,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lock size={22} color="var(--green)" />
        </div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Unlock your full reply
        </h3>
        <p
          style={{
            fontSize: 14.5,
            color: "var(--ink-3)",
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Create a free account to get all 4 reply variants, tone analysis, and
          one-click copy — free for 7 days.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
            marginBottom: 24,
          }}
        >
          {[
            "5 free replies every day",
            "Tone, risk & intent analysis",
            "4 styles — Balanced, Firm, Warm, Delay",
            "Share insight cards",
          ].map((p) => (
            <div
              key={p}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: "var(--green-pale)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="var(--green)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{p}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onSignup}
          className="btn-green"
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 12,
            fontSize: 15,
            marginBottom: 10,
          }}
        >
          Start Free — No card needed
        </button>
        <p style={{ fontSize: 12, color: "var(--ink-4)", textAlign: "center" }}>
          7-day trial · Cancel anytime
        </p>
      </div>
    </div>
  );
}

/* ── Try It Section ── */
function TryItSection({ onSignup }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: subscription } = useMySubscription();
  const [msg, setMsg] = useState("");

  // Get character limit from backend (reply_generator) or fallback to 600
  const charLimit = user
    ? subscription?.character_limits?.reply_generator || 2000
    : 600;

  const handleGenerate = () => {
    if (!msg.trim()) return;

    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/tool/reply-generator", { state: { message: msg } });
  };

  return (
    <section
      id="try"
      style={{ padding: "clamp(64px,8vw,96px) 0", background: "var(--bg2)" }}
    >
      <div className="container">
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(32px,4vw,48px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 16px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.22)",
              marginBottom: 18,
            }}
          >
            <Sparkles size={13} color="var(--green)" />
            <span
              style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}
            >
              Try it right now — free
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(28px,4.5vw,52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: 14,
            }}
          >
            Paste any message.
            <br />
            Get an instant read.
          </h2>
          <p
            style={{
              fontSize: "clamp(14px,1.8vw,17px)",
              color: "var(--ink-3)",
              lineHeight: 1.65,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Drop in an email, text, or DM you've been hesitating on. We'll break
            down the tone, risk, and intent in seconds — completely free.
          </p>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            style={{
              background: "var(--surface)",
              border: "2px solid var(--border2)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 20px 80px rgba(0,0,0,0.22)",
            }}
          >
            <div
              style={{
                padding: "18px 24px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--green)",
                    boxShadow: "0 0 8px var(--green)",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--ink-2)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Paste the message you received
                </span>
              </div>
              {msg && (
                <button
                  onClick={() => setMsg("")}
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--ink-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--ink-4)")
                  }
                >
                  Clear ✕
                </button>
              )}
            </div>
            <textarea
              value={msg}
              onChange={(e) => {
                if (e.target.value.length <= charLimit) {
                  setMsg(e.target.value);
                }
              }}
              placeholder={
                "e.g. \"Why haven't you responded? I need this today.\"\n\nAny email, text, or DM you're unsure how to reply to…"
              }
              rows={7}
              style={{
                width: "100%",
                padding: "16px 24px 12px",
                fontSize: "clamp(15px,1.9vw,17px)",
                lineHeight: 1.7,
                color: "var(--ink)",
                background: "transparent",
                border: "none",
                caretColor: "var(--green)",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                padding: "10px 20px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    height: 4,
                    width: 100,
                    borderRadius: 2,
                    background: "var(--surface3)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      width: `${(msg.length / charLimit) * 100}%`,
                      background:
                        msg.length > charLimit * 0.85
                          ? "#f59e0b"
                          : "var(--green)",
                      transition: "width .2s, background .3s",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4)",
                    fontFamily: "monospace",
                  }}
                >
                  {msg.length}/{charLimit} chars
                </span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!msg.trim()}
                className="btn-green"
                style={{
                  padding: "clamp(11px,1.5vw,14px) clamp(24px,3vw,36px)",
                  borderRadius: 12,
                  fontSize: "clamp(14px,1.6vw,16px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: !msg.trim() ? 0.45 : 1,
                  cursor: !msg.trim() ? "not-allowed" : "pointer",
                }}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroDemo({ onSignup }) {
  const [demoIdx, setDemoIdx] = useState(0);
  const [phase, setPhase] = useState(PHASE.IDLE);
  const demo = DEMOS[demoIdx];

  useEffect(() => {
    const t = setTimeout(() => setPhase(PHASE.TYPING), 900);
    return () => clearTimeout(t);
  }, [demoIdx]);

  function onTypingDone() {
    setTimeout(() => setPhase(PHASE.ANALYZING), 300);
    setTimeout(() => setPhase(PHASE.RESULT), 2100);
  }

  function nextDemo() {
    setPhase(PHASE.IDLE);
    setTimeout(() => setDemoIdx((i) => (i + 1) % DEMOS.length), 120);
  }

  useEffect(() => {
    if (phase !== PHASE.RESULT) return;
    const t = setTimeout(nextDemo, VARIANT_DURATION * 4 + 2000);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <>
      <section
        style={{ padding: "clamp(48px,7vw,96px) 0 clamp(40px,5vw,72px)" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,360px), 1fr))",
              gap: "clamp(40px,6vw,80px)",
              alignItems: "flex-start",
            }}
          >
            {/* left column */}
            <div>
              <div
                className="anim-up d1"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(34,197,94,0.25)",
                  background: "rgba(34,197,94,0.07)",
                  marginBottom: "clamp(18px,3vw,28px)",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--green)",
                    boxShadow: "0 0 8px var(--green)",
                    animation: "glow-pulse 2s ease infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--green)",
                  }}
                >
                  Communication Intelligence Strategist
                </span>
              </div>
              <h1
                className="anim-up d2"
                style={{
                  fontSize: "clamp(38px,6vw,74px)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.0,
                  marginBottom: "clamp(16px,2.5vw,24px)",
                }}
              >
                Craft the perfect reply for
                <span className="grad-text"> every conversation.</span>
              </h1>
              <div
                className="anim-up d3"
                style={{ marginBottom: "clamp(12px,2vw,20px)" }}
              >
                {[
                  "Paste the message.",
                  "See what it means.",
                  "Send the right reply.",
                ].map((l) => (
                  <p
                    key={l}
                    style={{
                      fontSize: "clamp(15px,2vw,17px)",
                      color: "var(--ink-2)",
                      lineHeight: 2.05,
                      fontWeight: 400,
                    }}
                  >
                    {l}
                  </p>
                ))}
              </div>
              <p
                className="anim-up d4"
                style={{
                  fontSize: "clamp(13.5px,1.6vw,15px)",
                  color: "var(--ink-3)",
                  lineHeight: 1.7,
                  maxWidth: 420,
                  marginBottom: "clamp(24px,4vw,40px)",
                }}
              >
                Whether it's a sales pitch, professional email or text, or
                dating message, AVERTUNE helps you respond with confidence. Let
                AI do the heavy lifting.
              </p>
              <div
                className="anim-up d5"
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: "clamp(18px,3vw,28px)",
                }}
              >
                <button
                  onClick={onSignup}
                  className="btn-green"
                  style={{
                    padding: "clamp(11px,1.5vw,13px) clamp(20px,3vw,28px)",
                    borderRadius: 12,
                    fontSize: "clamp(13px,1.5vw,15px)",
                  }}
                >
                  Start Free Trial
                </button>
                <a href="#try" style={{ textDecoration: "none" }}>
                  <button
                    className="btn-ghost"
                    style={{
                      padding: "clamp(11px,1.5vw,13px) clamp(18px,2.5vw,24px)",
                      borderRadius: 12,
                      fontSize: "clamp(13px,1.5vw,15px)",
                    }}
                  >
                    Try it live ↓
                  </button>
                </a>
              </div>
              <div
                className="anim-up d6"
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ display: "flex" }}>
                  {["#22c55e", "#38bdf8", "#2dd4bf", "#16a34a", "#0ea5e9"].map(
                    (c, i) => (
                      <div
                        key={i}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          border: "2px solid var(--bg)",
                          background: c,
                          marginLeft: i > 0 ? -8 : 0,
                        }}
                      />
                    ),
                  )}
                </div>
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
                  <strong style={{ color: "var(--ink)", fontWeight: 700 }}>
                    12,000+
                  </strong>{" "}
                  professionals trust Avertune
                </span>
              </div>
            </div>

            {/* right column – DemoCard container with fixed min-height */}
            <div
              style={{
                position: "relative",
                minWidth: 0,
                width: "100%",
                height: 670, // fixed height – left column never moves
                background:
                  "linear-gradient(145deg, var(--surface) 0%, var(--surface2) 100%)",
                borderRadius: 28,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 32px rgba(0,0,0,0.1)",
                padding: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Card container – vertically centered */}
              <div
                style={{
                  width: "100%",
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                <DemoCard
                  demo={demo}
                  phase={phase}
                  onTypingDone={onTypingDone}
                />
              </div>

              {/* Dots always at the same fixed distance from the bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 28, // consistent gap from container bottom
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {DEMOS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === demoIdx ? 22 : 6,
                      height: 6,
                      borderRadius: 3,
                      background:
                        i === demoIdx ? "var(--green)" : "var(--surface3)",
                      transition: "width 0.3s, background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <TryItSection onSignup={onSignup} />
    </>
  );
}
