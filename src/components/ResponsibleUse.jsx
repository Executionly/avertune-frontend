import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ResponsibleUse() {
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
            Responsible Use
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
          Responsible Use
        </h1>
        <p style={{ color: "var(--ink-3)", marginBottom: 32 }}>
          Last updated: April 8, 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              What Avertune Does
            </h2>
            <ul
              style={{ marginLeft: 20, color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              <li>helps you understand tone and intent</li>
              <li>suggests better ways to respond</li>
              <li>improves clarity and communication</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              What Avertune Does NOT Do
            </h2>
            <ul
              style={{ marginLeft: 20, color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              <li>replace your judgment</li>
              <li>guarantee success</li>
              <li>certify outcomes</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Your Responsibility
            </h2>
            <ul
              style={{ marginLeft: 20, color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              <li>reviewing all outputs</li>
              <li>ensuring compliance with policies</li>
              <li>using the tool ethically</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              Prohibited Use
            </h2>
            <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
              Do not use Avertune to: manipulate or deceive unlawfully, violate
              academic or workplace policies, or engage in harmful
              communication.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
