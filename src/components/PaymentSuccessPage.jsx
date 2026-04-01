import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";

  useEffect(() => {
    // Optionally, we could verify the payment with backend, but webhook already did
  }, []);

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
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(45,212,191,0.15))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <CheckCircle2 size={48} style={{ color: "var(--green)" }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Payment successful!
        </h1>
        <p style={{ color: "var(--ink-3)", marginBottom: 24, lineHeight: 1.6 }}>
          Your subscription is now active. You have full access to all tools.
        </p>
        {reference && (
          <p style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 24 }}>
            Reference: {reference}
          </p>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-green"
          style={{
            padding: "12px 28px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Go to Dashboard <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
