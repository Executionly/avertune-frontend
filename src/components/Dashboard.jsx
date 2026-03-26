import { useState } from "react";
import {
  MessageSquare,
  Activity,
  ShieldCheck,
  Swords,
  Clock,
  ChevronRight,
  Star,
  TrendingUp,
  Zap,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  BarChart2,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";

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
    label: "Negotiation Reply",
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

// STATS is now built dynamically inside the component from real user data

const RECENT = [
  {
    q: '"You said this would be done by Friday."',
    tool: "Reply Generator",
    tone: "Accusatory",
    time: "2h ago",
    variant: "Balanced",
  },
  {
    q: '"We need better performance from your team."',
    tool: "Tone Checker",
    tone: "Critical",
    time: "Yesterday",
    variant: "Firm",
  },
  {
    q: '"Why wasn\'t I included in this decision?"',
    tool: "Boundary Builder",
    tone: "Hurt",
    time: "2d ago",
    variant: "Warm",
  },
];

export default function Dashboard({ onBack, onTool, onPricing }) {
  const { user, authLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) return null;
  if (!user) { onBack?.(); return null; }

  const displayName = user.full_name || user.email?.split('@')[0] || 'User';
  const displayInitial = displayName[0].toUpperCase();
  const displayPlan = user.plan_tier
    ? user.plan_tier.charAt(0).toUpperCase() + user.plan_tier.slice(1)
    : 'Free';
  const usageToday = user.usage_today ?? 0;
  const limitToday = user.limit_today ?? 5;
  const repliesRemaining = user.replies_remaining ?? limitToday - usageToday;
  const trialDaysLeft = user.trial_days_left ?? null;
  const usagePct = limitToday > 0 ? Math.min((usageToday / limitToday) * 100, 100) : 0;

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
    {
      label: trialDaysLeft !== null ? "Trial days left" : "Plan",
      value: trialDaysLeft !== null ? String(trialDaysLeft) : displayPlan,
      icon: TrendingUp,
      color: "var(--blue)",
      delta: trialDaysLeft !== null ? "trial" : null,
    },
  ];

  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: "linear-gradient(135deg,var(--green),var(--teal))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
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
          fontSize: 16,
          letterSpacing: "-0.03em",
          color: "var(--ink)",
        }}
      >
        Avertune
      </span>
    </div>
  );

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Logo />
      </div>

      {/* User */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg,var(--green),var(--teal))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, color: "#000" }}>
            {displayInitial}
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "var(--ink)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </p>
          <p style={{ fontSize: 11.5, color: "var(--green)", fontWeight: 600 }}>
            {displayPlan} plan
          </p>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "12px 10px" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            marginBottom: 6,
            paddingLeft: 8,
          }}
        >
          Navigation
        </p>
        {[
          {
            icon: Home,
            label: "Dashboard",
            active: true,
            action: () => setSidebarOpen(false),
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 9,
                marginBottom: 2,
                background: item.active ? "var(--surface2)" : "transparent",
                color: item.active ? "var(--ink)" : "var(--ink-3)",
                fontFamily: "inherit",
                fontWeight: item.active ? 600 : 500,
                fontSize: 13.5,
                cursor: "pointer",
                textAlign: "left",
                border: "none",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = "var(--surface2)";
                  e.currentTarget.style.color = "var(--ink)";
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--ink-3)";
                }
              }}
            >
              <Icon size={15} strokeWidth={1.8} />
              {item.label}
              {item.active && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--green)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tools */}
      <div style={{ padding: "0 10px 12px", flex: 1, overflowY: "auto" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            marginBottom: 6,
            paddingLeft: 8,
          }}
        >
          Tools
        </p>
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.slug}
              onClick={() => {
                onTool?.(t.slug);
                setSidebarOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 9,
                marginBottom: 2,
                background: "transparent",
                color: "var(--ink-3)",
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                border: "none",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.bg;
                e.currentTarget.style.color = t.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--ink-3)";
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: t.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={12} color={t.color} strokeWidth={1.8} />
              </div>
              {t.label}
              <ArrowUpRight
                size={11}
                style={{ marginLeft: "auto", opacity: 0.4 }}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div
        style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={onBack}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 10px",
            borderRadius: 9,
            background: "transparent",
            color: "var(--ink-3)",
            fontFamily: "inherit",
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            border: "none",
            marginBottom: 2,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface2)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ink-3)";
          }}
        >
          <Settings size={14} /> Settings
        </button>
        <button
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 10px",
            borderRadius: 9,
            background: "transparent",
            color: "var(--ink-3)",
            fontFamily: "inherit",
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            border: "none",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.07)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ink-3)";
          }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 40,
          display: "none",
        }}
        className="dashboard-sidebar"
      >
        <style>{`.dashboard-sidebar { display: block !important; } @media (max-width: 900px) { .dashboard-sidebar { display: none !important; } .dashboard-main { margin-left: 0 !important; } }`}</style>
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}
        >
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 260,
              background: "var(--surface)",
              borderRight: "1px solid var(--border)",
              height: "100%",
              zIndex: 1,
              animation: "slideDown 0.25s ease both",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "var(--ink-3)",
                zIndex: 2,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main
        className="dashboard-main"
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
              onClick={() => onTool?.("reply-generator")}
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

          {/* One-col */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 20,
              alignItems: "start",
            }}
          >
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
                      onClick={() => onTool?.(t.slug)}
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

            {/* Right: recent + upgrade */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                width: "100%",
              }}
            >
              {/* Usage bar */}
              <div
                style={{
                  width: "100%",
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
                      background:
                        "linear-gradient(90deg,var(--green),var(--teal))",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <p
                  style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 8 }}
                >
                  Resets at midnight UTC · {displayPlan} plan
                </p>
              </div>

              {/* Recent activity */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Recent activity
                  </h2>
                  <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                    Last 7 days
                  </span>
                </div>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  {RECENT.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        borderBottom:
                          i < RECENT.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                        cursor: "pointer",
                        transition: "background .15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--surface2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: "var(--surface2)",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MessageSquare size={13} color="var(--ink-3)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 12.5,
                            color: "var(--ink)",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginBottom: 3,
                          }}
                        >
                          {r.q}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--teal)",
                              fontWeight: 600,
                            }}
                          >
                            {r.tone}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--ink-4)" }}>
                            ·
                          </span>
                          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
                            {r.tool}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--ink-4)",
                              marginLeft: "auto",
                            }}
                          >
                            {r.time}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={13}
                        color="var(--ink-4)"
                        flexShrink={0}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(45,212,191,0.06))",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <Star size={14} color="var(--green)" />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--green)",
                    }}
                  >
                    Upgrade to Pro
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    marginBottom: 14,
                  }}
                >
                  Unlimited replies, all tools, reply history, and share cards.
                </p>
                <button
                  onClick={onPricing}
                  className="btn-green"
                  style={{
                    padding: "9px 20px",
                    borderRadius: 9,
                    fontSize: 13,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  See plans →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
