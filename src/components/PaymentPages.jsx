import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { PageShell, Card } from "./AuthPages";

export function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Card>
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
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>
            Payment Successful! 🎉
          </h1>
          <p
            style={{ color: "var(--ink-3)", marginBottom: 28, lineHeight: 1.6 }}
          >
            Your subscription is now active. You can start using all Avertune
            tools immediately.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-green"
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </Card>
    </PageShell>
  );
}

export function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <PageShell>
      <Card>
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
              onClick={() => navigate("/pricing")}
              className="btn-green"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-ghost"
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
