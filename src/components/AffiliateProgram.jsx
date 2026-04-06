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
} from "lucide-react";

export default function AffliliateProgram() {
  const navigate = useNavigate();

  const stats = [
    {
      icon: TrendingUp,
      value: "1.5M+",
      label: "video views",
      color: "var(--green)",
    },
    {
      icon: DollarSign,
      value: "$5,000+",
      label: "monthly earning potential",
      color: "var(--teal)",
    },
  ];

  const steps = [
    {
      icon: Camera,
      title: "Record a testing video",
      desc: "Create a short video using Avertune – show how you use the Reply Generator, Tone Checker or any of our tools.",
    },
    {
      icon: Mail,
      title: "Send an email to us",
      desc: "Email your video to ugc@avertune.com with your name and social handles.",
    },
    {
      icon: Zap,
      title: "Get an offer",
      desc: "If we love your style, we’ll send you a paid collaboration offer. Earn up to $5,000+ per month!",
    },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "Fast earnings",
      desc: "Get paid quickly for every approved video.",
    },
    {
      icon: Users,
      title: "No follower minimum",
      desc: "We care about creativity, not just numbers.",
    },
    {
      icon: Briefcase,
      title: "Build your portfolio",
      desc: "Work with a top AI brand and grow your reel.",
    },
    {
      icon: Heart,
      title: "Full product access",
      desc: "Get free Avertune Pro while you create.",
    },
  ];

  const testimonials = [
    {
      name: "Maria S.",
      role: "Content Creator",
      text: "Working with Avertune has been a genuinely great experience. Communication is clear, earnings are solid, and I feel valued. This job has helped me grow my creative skills and build a stronger portfolio. I honestly recommend Avertune to other creators – it’s a comfortable and motivating place to work!",
      rating: 5,
    },
    {
      name: "Jeremy L.",
      role: "YouTuber",
      text: "Overall, I’ve really enjoyed working with Avertune. The communication is smooth, expectations are clear, and the process is easy. Earnings are solid and definitely appreciated. This collaboration has helped me grow my creative skills and add more to my portfolio. I’d definitely recommend Avertune to other creators.",
      rating: 5,
    },
    {
      name: "Sofie K.",
      role: "TikTok Creator",
      text: "Firstly yes I love working with you!! Such a great brand to work with and very efficient. Earnings are great. Satisfied. This collab has certainly helped me grow!! 100% recommend working with Avertune!! You’re actually one of my favourite brands I currently work with! Can’t wait to create even more content for you :)",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "Are there any payout limits?",
      a: "No – you can earn as much as your content drives. We pay per accepted video and offer performance bonuses.",
    },
    {
      q: "How will you pay me?",
      a: "We pay via PayPal, Stripe, or bank transfer (depending on your region).",
    },
    { q: "Which currency do you pay in?", a: "USD (US dollars)." },
    {
      q: "When do I get paid?",
      a: "Payouts are processed monthly, within 15 days after the end of each month.",
    },
    {
      q: "Can I come up with my own content ideas?",
      a: "Absolutely! We encourage creativity. While we provide inspiration videos and guidelines, you are welcome to pitch your own ideas as long as they align with our brand.",
    },
    {
      q: "When will I receive a response after submitting my application?",
      a: "We typically respond within 3-5 business days.",
    },
    {
      q: "How many posts do I need to publish per month?",
      a: "We have flexible commitments – from 2 to 10+ posts per month depending on your availability and our needs.",
    },
    {
      q: "What kind of posts should I make?",
      a: "Short-form videos (TikTok, Reels, Shorts) demonstrating Avertune in action – replying to messages, analyzing tone, setting boundaries, etc. Authenticity works best!",
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
            UGC Creator Program
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
            Become a UGC Creator
            <br />
            <span className="grad-text">for Avertune</span>
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
            Are you a talented creator who wants to grow, make content, and get
            paid for your creativity? We're looking for YOU! Post videos,
            inspire your audience, and earn up to $5,000 and more!
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
            How to join?
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
              href="mailto:ugc@avertune.com?subject=UGC%20Creator%20Application&body=Hi%2C%20I%27d%20like%20to%20join%20the%20Avertune%20UGC%20program.%20Here%20is%20my%20video%20and%20information%3A%0A%0AName%3A%0ASocial%20handles%3A%0AVideo%20link%3A"
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
            Why Join?
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

        {/* What our creators say */}
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
            FAQ – UGC Program
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
            href="mailto:ugc@avertune.com?subject=UGC%20Creator%20Application"
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
            Send your video and join our team →
          </a>
        </div>
      </div>
    </div>
  );
}
