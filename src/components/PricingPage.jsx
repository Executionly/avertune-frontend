import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useCheckout } from "../lib/useSubscription";
import { useToast } from "../lib/Toast.jsx";
import {
  ArrowLeft,
  Check,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Briefcase,
  Battery,
} from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: MessageSquare,
    desc: "For occasional messages",
    bestFor:
      "Students, early professionals, and occasional high-stakes messages.",
    weeklyPrice: null,
    monthlyPrice: 7.99,
    yearlyPrice: 79,
    yearlyNote: "or $79/year (save 2 months)",
    color: "var(--ink-2)",
    border: "var(--border)",
    badge: null,
    cta: "Start with Starter",
    ctaStyle: "ghost",
    repliesNote: "300 replies/month (~10/day typical use)",
    tagline:
      "Affordable support for everyday professional replies when you don't want to get it wrong.",
    weeklyNote: null,
    features: [
      { text: "300 replies/month (~10/day)", included: true },
      { text: "Core conversation pack", included: true },
      { text: "Tone insights included", included: true },
      { text: "Share receipts (watermarked)", included: true },
    ],
  },
  {
    id: "daily",
    name: "Daily",
    icon: Briefcase,
    desc: "For professionals who communicate every day",
    bestFor:
      "Sales conversations, customer support, work situations, and dating.",
    weeklyPrice: 5.99,
    monthlyPrice: 14.99,
    yearlyPrice: 149,
    yearlyNote: "or $149/year (save 2 months)",
    color: "#2dd4bf",
    border: "#2dd4bf",
    badge: "Most Popular",
    cta: "Upgrade to Daily",
    ctaStyle: "teal",
    repliesNote: "900 replies/month (~30/day typical use)",
    tagline:
      "Built for high-stakes conversations where tone, clarity, and outcome matter.",
    weeklyNote: "Weekly Pass · billed every 7 days · 210 replies/week",
    features: [
      { text: "900 replies/month (~30/day)", included: true },
      { text: "All conversation packs", included: true },
      { text: "Tone insights and strategy analysis", included: true },
      { text: "Share receipts (watermarked)", included: true },
      { text: "Regional tone selector", included: true },
      { text: "Saved replies", included: true },
      {
        text: "All 6 packs: Core Professional, Sales, Customer Support, Work / Corporate, Personal, Dating",
        included: true,
      },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Battery,
    desc: "For operators, founders, and teams",
    bestFor:
      "Operators, founders, agency owners, executives and revenue leaders.",
    weeklyPrice: null,
    monthlyPrice: 24.99,
    yearlyPrice: 249,
    yearlyNote: "or $249/year (save 2 months)",
    color: "var(--ink-2)",
    border: "var(--border)",
    badge: null,
    cta: "Get Pro",
    ctaStyle: "ghost",
    repliesNote: "2,000 replies/month (~60/day typical use)",
    tagline:
      "Advanced protection for high-stakes communication that drives results.",
    weeklyNote: null,
    features: [
      { text: "2,000 replies/month (~60/day)", included: true },
      { text: "Everything in Daily", included: true },
      { text: "Advanced negotiation presets", included: true },
      { text: "Escalation sequences", included: true },
      { text: "Priority response generation", included: true },
      { text: "Share Receipts (no watermark)", included: true },
    ],
  },
];

const TOPUPS = [
  { replies: 200, price: 4.99 },
  { replies: 500, price: 9.99 },
  { replies: 1000, price: 17.99 },
];

const FAQS = [
  {
    q: "Is the free trial really free?",
    a: "Yes — no credit card required. You get 7 full days of access. After the trial, you're automatically moved to the free plan unless you choose to upgrade.",
  },
  {
    q: "What is the Weekly Pass?",
    a: "The Weekly Pass is available on the Daily plan only. At $5.99/week billed every 7 days (210 replies/week), it's great for trying the Daily plan. Most weekly users switch to monthly once they feel the difference.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel from your account settings at any time. You keep access until the end of your billing period — no questions asked.",
  },
  {
    q: "What are reply top-ups?",
    a: "If you run out of replies before the month ends, you can buy extra reply packs — 200, 500, or 1,000 replies. They're one-time purchases that don't expire within your billing cycle.",
  },
  {
    q: "Do unused replies carry over?",
    a: "Reply limits reset each month. Unused replies don't carry over, but top-up packs are valid for the rest of your billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards via Stripe. Annual plans are also available for a discounted rate.",
  },
];

