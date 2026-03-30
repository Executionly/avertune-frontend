import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  useMySubscription,
  usePortal,
  getPlanLabel,
} from "../lib/useSubscription";
import { useToast } from "../lib/Toast";
import { Home, Zap, LogOut, X } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();
  const { data: subscription } = useMySubscription();
  const portalMutation = usePortal();

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";
  const displayInitial = displayName[0].toUpperCase();
  const planTier = subscription?.plan_tier || user?.plan_tier || "free";
  const isOnPaidPlan =
    planTier && !["free", "trial"].includes(planTier.toLowerCase());

  const handlePortal = async () => {
    try {
      await portalMutation.mutateAsync();
    } catch (err) {
      toast.error(err?.message || "Could not open billing portal.");
    }
  };

  const handleUpgrade = () => {
    navigate("/pricing");
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsOpen(false);
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

        {/* Logo */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
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
        </div>

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

        {/* Billing / Upgrade */}
        <div style={{ padding: "12px 10px" }}>
          {isOnPaidPlan ? (
            <button
              onClick={handlePortal}
              disabled={portalMutation.isPending}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 9,
                background: "transparent",
                color: "var(--green)",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                border: "none",
                marginBottom: 2,
                transition: "all .15s",
                opacity: portalMutation.isPending ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(34,197,94,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Zap size={14} />{" "}
              {portalMutation.isPending ? "Opening…" : "Manage billing"}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 9,
                background: "transparent",
                color: "var(--green)",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                border: "none",
                marginBottom: 2,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(34,197,94,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Zap size={14} /> Upgrade plan
            </button>
          )}
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
