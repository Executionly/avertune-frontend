"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";
import { CtaSection } from "@/components/marketing/CtaSection";

const SOLUTIONS_BY_TEAM = [
  {
    id: "enterprise",
    slug: "enterprise",
    title: "Enterprise & Teams",
    tagline: "Organisation-wide communication intelligence",
    desc: "Deploy Avertune across your organization. Define communication standards with the Playbook Engine. Track team performance with analytics dashboards. Scale communication quality across every department.",
    features: [
      "Team Playbooks",
      "Communication Analytics",
      "Admin Dashboard",
      "SSO & Roles",
      "Org-level CI Profiles",
    ],
  },
  {
    id: "sales-teams",
    slug: "sales-teams",
    title: "Sales Teams & SDRs",
    tagline: "Close more deals. Hold more leverage.",
    desc: "Built for sales professionals who need to handle objections confidently, follow up without appearing desperate, and close conversations without discounting. Reduce communication errors that cost deals.",
    features: [
      "Objection Handling Engine",
      "Discount Resistance Scripts",
      "Deal Recovery",
      "Follow-Up Sequences",
      "Sales Playbook",
    ],
  },
  {
    id: "hr",
    slug: "hr",
    title: "HR & Recruiting",
    tagline: "Professional, bias-safe candidate communication",
    desc: "Write respectful rejection emails, handle escalations calmly, and maintain consistent candidate messaging that protects your employer brand. Reduce miscommunication across every stage of the hiring process.",
    features: [
      "Candidate Rejection Templates",
      "Bias-Safe Language",
      "Escalation Handling",
      "HR Playbook",
      "Interview Follow-Ups",
    ],
  },
  {
    id: "individuals",
    slug: "individuals",
    title: "Individuals & Founders",
    tagline: "Your personal communication strategist",
    desc: "Whether you're negotiating salary, handling a difficult client, or setting a boundary — Avertune gives you the strategic clarity to communicate with confidence across every situation.",
    features: [
      "All Three Modes",
      "CI Score Profile",
      "Behavioural Memory",
      "Personal Playbooks",
      "Outcome Tracking",
    ],
  },
];

const SOLUTIONS_BY_USE_CASE = [
  {
    id: "salary",
    slug: "salary",
    title: "Salary Negotiation",
    tagline: "Negotiate your worth with confidence",
    desc: "Prepare strategically for salary discussions. Avertune helps you understand the negotiation dynamics, hold your position under pressure, and respond to counteroffers without losing leverage.",
    features: [
      "Negotiation positioning",
      "Counteroffer response templates",
      "Value reinforcement language",
      "Pressure resistance guidance",
    ],
  },
  {
    id: "deals",
    slug: "deals",
    title: "Deal Closing",
    tagline: "Close conversations with strategic clarity",
    desc: "Understand the signals in a buyer's message. Know when to push, when to hold, and how to create urgency without appearing desperate. Close more deals with better communication.",
    features: [
      "Buyer signal detection",
      "Urgency creation scripts",
      "Closing conversation templates",
      "Deal recovery sequences",
    ],
  },
  {
    id: "difficult",
    slug: "difficult",
    title: "Difficult Conversations",
    tagline: "Say hard things clearly, without fallout",
    desc: "Structure and navigate conversations that feel impossible — conflict resolution, boundary setting, delivering bad news, and handling passive aggression — with clarity and minimal escalation.",
    features: [
      "Conflict de-escalation framing",
      "Boundary-setting language",
      "Escalation risk assessment",
      "Diplomatically direct responses",
    ],
  },
];