function PlanCard({ plan, billing, onCheckout, checkingOut }) {
  const Icon = plan.icon;
  const isPopular = plan.badge === "Most Popular";
  const isWeekly = billing === "weekly";
  const isYearly = billing === "annual";

  const showWeekly = isWeekly && plan.weeklyPrice !== null;
  const price = showWeekly
    ? plan.weeklyPrice
    : isYearly
      ? plan.yearlyPrice
      : plan.monthlyPrice;
  const priceUnit = showWeekly ? "/ week" : isYearly ? "/ year" : "/ month";

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `${isPopular ? "2px" : "1px"} solid ${isPopular ? plan.border : "var(--border)"}`,
        borderRadius: 20,
        padding: "clamp(22px,3vw,28px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: isPopular
          ? `0 0 0 1px ${plan.color}20, 0 12px 40px rgba(0,0,0,0.15)`
          : "none",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 20px 56px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isPopular
          ? `0 0 0 1px ${plan.color}20, 0 12px 40px rgba(0,0,0,0.15)`
          : "none";
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          style={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 16px",
            borderRadius: 20,
            background: plan.color,
            color: "#000",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: isPopular ? `${plan.color}18` : "var(--surface2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={isPopular ? plan.color : "var(--ink-3)"} />
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
          }}
        >
          {plan.name}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--ink-3)",
          lineHeight: 1.45,
          marginBottom: 20,
        }}
      >
        <em>{plan.desc}</em>
      </p>

      {/* Price */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontSize: 13,
              color: "var(--ink-3)",
              alignSelf: "flex-start",
              marginTop: 8,
            }}
          >
            $
          </span>
          <span
            style={{
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: "var(--ink)",
            }}
          >
            {price}
          </span>
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
            {priceUnit}
          </span>
        </div>
        {showWeekly && plan.weeklyNote && (
          <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
            {plan.weeklyNote}
          </p>
        )}
        {showWeekly && (
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2dd4bf",
              marginTop: 6,
            }}
          >
            210 replies / week
          </p>
        )}
        {!showWeekly && !isYearly && plan.yearlyNote && (
          <p
            style={{
              fontSize: 12,
              color: isPopular ? plan.color : "var(--ink-4)",
              marginTop: 3,
            }}
          >
            {plan.yearlyNote}
          </p>
        )}
        {isYearly && (
          <p
            style={{
              fontSize: 12,
              color: "var(--green)",
              fontWeight: 600,
              marginTop: 3,
            }}
          >
            Save 2 months · Pay for 10, get 12
          </p>
        )}
        {isWeekly && !plan.weeklyPrice && (
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-4)",
              fontStyle: "italic",
              marginTop: 3,
            }}
          >
            Weekly billing available on Daily plan only.
          </p>
        )}
      </div>

      {/* Replies highlight */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: isPopular ? plan.color : "var(--ink)",
          marginBottom: 6,
        }}
      >
        {plan.repliesNote.split("(")[0].trim()}
      </p>
      <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 14 }}>
        ({plan.repliesNote.split("(")[1]?.replace(")", "") || ""})
      </p>

      {/* Tagline */}
      <p
        style={{
          fontSize: 13.5,
          color: "var(--ink-3)",
          lineHeight: 1.6,
          marginBottom: 20,
          paddingBottom: 18,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {plan.tagline}
      </p>

      {/* Features */}
      <p
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: "var(--ink-4)",
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          marginBottom: 10,
        }}
      >
        Includes
      </p>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        {plan.features.map((f) => (
          <li
            key={f.text}
            style={{ display: "flex", alignItems: "flex-start", gap: 9 }}
          >
            <div
              style={{
                width: 17,
                height: 17,
                borderRadius: 5,
                flexShrink: 0,
                marginTop: 1,
                background: `${isPopular ? plan.color : "var(--green)"}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check
                size={10}
                color={isPopular ? plan.color : "var(--green)"}
                strokeWidth={2.5}
              />
            </div>
            <span
              style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.45 }}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Best for */}
      <p
        style={{
          fontSize: 12,
          color: "var(--ink-3)",
          marginTop: 16,
          marginBottom: 18,
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: "var(--ink-2)" }}>Best for:</strong>{" "}
        {plan.bestFor}
      </p>

      {/* CTA */}
      <button
        onClick={() => onCheckout(plan, billing)}
        disabled={checkingOut}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 11,
          fontSize: 14.5,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: checkingOut ? "wait" : "pointer",
          transition: "opacity .15s, transform .12s",
          opacity: checkingOut ? 0.7 : 1,
          ...(plan.ctaStyle === "teal"
            ? {
                background: plan.color,
                color: "#000",
                border: "none",
              }
            : {
                background: "transparent",
                color: "var(--ink-2)",
                border: "1.5px solid var(--border2)",
              }),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.85";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {checkingOut ? (
          <>
            <div
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(0,0,0,0.25)",
                borderTopColor: "#000",
                borderRadius: "50%",
                animation: "spin .7s linear infinite",
              }}
            />
            Redirecting...
          </>
        ) : (
          plan.cta
        )}
      </button>
    </div>
  );
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `1px solid ${open ? "rgba(45,212,191,0.25)" : "var(--border)"}`,
        borderRadius: 14,
        background: open ? "rgba(45,212,191,0.03)" : "var(--surface)",
        overflow: "hidden",
        transition: "border-color .2s",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: "none",
          border: "none",
          fontFamily: "inherit",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: "-0.015em",
            lineHeight: 1.4,
          }}
        >
          {item.q}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: open ? "#2dd4bf" : "var(--surface2)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .2s",
          }}
        >
          {open ? (
            <ChevronUp size={13} color="#000" strokeWidth={2.5} />
          ) : (
            <ChevronDown size={13} color="var(--ink-3)" strokeWidth={2.5} />
          )}
        </div>
      </button>
      {open && (
        <div style={{ padding: "0 20px 18px", animation: "fadeIn 0.2s ease" }}>
          <p style={{ fontSize: 14.5, color: "var(--ink-3)", lineHeight: 1.7 }}>
            {item.a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const checkoutMutation = useCheckout();
  const [billing, setBilling] = useState("monthly");
  const [activePlanId, setActivePlanId] = useState(null);

  const onBack = () => navigate(-1);

  async function handleCheckout(plan, billingPeriod) {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    if (plan.id === "free") {
      navigate("/dashboard");
      return;
    }

    setActivePlanId(plan.id);
    try {
      await checkoutMutation.mutateAsync({
        plan: plan.id,
        billing_period: billingPeriod,
      });
      // The mutation will redirect to the payment URL
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setActivePlanId(null);
    }
  }

  const checkingOut = (planId) => activePlanId === planId;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", height: 60, gap: 12 }}
        >
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "var(--ink-3)",
              fontSize: 13,
              transition: "color .15s",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg,var(--green),var(--teal))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"
                  stroke="#000"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
              }}
            >
              Avertune
            </span>
          </div>
          <span style={{ fontSize: 13, color: "var(--ink-4)" }}>/</span>
          <span
            style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}
          >
            Pricing
          </span>
        </div>
      </header>

      <div
        className="container"
        style={{ paddingTop: "clamp(40px,6vw,72px)", paddingBottom: 80 }}
      >
        {/* Hero */}
        <div
          style={{ textAlign: "center", marginBottom: "clamp(36px,5vw,56px)" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(45,212,191,0.08)",
              border: "1px solid rgba(45,212,191,0.2)",
              marginBottom: 18,
            }}
          >
            <Star size={12} color="#2dd4bf" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2dd4bf" }}>
              Start with a 7-day free trial. No credit card required.
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px,5vw,52px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              marginBottom: 14,
            }}
          >
            Choose how often you want
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#2dd4bf,var(--green))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Avertune on your side.
            </span>
          </h1>

          {/* Billing toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              gap: 2,
              marginTop: 8,
            }}
          >
            {[
              { id: "weekly", label: "Weekly" },
              { id: "monthly", label: "Monthly" },
              { id: "annual", label: "Annual (Save 2 months)" },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBilling(b.id)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 9,
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 13.5,
                  border: "none",
                  cursor: "pointer",
                  background:
                    billing === b.id ? "var(--surface2)" : "transparent",
                  color: billing === b.id ? "var(--ink)" : "var(--ink-3)",
                  transition: "all .15s",
                  boxShadow:
                    billing === b.id ? "0 1px 6px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
          {billing === "weekly" && (
            <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 10 }}>
              Weekly Pass — available for Daily plan only. Billed every 7 days.
            </p>
          )}
          {billing === "annual" && (
            <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 10 }}>
              Pay for 10 months, get 12. Lock in your rate.
            </p>
          )}
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))",
            gap: 16,
            marginBottom: "clamp(56px,8vw,88px)",
            alignItems: "start",
          }}
        >
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              onCheckout={handleCheckout}
              checkingOut={checkingOut(plan.id)}
            />
          ))}
        </div>

        {/* Top-up packs */}
        <div style={{ marginBottom: "clamp(56px,8vw,88px)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2
              style={{
                fontSize: "clamp(22px,3.5vw,32px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            >
              Need more replies?
            </h2>
            <p style={{ fontSize: 14.5, color: "var(--ink-3)" }}>
              Buy extra reply packs when you run out early.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,220px),1fr))",
              gap: 14,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {TOPUPS.map((t) => (
              <div
                key={t.replies}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "24px 20px",
                  textAlign: "center",
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--teal)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2dd4bf",
                    marginBottom: 4,
                  }}
                >
                  + {t.replies.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-3)",
                    marginBottom: 14,
                  }}
                >
                  replies
                </p>
                <p
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    marginBottom: 16,
                  }}
                >
                  ${t.price}
                </p>
                <button
                  onClick={() =>
                    !isAuthenticated
                      ? navigate("/signup")
                      : toast.info(
                          "Top-up packs coming soon — complete your plan upgrade first.",
                        )
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 600,
                    background: "transparent",
                    color: "var(--ink-2)",
                    border: "1.5px solid var(--border2)",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2dd4bf";
                    e.currentTarget.style.color = "#2dd4bf";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border2)";
                    e.currentTarget.style.color = "var(--ink-2)";
                  }}
                >
                  Buy Pack
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(22px,4vw,36px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Common Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((f) => (
              <FAQItem key={f.q} item={f} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
