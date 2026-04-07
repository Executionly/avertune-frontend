import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

function StaticShell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function StaticCard({ children }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 22,
        padding: "clamp(24px,5vw,34px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.16)",
      }}
    >
      {children}
    </div>
  );
}

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type"); // "subscription" or "pack"

  const isPack = type === "pack";
  const title = isPack ? "Pack Purchased! 🎉" : "Payment Successful! 🎉";
  const message = isPack
    ? "Your pack has been added. You can now access new scenarios in the tools."
    : "Your subscription is now active. You can start using all Avertune tools immediately.";

  const handleGoToDashboard = () => {
    try {
      navigate("/dashboard");
    } catch (e) {
      // Fallback if navigate fails
      window.location.href = "/dashboard";
    }
  };

  return (
    <StaticShell>
      <StaticCard>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(45,212,191,0.15) 100%)",
              border: "1px solid rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <CheckCircle2 size={30} style={{ color: "var(--green)" }} />
          </div>
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>{title}</h1>
          <p
            style={{ color: "var(--ink-3)", marginBottom: 28, lineHeight: 1.6 }}
          >
            {message}
          </p>
          <button
            onClick={handleGoToDashboard}
            className="btn-green"
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </StaticCard>
    </StaticShell>
  );
}

export function PaymentFailurePage() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    try {
      navigate("/pricing");
    } catch (e) {
      window.location.href = "/pricing";
    }
  };

  const handleGoToDashboard = () => {
    try {
      navigate("/dashboard");
    } catch (e) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <StaticShell>
      <StaticCard>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <XCircle size={30} style={{ color: "#ef4444" }} />
          </div>
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>Payment Failed</h1>
          <p
            style={{ color: "var(--ink-3)", marginBottom: 28, lineHeight: 1.6 }}
          >
            Your payment could not be processed. Please try again or contact
            support if the issue persists.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={handleTryAgain}
              className="btn-green"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              onClick={handleGoToDashboard}
              className="btn-ghost"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </StaticCard>
    </StaticShell>
  );
}
