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
            }}
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
              }}
            >
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"
                  stroke="#000"
                  strokeWidth="2.2"
                />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Avertune</span>
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
            marginBottom: 8,
          }}
        >
          Responsible Use
        </h1>
        <p style={{ color: "var(--ink-3)", marginBottom: 32 }}>
          Last updated: April 5, 2026
        </p>
        <p style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 16 }}>
          Avertune is designed to help you communicate more effectively.
          However, you remain responsible for how you use the content generated
          by our AI.
        </p>
        <p style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 16 }}>
          We encourage you to:
        </p>
        <ul
          style={{
            marginLeft: 20,
            color: "var(--ink-2)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          <li>
            Review and edit AI‑generated replies before sending them – you are
            responsible for the final message.
          </li>
          <li>Not use Avertune to impersonate others, harass, or deceive.</li>
          <li>
            Respect the privacy and consent of people you communicate with.
          </li>
          <li>
            Not rely solely on AI for critical decisions (e.g., legal, medical,
            financial).
          </li>
        </ul>
        <p style={{ color: "var(--ink-2)", lineHeight: 1.6 }}>
          Misuse of Avertune may result in account suspension or termination. We
          reserve the right to investigate and take action against any use we
          deem inappropriate.
        </p>
      </div>
    </div>
  );
}