function SolutionForm({
  solutionTitle,
  solutionId,
}: {
  solutionTitle: string;
  solutionId: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Submit to mailto or a backend endpoint
    const subject = encodeURIComponent(
      `${solutionTitle} - Customisation Request`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nTeam Size: ${formData.teamSize}\n\nMessage:\n${formData.message}`,
    );
    window.location.href = `mailto:info@avertune.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="bg-violet-50 border border-violet-200 rounded-[20px] p-8 text-center">
        <p className="text-[18px] font-semibold text-navy-900 mb-2">
          Request sent!
        </p>
        <p className="text-[14px] text-navy-500">
          Our team will get back to you within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-navy-900/[0.08] rounded-[24px] p-8 space-y-5"
    >
      <h3 className="text-[18px] font-semibold text-navy-900 mb-1">
        Request customization
      </h3>
      <p className="text-[13px] text-navy-500 mb-5">
        Tell us about your needs and we'll get back to you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
            Work email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="jane@company.com"
            className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
            Company / Organisation
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
            Team size
          </label>
          <select
            value={formData.teamSize}
            onChange={(e) =>
              setFormData({ ...formData, teamSize: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
          >
            <option value="">Select team size</option>
            <option value="1-5">1–5</option>
            <option value="6-20">6–20</option>
            <option value="21-50">21–50</option>
            <option value="51-200">51–200</option>
            <option value="200+">200+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
          What are you looking for?
        </label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder={`Tell us about your ${solutionTitle} needs, current challenges, and what you'd like Avertune to help with...`}
          className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none min-h-[140px]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}

export default function SolutionsPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Solutions
          </p>
          <h1
            className="font-display font-medium text-white mb-5 leading-[1.1]"
            style={{ fontSize: "clamp(32px,5vw,62px)" }}
          >
            Built for every team,
            <br />
            every conversation.
          </h1>
          <p className="text-base text-white/60 max-w-[520px] mx-auto leading-[1.7]">
            Avertune adapts to your specific communication context — whether
            you're a solo founder, an SDR, an HR manager, or an enterprise team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#enterprise"
              className="px-5 py-2.5 rounded-full bg-violet-600 text-white text-[13px] font-medium hover:bg-violet-500 transition-all"
            >
              Enterprise & Teams
            </a>
            <a
              href="#sales-teams"
              className="px-5 py-2.5 rounded-full bg-white/10 text-white text-[13px] font-medium hover:bg-white/20 transition-all"
            >
              Sales Teams
            </a>
            <a
              href="#hr"
              className="px-5 py-2.5 rounded-full bg-white/10 text-white text-[13px] font-medium hover:bg-white/20 transition-all"
            >
              HR & Recruiting
            </a>
            <a
              href="#individuals"
              className="px-5 py-2.5 rounded-full bg-white/10 text-white text-[13px] font-medium hover:bg-white/20 transition-all"
            >
              Individuals & Founders
            </a>
          </div>
        </div>
      </section>

      {/* By Team */}
      <section id="by-team" className="py-20 px-8 scroll-mt-24">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">
            By Team
          </p>
          <h2
            className="font-display font-medium text-navy-900 mb-12"
            style={{ fontSize: "clamp(24px,3.5vw,40px)" }}
          >
            Solutions by role
          </h2>
          <div className="flex flex-col gap-16">
            {SOLUTIONS_BY_TEAM.map((sol) => (
              <div key={sol.id} id={sol.id} className="scroll-mt-24">
                <div className="bg-white border border-navy-100/80 rounded-[28px] p-8 md:p-12 mb-6">
                  <h3 className="text-2xl font-semibold text-navy-800 mb-1">
                    {sol.title}
                  </h3>
                  <p className="text-sm font-medium text-violet-500 mb-5">
                    {sol.tagline}
                  </p>
                  <p className="text-[15px] text-navy-500 leading-[1.75] mb-6 max-w-[700px]">
                    {sol.desc}
                  </p>
                  <ul className="flex flex-wrap gap-3 mb-8">
                    {sol.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-[13px] text-violet-700 font-medium"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <SolutionForm solutionTitle={sol.title} solutionId={sol.id} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By Use Case */}
      <section
        id="by-use-case"
        className="py-20 px-8 bg-white border-t border-navy-900/[0.06] scroll-mt-24"
      >
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">
            By Use Case
          </p>
          <h2
            className="font-display font-medium text-navy-900 mb-12"
            style={{ fontSize: "clamp(24px,3.5vw,40px)" }}
          >
            Solutions by situation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOLUTIONS_BY_USE_CASE.map((sol) => (
              <div
                key={sol.id}
                id={sol.id}
                className="bg-cream-50 border border-navy-100/80 rounded-[28px] p-8 scroll-mt-24"
              >
                <h3 className="text-xl font-semibold text-navy-800 mb-1">
                  {sol.title}
                </h3>
                <p className="text-sm font-medium text-violet-500 mb-4">
                  {sol.tagline}
                </p>
                <p className="text-sm text-navy-500 leading-[1.65] mb-5">
                  {sol.desc}
                </p>
                <ul className="flex flex-col gap-2">
                  {sol.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[13px] text-navy-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-16 bg-navy-900 rounded-[28px] p-10 text-center">
            <h3 className="text-[24px] font-display font-medium text-white mb-3">
              Not sure which solution fits?
            </h3>
            <p className="text-white/60 text-[15px] mb-6 max-w-[400px] mx-auto">
              Start with a free trial and explore all communication modes.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/auth/signup"
                className="px-6 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all"
              >
                Start free trial
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white/10 text-white text-[14px] font-medium hover:bg-white/20 transition-all"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
