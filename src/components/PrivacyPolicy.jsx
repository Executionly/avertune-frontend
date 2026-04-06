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
          Last updated: April 5, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Information We Collect
            </h2>
            <p
              style={{
                color: "var(--ink-2)",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              We collect information you provide directly:
            </p>
            <ul
              style={{
                marginLeft: 20,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <li>
                <strong>Account Information:</strong> Name, email, password when
                you register.
              </li>
              <li>
                <strong>Usage Data:</strong> Messages you paste into our tools
                for reply generation, tone analysis, etc.
              </li>
              <li>
                <strong>Communications:</strong> Any messages you send through
                support or feedback forms.
              </li>
            </ul>
            <p
              style={{ color: "var(--ink-2)", lineHeight: 1.6, marginTop: 12 }}
            >
              We also collect certain information automatically: IP address,
              browser type, operating system, device identifiers, pages viewed,
              features used, and time spent.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              How We Use Your Information
            </h2>
            <ul
              style={{
                marginLeft: 20,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <li>
                To provide and maintain our Services – process your requests and
                deliver AI‑generated replies.
              </li>
              <li>
                To improve our Services – analyze usage to optimize user
                experience and model performance.
              </li>
              <li>
                To communicate – send service announcements, updates, and
                security alerts.
              </li>
              <li>
                For compliance – enforce our Terms of Service and comply with
                legal obligations.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Sharing Your Information
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We do not sell your personal information. We may share information
              with:
            </p>
            <ul
              style={{
                marginLeft: 20,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                marginTop: 8,
              }}
            >
              <li>
                <strong>Service Providers:</strong> Third parties who perform
                services (e.g., hosting, analytics, AI providers) under
                confidentiality agreements.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect rights, safety, or property.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Cookies and Tracking
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We and our partners use cookies and similar technologies to
              collect information about your activity and preferences. You can
              control cookies via your browser settings; however, disabling
              cookies may limit functionality.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Security
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We implement industry‑standard measures to protect your
              information. However, no method of transmission or storage is 100%
              secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Your Choices
            </h2>
            <ul
              style={{ marginLeft: 20, color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              <li>
                You can access, update, or delete your account information in
                your account settings.
              </li>
              <li>
                You may unsubscribe from marketing emails via the link in those
                emails. Essential service emails cannot be unsubscribed.
              </li>
              <li>
                You can disable cookies in your browser, though some features
                may not work.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Children’s Privacy
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              Our Services are not directed to children under 18. We do not
              knowingly collect personal data from minors. If you believe we
              have, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              International Transfers
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              Your information may be transferred to and processed in countries
              outside your residence, including the United States. By using our
              Services, you consent to such transfers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Data Retention
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We retain your personal data for as long as your account remains
              active. If you delete your account, we will delete or anonymize
              your personal data within a reasonable period, except where
              retention is required for legal, tax, fraud prevention, or
              legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Subprocessors
            </h2>
            <p
              style={{
                color: "var(--ink-2)",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              We use trusted third‑party service providers (“subprocessors”) to
              help us operate, provide, and improve our services. These
              subprocessors include:
            </p>
            <ul
              style={{ marginLeft: 20, color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              <li>
                <strong>Stripe, Inc.</strong> – payment processing and billing
              </li>
              <li>
                <strong>Amplitude, Inc.</strong> – product analytics and usage
                analytics
              </li>
              <li>
                <strong>Hetzner Online GmbH</strong> – cloud infrastructure and
                hosting
              </li>
              <li>
                <strong>OpenAI / Anthropic</strong> – AI model providers
                (message processing)
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              GDPR Rights (EEA residents)
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              You have the right to access, rectify, erase, restrict, port, and
              object to processing of your personal data. To exercise these
              rights, contact us at{" "}
              <a
                href="mailto:privacy@avertune.com"
                style={{ color: "var(--green)" }}
              >
                privacy@avertune.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              California Privacy Rights (CCPA)
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              If you are a California resident, you have the right to know what
              personal information we collect, request deletion, request access,
              and non‑discrimination for exercising your rights. Avertune does
              not sell your personal information. To exercise your rights,
              contact us at{" "}
              <a
                href="mailto:privacy@avertune.com"
                style={{ color: "var(--green)" }}
              >
                privacy@avertune.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Changes to This Policy
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We may update this Privacy Policy. We will post the updated date
              at the top. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Contact Us
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a
                href="mailto:privacy@avertune.com"
                style={{ color: "var(--green)" }}
              >
                privacy@avertune.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
