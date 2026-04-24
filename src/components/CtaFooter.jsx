import { useNavigate } from "react-router-dom";

export function CTA({ onSignup }) {
  return (
    <section
      style={{
        padding: "clamp(64px,8vw,96px) 0",
        background: "var(--bg)",
        textAlign: "center",
      }}
    >
      <div className="container" style={{ maxWidth: 600 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            margin: "0 auto 28px",
            background:
              "conic-gradient(from 0deg,var(--green),var(--teal),var(--blue),var(--green))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path
                d="M3 13h20M13 3l10 10L13 23"
                stroke="var(--green)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <h2
          style={{
            fontSize: "clamp(30px,5vw,56px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: 28,
          }}
        >
          Ready to reply with
          <br />
          <span className="grad-text">confidence?</span>
        </h2>
        <button
          onClick={onSignup}
          className="btn-green"
          style={{
            padding: "clamp(12px,1.8vw,15px) clamp(28px,4vw,40px)",
            borderRadius: 13,
            fontSize: "clamp(14px,1.8vw,16px)",
            display: "block",
            margin: "0 auto 14px",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          Start Free Trial
        </button>
        <p style={{ fontSize: 13, color: "var(--ink-4)" }}>
          7 days free. No credit card required.
        </p>
      </div>
    </section>
  );
}

export function Footer({ onPricing }) {
  const navigate = useNavigate();

  // Helper to scroll to a section by ID
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If not found on current page, navigate to home and then scroll
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const cols = [
    {
      label: "Resources",
      links: [
        {
          label: "How it works",
          onClick: () => scrollToSection("how-it-works"),
        },
        {
          label: "Pricing",
          onClick: () => (onPricing ? onPricing() : navigate("/pricing")),
        },
        {
          label: "FAQ",
          onClick: () => scrollToSection("faq"),
        },
        {
          label: "Affiliate Program",
          onClick: () => navigate("/affiliate/dashboard"),
        },
        {
          label: "Influencer Program",
          onClick: () => navigate("/influencer-program"),
        },
      ],
    },
    {
      label: "Tools",
      links: [
        {
          label: "Reply Generator",
          onClick: () => navigate("/tool/reply-generator"),
        },
        {
          label: "Tone Checker",
          onClick: () => navigate("/tool/tone-checker"),
        },
        {
          label: "Boundary Builder",
          onClick: () => navigate("/tool/boundary-builder"),
        },
        {
          label: "Sales & Negotiation",
          onClick: () => navigate("/tool/negotiation-reply"),
        },
        {
          label: "Follow-Up Writer",
          onClick: () => navigate("/tool/follow-up-writer"),
        },
        {
          label: "Difficult Email",
          onClick: () => navigate("/tool/difficult-email"),
        },
        {
          label: "Intent Detector",
          onClick: () => navigate("/tool/intent-detector"),
        },
      ],
    },
    {
      label: "Legal",
      links: [
        { label: "Privacy policy", onClick: () => navigate("/privacy") },
        { label: "Terms of service", onClick: () => navigate("/terms") },
        {
          label: "Responsible use",
          onClick: () => navigate("/responsible-use"),
        },
        {
          label: "Support@avertune.com",
          onClick: () => (window.location.href = "mailto:support@avertune.com"),
        },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg2)",
        padding: "clamp(40px,5vw,56px) 0 28px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
            gap: "clamp(24px,4vw,40px)",
            marginBottom: "clamp(32px,4vw,48px)",
          }}
        >
          <div style={{ gridColumn: "span 2", minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div>
                <img
                  src="./logo.png"
                  alt="avertune logo"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.label}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 14,
                }}
              >
                {col.label}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={l.onClick || undefined}
                      style={{
                        fontSize: 13.5,
                        color: "var(--ink-3)",
                        transition: "color 0.15s",
                        background: "none",
                        border: "none",
                        fontFamily: "inherit",
                        cursor: l.onClick ? "pointer" : "default",
                        padding: 0,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--ink)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--ink-3)")
                      }
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ fontSize: 12.5, color: "var(--ink-4)" }}>
            © {currentYear} Avertune. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 18 }}>
            <button
              onClick={() => navigate("/privacy")}
              style={{
                fontSize: 12.5,
                color: "var(--ink-4)",
                transition: "color 0.15s",
                background: "none",
                border: "none",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--ink-4)")
              }
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              style={{
                fontSize: 12.5,
                color: "var(--ink-4)",
                transition: "color 0.15s",
                background: "none",
                border: "none",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--ink-4)")
              }
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
