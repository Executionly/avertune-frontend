import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMySubscription, getPlanLabel } from "../lib/useSubscription.js";
import {
  MessageSquare,
  Activity,
  ShieldCheck,
  Swords,
  Clock,
  Zap,
  Menu,
  BarChart2,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";

const TOOLS = [
  {
    icon: MessageSquare,
    slug: "reply-generator",
    label: "Reply Generator",
    desc: "Generate calm strategic replies",
    color: "var(--green)",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  {
    icon: Activity,
    slug: "tone-checker",
    label: "Tone Checker",
    desc: "Read emotional tone instantly",
    color: "var(--teal)",
    bg: "rgba(45,212,191,0.08)",
    border: "rgba(45,212,191,0.2)",
  },
  {
    icon: ShieldCheck,
    slug: "boundary-builder",
    label: "Boundary Builder",
    desc: "Set firm respectful limits",
    color: "var(--green)",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
  {
    icon: Swords,
    slug: "negotiation-reply",
    label: "Sales & Negotiation",
    desc: "Hold position under pressure",
    color: "var(--teal)",
    bg: "rgba(45,212,191,0.08)",
    border: "rgba(45,212,191,0.2)",
  },
  {
    icon: Clock,
    slug: "follow-up-writer",
    label: "Follow-Up Writer",
    desc: "Follow-ups that get responses",
    color: "var(--blue)",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
  },
  {
    icon: Clock,
    slug: "difficult-email",
    label: "Difficult Email",
    desc: "Rewrite sensitive emails safely",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: Clock,
    slug: "intent-detector",
    label: "Intent Detector",
    desc: "Decode hidden meaning in messages",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
  },
];

export default function Dashboard() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: subscription } = useMySubscription();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) return null;
  if (!user) {
    navigate("/");
    return null;
  }

  const displayName = user.full_name || user.email?.split("@")[0] || "User";
  const displayPlan = getPlanLabel(subscription?.plan_tier || user.plan_tier);
  const usageToday = user.usage_today ?? 0;
  const limitToday = user.limit_today ?? 5;
  const repliesRemaining = user.replies_remaining ?? limitToday - usageToday;
  const usagePct =
    limitToday > 0 ? Math.min((usageToday / limitToday) * 100, 100) : 0;

  const STATS = [
    {
      label: "Replies used today",
      value: String(usageToday),
      icon: MessageSquare,
      color: "var(--green)",
      delta: null,
    },
    {
      label: "Replies left today",
      value: String(repliesRemaining),
      icon: BarChart2,
      color: "#a78bfa",
      delta: displayPlan,
    },
    {
      label: "Daily limit",
      value: String(limitToday),
      icon: Zap,
      color: "var(--teal)",
      delta: null,
    },
  ];

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* ── Main content ── */}
      <main
        className="main-content"
        style={{
          flex: 1,
          marginLeft: 240,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              padding: "0 clamp(16px,3vw,32px)",
              display: "flex",
              alignItems: "center",
              height: 60,
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Mobile menu btn */}
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  color: "var(--ink-2)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "none",
                }}
                className="mobile-menu-btn"
              >
                <style>{`.mobile-menu-btn { display: none !important; } @media (max-width: 900px) { .mobile-menu-btn { display: flex !important; } }`}</style>
                <Menu size={21} />
              </button>
              <div>
                <h1
                  style={{
                    fontSize: "clamp(16px,2.5vw,20px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                    lineHeight: 1.1,
                  }}
                >
                  Dashboard
                </h1>
                <p
                  style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}
                >
                  Good to see you, {displayName} 👋
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/tool/reply-generator")}
              className="btn-green"
              style={{
                padding: "8px 18px",
                borderRadius: 9,
                fontSize: 13.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Zap size={13} /> New reply
            </button>
          </div>
        </header>

        <div style={{ padding: "clamp(20px,3vw,36px)", flex: 1 }}>
          {/* Stats row */}
          <div
            className="dashboard-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,180px),1fr))",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  style={{
                    padding: "18px 20px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: `${s.color}12`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={14} color={s.color} strokeWidth={1.8} />
                    </div>
                    {s.delta && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--green)",
                          background: "rgba(34,197,94,0.08)",
                          padding: "2px 7px",
                          borderRadius: 20,
                        }}
                      >
                        {s.delta}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(24px,3vw,30px)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: s.color,
                      marginBottom: 3,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tools grid */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Your tools
              </h2>
              <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                {TOOLS.length} available
              </span>
            </div>
            <div
              className="dashboard-tools-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.slug}
                    onClick={() => navigate(`/tool/${t.slug}`)}
                    style={{
                      padding: "16px",
                      borderRadius: 14,
                      background: "var(--surface)",
                      border: `1px solid var(--border)`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
                      textAlign: "left",
                      cursor: "pointer",
                      transition:
                        "border-color .2s, transform .18s, box-shadow .18s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = t.color;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.13)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: t.bg,
                        border: `1px solid ${t.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={15} color={t.color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--ink)",
                          marginBottom: 3,
                        }}
                      >
                        {t.label}
                      </p>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: "var(--ink-3)",
                          lineHeight: 1.45,
                        }}
                      >
                        {t.desc}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: t.color,
                        fontSize: 11.5,
                        fontWeight: 600,
                      }}
                    >
                      Open <ArrowUpRight size={11} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Usage bar */}
          <div
            style={{
              width: "100%",
              padding: "18px 20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              marginTop: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700 }}>Daily usage</p>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {usageToday} / {limitToday} replies used
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--surface3)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${usagePct}%`,
                  background: "linear-gradient(90deg,var(--green),var(--teal))",
                  borderRadius: 3,
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}>
              Resets at midnight UTC · {displayPlan} plan
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 560px) {
          .dashboard-stats-grid,
          .dashboard-tools-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
