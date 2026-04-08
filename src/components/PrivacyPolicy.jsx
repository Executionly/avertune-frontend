import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

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
            onClick={() => navigate(-1)}
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
            Privacy Policy
          </span>
        </div>
      </header>

      <div
        className="container"
        style={{
          maxWidth: 860,
          paddingTop: "clamp(40px,6vw,72px)",
          paddingBottom: 80,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px,5vw,48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "var(--ink-3)", marginBottom: 32 }}>
          Last updated: April 8, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              1. Information We Collect
            </h2>
            <p
              style={{
                color: "var(--ink-2)",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              <strong>Information you provide:</strong>
            </p>
            <ul
              style={{
                marginLeft: 20,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              <li>account details (name, email)</li>
              <li>messages you submit for analysis</li>
              <li>support or feedback communication</li>
            </ul>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              <strong>Automatically collected:</strong> device and browser
              information, usage data and feature interaction.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              2. How We Use Your Information
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We use your data to: provide Avertune services, generate responses
              and analysis, improve system performance and accuracy, and
              communicate important updates.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              3. Data Protection Commitment
            </h2>
            <ul
              style={{ marginLeft: 20, color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              <li>We do not sell your personal data</li>
              <li>We do not use your messages for advertising targeting</li>
              <li>Your content is processed securely</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              4. Data Storage and Retention
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We retain data only as long as necessary to provide services, meet
              legal obligations, and improve system performance.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              5. Third-Party Services
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We may use trusted providers for payments (e.g., Stripe), hosting,
              and analytics. These providers are required to protect your data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              6. Your Rights
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              You may: access your data, request deletion, and opt out of
              marketing.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              7. Security
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We use industry-standard safeguards. However, no system is 100%
              secure.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              8. Updates
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We may update this policy. Continued use means acceptance.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              9. Contact
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              support@avertune.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
