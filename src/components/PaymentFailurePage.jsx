import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "Payment was not completed.";

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
      <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <XCircle size={48} style={{ color: "#ef4444" }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Payment failed
        </h1>
        <p style={{ color: "var(--ink-3)", marginBottom: 24, lineHeight: 1.6 }}>
          {reason}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => navigate("/pricing")}
            className="btn-green"
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <RefreshCw size={14} /> Try again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "1.5px solid var(--border2)",
              background: "transparent",
              color: "var(--ink-2)",
              fontSize: 14,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={14} /> Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
