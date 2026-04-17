import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import {
  useCheckout,
  usePlans,
  usePacks,
  useBuyPack,
} from "../lib/useSubscription";
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
import { trackEvent } from "../lib/analytics.js";

const FAQS = [
  {
    q: "Is the free trial really free?",
    a: "Yes — no credit card required. You get 7 full days of access.",
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
  const getIcon = () => {
    if (plan.tier === "starter") return MessageSquare;
    if (plan.tier === "daily") return Briefcase;
    return Battery;
  };
  const Icon = getIcon();
  const isPopular = plan.most_popular === true;
  const isWeekly = billing === "weekly";
  const isYearly = billing === "annual";
  const weeklyAvailable = plan.weekly_available === true;

  const showWeekly = isWeekly && weeklyAvailable && plan.prices?.weekly != null;
  const price = showWeekly
    ? plan.prices.weekly
    : isYearly
      ? plan.prices.yearly
      : plan.prices.monthly;
  const priceUnit = showWeekly ? "/ week" : isYearly ? "/ year" : "/ month";

  const repliesNote = `${plan.monthly_limit} replies/month (~${plan.daily_typical}/day typical use)`;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `${isPopular ? "2px" : "1px"} solid ${isPopular ? "#2dd4bf" : "var(--border)"}`,
        borderRadius: 20,
        padding: "clamp(22px,3vw,28px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: isPopular
          ? `0 0 0 1px #2dd4bf20, 0 12px 40px rgba(0,0,0,0.15)`
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
          ? `0 0 0 1px #2dd4bf20, 0 12px 40px rgba(0,0,0,0.15)`
          : "none";
      }}
    >
      {isPopular && (
        <div
          style={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 16px",
            borderRadius: 20,
            background: "#2dd4bf",
            color: "#000",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}

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
            background: isPopular ? "#2dd4bf18" : "var(--surface2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={isPopular ? "#2dd4bf" : "var(--ink-3)"} />
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
          }}
        >
          {plan.display_name}
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
        <em>{plan.tagline}</em>
      </p>

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
        {showWeekly && (
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#2dd4bf",
              marginTop: 6,
            }}
          >
            {Math.round((plan.monthly_limit / 30) * 7)} replies / week
          </p>
        )}
        {!showWeekly && !isYearly && plan.prices.yearly && (
          <p
            style={{
              fontSize: 12,
              color: isPopular ? "#2dd4bf" : "var(--ink-4)",
              marginTop: 3,
            }}
          >
            or ${plan.prices.yearly}/year (save 2 months)
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
      </div>

      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: isPopular ? "#2dd4bf" : "var(--ink)",
          marginBottom: 6,
        }}
      >
        {repliesNote.split("(")[0].trim()}
      </p>
      <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 14 }}>
        ({repliesNote.split("(")[1]?.replace(")", "") || ""})
      </p>

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
        {plan.description}
      </p>

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
        {plan.features.map((f, idx) => (
          <li
            key={idx}
            style={{ display: "flex", alignItems: "flex-start", gap: 9 }}
          >
            <div
              style={{
                width: 17,
                height: 17,
                borderRadius: 5,
                flexShrink: 0,
                marginTop: 1,
                background: `${isPopular ? "#2dd4bf" : "var(--green)"}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check
                size={10}
                color={isPopular ? "#2dd4bf" : "var(--green)"}
                strokeWidth={2.5}
              />
            </div>
            <span
              style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.45 }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

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
        {plan.best_for}
      </p>

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
          ...(plan.tier === "daily"
            ? { background: "#2dd4bf", color: "#000", border: "none" }
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
        ) : plan.tier === "starter" ? (
          "Start with Starter"
        ) : plan.tier === "daily" ? (
          "Upgrade to Daily"
        ) : (
          "Get Pro"
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
  const { isAuthenticated, authLoading } = useAuth();
  const toast = useToast();
  const checkoutMutation = useCheckout();
  const { data: plansData, isLoading: plansLoading } = usePlans();
  const { data: packsData, isLoading: packsLoading } = usePacks();
  const buyPackMutation = useBuyPack();
  const [billing, setBilling] = useState("monthly");
  const [activePlanId, setActivePlanId] = useState(null);
  const [buyingPackId, setBuyingPackId] = useState(null);

  const onBack = () => navigate(-1);

  const PLANS = plansData?.plans || [];
  const comparison = plansData?.comparison || null;
  const PACKS = packsData?.packs || [];

  async function handleCheckout(plan, billingPeriod) {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    if (plan.tier === "free") {
      navigate("/dashboard");
      return;
    }

    let period = billingPeriod;
    if (period === "annual") period = "yearly";
    trackEvent("upgrade_click", {
      plan: plan.tier,
      billing_period: period,
      price: plan.prices?.[period === "yearly" ? "yearly" : "monthly"],
    });

    setActivePlanId(plan.tier);
    try {
      await checkoutMutation.mutateAsync({
        plan: plan.tier,
        billing_period: period,
      });
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setActivePlanId(null);
    }
  }

  async function handleBuyPack(packId) {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    trackEvent("buy_pack", {
      pack_id: packId,
      replies: pack?.replies,
      price: pack?.price,
    });
    setBuyingPackId(packId);
    try {
      await buyPackMutation.mutateAsync(packId);
    } catch (err) {
      toast.error(err.message || "Purchase failed");
    } finally {
      setBuyingPackId(null);
    }
  }

  const checkingOut = (planId) => activePlanId === planId;

  if (authLoading || plansLoading || packsLoading) {
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
            style={{
              display: "flex",
              alignItems: "center",
              height: 60,
              gap: 12,
            }}
          >
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "var(--ink-3)",
                fontSize: 13,
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <div
              style={{ width: 1, height: 20, background: "var(--border)" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div></div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>
                Avertune<sup>TM</sup>
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
          style={{ padding: "clamp(40px,6vw,72px)", textAlign: "center" }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: "var(--surface2)",
              margin: "0 auto 20px",
              animation: "pulse 1s infinite",
            }}
          />
          <p style={{ color: "var(--ink-3)" }}>Loading plans...</p>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      </div>
    );
  }

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
            <span style={{ fontWeight: 800, fontSize: 15 }}>
              Avertune<sup>TM</sup>
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

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 6,
              padding: "4px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
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
              key={plan.tier}
              plan={plan}
              billing={billing}
              onCheckout={handleCheckout}
              checkingOut={checkingOut(plan.tier)}
            />
          ))}
        </div>

        {/* Plan Comparison Table */}
        {comparison && comparison.rows && comparison.rows.length > 0 && (
          <div style={{ marginBottom: "clamp(56px,8vw,88px)" }}>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,44px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Compare plans
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "var(--ink-3)",
                marginBottom: 32,
              }}
            >
              Find the perfect fit for your communication needs
            </p>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "var(--surface)",
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: "var(--surface2)",
                    }}
                  >
                    {comparison.headers.map((header, idx) => (
                      <th
                        key={idx}
                        style={{
                          padding: "16px 20px",
                          textAlign: "left",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--ink)",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      style={{
                        borderBottom:
                          rowIdx < comparison.rows.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          style={{
                            padding: "14px 20px",
                            fontSize: 13.5,
                            color:
                              cellIdx === 0 ? "var(--ink)" : "var(--ink-2)",
                            fontWeight: cellIdx === 0 ? 600 : 400,
                          }}
                        >
                          {cell === "✓" ? (
                            <Check size={14} color="var(--green)" />
                          ) : cell === "—" ? (
                            "—"
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reply Packs (Top-ups) */}
        {PACKS && PACKS.length > 0 && (
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
                  "repeat(auto-fit, minmax(min(100%,220px),1fr))",
                gap: 14,
                maxWidth: 720,
                margin: "0 auto",
              }}
            >
              {PACKS.map((pack) => (
                <div
                  key={pack.id}
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
                    +{" "}
                    {pack.replies?.toLocaleString() ||
                      pack.credits?.toLocaleString()}
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
                    ${pack.price}
                  </p>
                  <button
                    onClick={() => handleBuyPack(pack.id)}
                    disabled={buyingPackId === pack.id}
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
                      cursor: buyingPackId === pack.id ? "wait" : "pointer",
                      transition: "all .15s",
                      opacity: buyingPackId === pack.id ? 0.7 : 1,
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
                    {buyingPackId === pack.id ? "Redirecting..." : "Buy Pack"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
