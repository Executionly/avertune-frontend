import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  useMySubscription,
  getPlanLabel,
  useCancel,
} from "../lib/useSubscription";
import { useToast } from "../lib/Toast";
import { Home, LogOut, X, MoreHorizontal, Bookmark, Zap } from "lucide-react";
import { TOOL_CONFIGS } from "../toolConfigs";
import { useState } from "react";

const tools = Object.entries(TOOL_CONFIGS).map(([slug, config]) => ({
  slug,
  label: config.label,
}));

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();
  const { data: subscription } = useMySubscription();
  const cancelMutation = useCancel();

  const [billingMenuOpen, setBillingMenuOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";
  const displayInitial = displayName[0].toUpperCase();
  const planTier = subscription?.plan_tier || user?.plan_tier || "free";
  const cancelAtPeriodEnd =
    subscription?.subscription?.cancel_at_period_end || false;
  const isOnPaidPlan =
    planTier && !["free", "trial"].includes(planTier.toLowerCase());
  const isPro = planTier.toLowerCase() === "pro";
  const hasActiveSubscription = !!subscription?.subscription; // true if subscription exists

  const handleSignOut = async () => {
    await logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsOpen(false);
  };

  const handleTool = (slug) => {
    navigate(`/tool/${slug}`);
    setIsOpen(false);
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ reason: cancelReason });
      setShowCancelModal(false);
      setCancelReason("");
      toast.success("Cancelled. Access continues until end of period.");
      setBillingMenuOpen(false);
    } catch (err) {
      toast.error(
        err?.message || "Could not cancel. Try billing portal instead.",
      );
    }
  };

  return (
    <>
      {/* Overlay (only visible on mobile when sidebar is open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "block",
          }}
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        className="sidebar"
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "var(--ink-3)",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "block",
          }}
          className="sidebar-close"
        >
          <X size={20} />
        </button>

        {/* Logo – clickable to home */}
        <button
          onClick={() => {
            navigate("/");
            setIsOpen(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "linear-gradient(135deg,var(--green),var(--teal))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
        </button>

        {/* Dashboard link */}
        <div style={{ padding: "12px 10px" }}>
          <button
            onClick={handleDashboard}
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
              fontSize: 13.5,
              cursor: "pointer",
              textAlign: "left",
              border: "none",
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
            <Home size={15} strokeWidth={1.8} />
            Dashboard
          </button>
        </div>

        {/* Tools section */}
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
            Tools
          </p>
          {tools.map((tool) => (
            <button
              key={tool.slug}
              onClick={() => handleTool(tool.slug)}
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
                fontSize: 13.5,
                cursor: "pointer",
                textAlign: "left",
                border: "none",
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
              {tool.label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Saved Replies */}
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
            Library
          </p>
          <button
            onClick={() => {
              navigate("/saved-replies");
              setIsOpen(false);
            }}
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
              fontSize: 13.5,
              cursor: "pointer",
              textAlign: "left",
              border: "none",
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
            <Bookmark size={15} strokeWidth={1.8} />
            Saved Replies
          </button>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User info */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--border)",
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
            <p
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                marginTop: 2,
              }}
            >
              {getPlanLabel(planTier)}
            </p>
          </div>
        </div>

        {/* Billing dropdown – only show if user has an active subscription */}
        {hasActiveSubscription && (
          <div style={{ padding: "12px 10px", position: "relative" }}>
            <button
              onClick={() => setBillingMenuOpen(!billingMenuOpen)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                e.currentTarget.style.background = "var(--surface2)";
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--ink-3)";
              }}
            >
              <span>Billing</span>
              <MoreHorizontal size={16} />
            </button>

            {billingMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: 12,
                  right: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--border2)",
                  borderRadius: 12,
                  padding: 6,
                  zIndex: 60,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                  animation: "slideDown 0.18s ease both",
                }}
              >
                <button
                  onClick={() => {
                    navigate("/pricing");
                    setBillingMenuOpen(false);
                    setIsOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "transparent",
                    color: "var(--ink)",
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: "left",
                    cursor: "pointer",
                    border: "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Pricing
                </button>
                {isOnPaidPlan && !cancelAtPeriodEnd && (
                  <button
                    onClick={() => {
                      setBillingMenuOpen(false);
                      setShowCancelModal(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "transparent",
                      color: "#ef4444",
                      fontSize: 13,
                      fontWeight: 500,
                      textAlign: "left",
                      cursor: "pointer",
                      border: "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(239,68,68,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    Cancel subscription
                  </button>
                )}
                {isOnPaidPlan && cancelAtPeriodEnd && (
                  <div
                    style={{
                      padding: "8px 12px",
                      fontSize: 12,
                      color: "var(--ink-3)",
                      textAlign: "center",
                      borderTop: "1px solid var(--border)",
                      marginTop: 4,
                    }}
                  >
                    Cancelled – access until{" "}
                    {subscription?.subscription?.current_period_end
                      ? new Date(
                          subscription.subscription.current_period_end,
                        ).toLocaleDateString()
                      : "end of period"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upgrade button – shown for non-Pro users */}
        {!isPro && (
          <div style={{ padding: "12px 10px" }}>
            <button
              onClick={() => {
                navigate("/pricing");
                setIsOpen(false);
              }}
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
                e.currentTarget.style.background = "rgba(34,197,94,0.08)";
                e.currentTarget.style.color = "var(--green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--ink-3)";
              }}
            >
              <Zap size={14} />
              Upgrade
            </button>
          </div>
        )}

        {/* Sign out */}
        <div style={{ padding: "12px 10px" }}>
          <button
            onClick={handleSignOut}
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
      </aside>

      {/* Cancel modal */}
      {showCancelModal && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget && setShowCancelModal(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
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
              borderRadius: 20,
              padding: 28,
              maxWidth: 400,
              width: "100%",
              animation: "fadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 10,
              }}
            >
              Cancel subscription?
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-3)",
                lineHeight: 1.65,
                marginBottom: 16,
              }}
            >
              Your access continues until the end of your billing period. You
              can resubscribe anytime.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Optional: tell us why you're cancelling..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "1px solid var(--border2)",
                background: "var(--surface2)",
                color: "var(--ink)",
                fontSize: 13,
                fontFamily: "inherit",
                marginBottom: 20,
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "1px solid var(--border2)",
                  background: "transparent",
                  color: "var(--ink-2)",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Keep plan
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: "rgba(239,68,68,0.9)",
                  color: "#fff",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  opacity: cancelMutation.isPending ? 0.7 : 1,
                }}
              >
                {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS to hide the close button on desktop */}
      <style>{`
        @media (min-width: 901px) {
          .sidebar {
            transform: translateX(0) !important;
          }
          .sidebar-close {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .sidebar {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
}
