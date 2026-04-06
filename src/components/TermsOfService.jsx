import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
            Terms of Service
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
          Terms of Service
        </h1>
        <p style={{ color: "var(--ink-3)", marginBottom: 32 }}>
          Last updated: April 5, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              By accessing or using Avertune (“we”, “us”, “our”), you agree to
              be bound by these Terms of Service. If you do not agree, please do
              not use our Services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              2. Description of Services
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              Avertune provides AI‑powered communication tools, including reply
              generation, tone analysis, boundary builder, negotiation replies,
              follow‑up writer, difficult email rewriting, and intent detection.
              Our Services are accessible via our website and may change from
              time to time.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              3. Account Registration
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              To use certain features, you must create an account. You agree to
              provide accurate, current, and complete information. You are
              responsible for safeguarding your password and for all activities
              under your account. Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              4. Subscriptions and Payments
            </h2>
            <p
              style={{
                color: "var(--ink-2)",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              Certain features require a paid subscription. By purchasing a
              subscription, you agree to pay the applicable fees. Subscriptions
              automatically renew unless cancelled before the renewal date. We
              use third‑party payment processors (Stripe, Paystack, etc.) and do
              not store your full payment details.
            </p>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              You may cancel your subscription at any time; cancellation will
              take effect at the end of your current billing period. Refunds are
              not provided for partially used periods unless required by law.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              5. Acceptable Use
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              You agree not to:
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
                Use the Services for any illegal purpose or in violation of any
                laws.
              </li>
              <li>
                Upload or generate content that is harassing, abusive,
                defamatory, or otherwise objectionable.
              </li>
              <li>
                Attempt to reverse engineer, copy, or disrupt the Services.
              </li>
              <li>
                Use automated means (bots, scrapers) to access the Services
                without our permission.
              </li>
              <li>
                Share your account credentials with others or resell access to
                the Services.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              6. Intellectual Property
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              All intellectual property in the Services (including software,
              design, text, graphics, and trademarks) is owned by Avertune or
              its licensors. You retain ownership of any text you input into the
              Services. You grant us a limited license to process that input to
              provide the Services. The AI‑generated replies are owned by you,
              but you acknowledge that similar replies may be generated for
              other users.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              7. Usage Limits and Fair Use
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              Your plan includes certain usage limits (e.g., number of replies
              per day/month). Excessive use that degrades service for others may
              result in throttling or suspension. We reserve the right to
              enforce fair use policies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              8. Termination
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We may suspend or terminate your account if you violate these
              Terms. You may delete your account at any time. Upon termination,
              your right to use the Services ceases immediately.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              9. Disclaimer of Warranties
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND.
              WE DO NOT GUARANTEE THAT THE AI‑GENERATED REPLIES WILL BE
              ACCURATE, ERROR‑FREE, OR SUITABLE FOR YOUR SPECIFIC SITUATION. USE
              AT YOUR OWN RISK.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              10. Limitation of Liability
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AVERTUNE SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICES. OUR
              TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
              PRECEDING 12 MONTHS.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              11. Indemnification
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              You agree to indemnify and hold Avertune harmless from any claims,
              damages, or expenses arising from your violation of these Terms or
              your misuse of the Services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              12. Governing Law
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              These Terms shall be governed by the laws of the jurisdiction
              where Avertune is established (or Delaware / your country as
              appropriate). You consent to the exclusive jurisdiction of the
              courts in that location.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              13. Changes to Terms
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              We may update these Terms from time to time. We will notify you of
              material changes via email or a notice on our website. Your
              continued use of the Services after the effective date constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              14. Contact Us
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@avertune.com"
                style={{ color: "var(--green)" }}
              >
                legal@avertune.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
