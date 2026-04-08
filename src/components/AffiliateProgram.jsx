import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Video,
  Mail,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Camera,
  Sparkles,
  Heart,
  Shield,
  CheckCircle,
  Lock,
} from "lucide-react";

export default function AffiliateProgram() {
  const navigate = useNavigate();

  const stats = [
    {
      icon: TrendingUp,
      value: "$5,000+",
      label: "monthly earning potential",
      color: "var(--green)",
    },
    {
      icon: DollarSign,
      value: "Unlimited",
      label: "earnings scale with performance",
      color: "var(--teal)",
    },
  ];

  const steps = [
    {
      icon: Camera,
      title: "Create a test video",
      desc: "Record a short video showing how Avertune works — paste a message, show the analysis, and highlight the improved reply.",
    },
    {
      icon: Mail,
      title: "Send your video",
      desc: "Email your video to creators@avertune.com with your name and social handles.",
    },
    {
      icon: Zap,
      title: "Get approved & earn",
      desc: "If we love your style, we'll send you a paid collaboration offer. Earn up to $5,000+ per month!",
    },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "Performance-based pay",
      desc: "Base pay per approved video + bonuses for views and performance.",
    },
    {
      icon: Users,
      title: "No follower minimum",
      desc: "We care about content quality and creativity, not just numbers.",
    },
    {
      icon: Briefcase,
      title: "Build your portfolio",
      desc: "Work with a fast‑growing global brand and grow your reel.",
    },
    {
      icon: Heart,
      title: "Free Pro access",
      desc: "Get Avertune Pro while you create – analyze and reply like a pro.",
    },
  ];

  const whatWeLookFor = [
    "clear, simple explanations",
    "relatable message examples",
    "engaging storytelling",
    "natural delivery (not scripted)",
  ];

  const contentIdeas = [
    "“This message could cost you”",
    "Before vs after replies",
    "Difficult conversations",
    "Workplace communication",
    "Negotiation scenarios",
  ];

  const testimonials = [
    {
      name: "Maria S.",
      role: "Content Creator",
      text: "Working with Avertune has been a genuinely great experience. Communication is clear, earnings are solid, and I feel valued. This job has helped me grow my creative skills and build a stronger portfolio. I honestly recommend Avertune to other creators – it's a comfortable and motivating place to work!",
      rating: 5,
    },
    {
      name: "Jeremy L.",
      role: "YouTuber",
      text: "Overall, I've really enjoyed working with Avertune. The communication is smooth, expectations are clear, and the process is easy. Earnings are solid and definitely appreciated. This collaboration has helped me grow my creative skills and add more to my portfolio. I'd definitely recommend Avertune to other creators.",
      rating: 5,
    },
    {
      name: "Sofie K.",
      role: "TikTok Creator",
      text: "Firstly yes I love working with you!! Such a great brand to work with and very efficient. Earnings are great. Satisfied. This collab has certainly helped me grow!! 100% recommend working with Avertune!! You're actually one of my favourite brands I currently work with! Can't wait to create even more content for you :)",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "Is there a follower requirement?",
      a: "No. We care about content quality, not follower count.",
    },
    {
      q: "When do I get paid?",
      a: "Payments are made based on approved content and performance cycles.",
    },
    {
      q: "Can I create my own content ideas?",
      a: "Yes. We encourage originality. We provide inspiration and proven formats, but you are free to test your own ideas.",
    },
    {
      q: "Is there a limit to earnings?",
      a: "No. Earnings scale with performance. The more you create and the better your content performs, the more you earn.",
    },
    {
      q: "What kind of content performs best?",
      a: "Real message examples, before/after comparisons, and emotional or high-stakes scenarios tend to perform very well.",
    },
    {
      q: "How is Avertune different from writing tools?",
      a: "Most tools help you rewrite text. Avertune helps you understand what a message really means, avoid miscommunication, and respond strategically. It's communication decision support, not just writing.",
    },
    {
      q: "Is Avertune free to use?",
      a: "Yes. You can try Avertune with a limited number of replies per day. Paid plans unlock more replies, advanced response strategies, and negotiation tools.",
    },
    {
      q: "Is my data private?",
      a: "Yes. We do not sell your data. We use your inputs only to provide and improve the service.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
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
            Creator Program
          </span>
        </div>
      </header>

      <div
        className="container"
        style={{ paddingTop: "clamp(40px,6vw,72px)", paddingBottom: 80 }}
      >
        {/* Hero */}
        <div
          style={{ textAlign: "center", marginBottom: "clamp(48px,6vw,72px)" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              marginBottom: 18,
            }}
          >
            <Star size={12} color="var(--green)" />
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}
            >
              Earn up to $5,000+ / month
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px,5vw,56px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              marginBottom: 14,
            }}
          >
            Become an Avertune Creator
            <br />
            <span className="grad-text">Create. Help. Get paid.</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(16px,1.8vw,18px)",
              color: "var(--ink-3)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Avertune is building a global network of creators who show how to
            handle real conversations — from work emails to difficult messages.
            If you enjoy creating content and want to grow your influence while
            earning, we want to work with you.
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: "clamp(56px,8vw,88px)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "clamp(24px,3vw,32px)",
                textAlign: "center",
              }}
            >
              <s.icon size={32} color={s.color} style={{ marginBottom: 12 }} />
              <div
                style={{
                  fontSize: "clamp(28px,4vw,40px)",
                  fontWeight: 800,
                  color: s.color,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 14, color: "var(--ink-3)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* How to join */}
        <div style={{ marginBottom: "clamp(56px,8vw,88px)" }}>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            How to Join
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "clamp(20px,3vw,32px)",
              marginTop: "clamp(32px,4vw,48px)",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "clamp(24px,3vw,32px)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "rgba(34,197,94,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 18px",
                  }}
                >
                  <step.icon size={28} color="var(--green)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  Step {i + 1}: {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a
              href="mailto:creators@avertune.com?subject=Creator%20Application&body=Hi%2C%20I%27d%20like%20to%20join%20the%20Avertune%20Creator%20Program.%20Here%20is%20my%20video%20and%20information%3A%0A%0AName%3A%0ASocial%20handles%3A%0AVideo%20link%3A"
              className="btn-green"
              style={{
                padding: "12px 28px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "#000",
              }}
            >
              Send your video → <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Why Join? */}
        <div style={{ marginBottom: "clamp(56px,8vw,88px)" }}>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Why Join Avertune?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginTop: "clamp(32px,4vw,48px)",
            }}
          >
            {benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "clamp(20px,2.5vw,24px)",
                  textAlign: "center",
                }}
              >
                <b.icon
                  size={28}
                  color="var(--green)"
                  style={{ marginBottom: 12 }}
                />
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                  {b.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-3)",
                    lineHeight: 1.5,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Look For + Content Ideas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            marginBottom: "clamp(56px,8vw,88px)",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "clamp(24px,3vw,32px)",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 16,
                color: "var(--green)",
              }}
            >
              What We Look For
            </h3>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {whatWeLookFor.map((item, i) => (
                <li
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <CheckCircle size={16} color="var(--green)" />
                  <span style={{ fontSize: 14, color: "var(--ink-2)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "clamp(24px,3vw,32px)",
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 16,
                color: "var(--teal)",
              }}
            >
              Content Ideas
            </h3>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {contentIdeas.map((item, i) => (
                <li
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <Sparkles size={16} color="var(--teal)" />
                  <span style={{ fontSize: 14, color: "var(--ink-2)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What makes this different */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.05), rgba(45,212,191,0.05))",
            borderRadius: 24,
            padding: "clamp(32px,4vw,48px)",
            marginBottom: "clamp(56px,8vw,88px)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(24px,3.5vw,32px)",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            What Makes This Different
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-3)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Most tools help people write.
            <br />
            <strong style={{ color: "var(--green)" }}>
              Avertune helps people understand messages, avoid mistakes, and
              respond correctly.
            </strong>
            <br />
            This makes your content more relatable, more shareable, and more
            likely to go viral.
          </p>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: "clamp(56px,8vw,88px)" }}>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            What our creators say
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              marginTop: "clamp(32px,4vw,48px)",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "clamp(20px,2.5vw,28px)",
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {Array(t.rating)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        fill="var(--green)"
                        color="var(--green)"
                      />
                    ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-2)",
                    lineHeight: 1.6,
                    marginBottom: 16,
                  }}
                >
                  “{t.text}”
                </p>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                <p style={{ fontSize: 12, color: "var(--ink-4)" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,44px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "18px 22px",
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
                  {f.q}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                  }}
                >
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: "clamp(56px,8vw,88px)", textAlign: "center" }}>
          <a
            href="mailto:creators@avertune.com?subject=Creator%20Application"
            className="btn-green"
            style={{
              padding: "14px 36px",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              display: "inline-block",
              textDecoration: "none",
              color: "#000",
            }}
          >
            Create your first video and apply today →
          </a>
        </div>
      </div>
    </div>
  );
}
