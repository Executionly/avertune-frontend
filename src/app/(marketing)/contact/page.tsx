"use client";

import { useState } from "react";

const CONTACT_TYPES = [
  { label: "General Support", value: "general" },
  { label: "Billing Support", value: "billing" },
  { label: "Partnerships", value: "partnership" },
  { label: "Affiliate Program", value: "affiliate" },
  { label: "Enterprise Inquiries", value: "enterprise" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          category: formData.category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || "Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Support
          </p>
          <h1
            className="font-display font-medium text-white mb-4"
            style={{ fontSize: "clamp(28px,4vw,48px)" }}
          >
            Contact Us
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7]">
            We're here to help. Fill in the form below and we'll get back to you
            within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-6">
              <h3 className="text-[15px] font-semibold text-navy-900 mb-4">
                Enquiry types
              </h3>
              <ul className="space-y-3">
                {CONTACT_TYPES.map((item) => (
                  <li key={item.value}>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, category: item.value })
                      }
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        formData.category === item.value
                          ? "bg-violet-50 border border-violet-200 text-violet-700"
                          : "text-navy-600 hover:bg-cream-100 border border-transparent"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-6">
              <h3 className="text-[14px] font-semibold text-navy-900 mb-2">
                Email us directly
              </h3>
              <a
                href="mailto:info@avertune.com"
                className="text-[13px] text-violet-600 hover:underline"
              >
                info@avertune.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-[24px] p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-4">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="w-5 h-5 text-green-600"
                  >
                    <path d="M2 8l4 4 8-8" />
                  </svg>
                </div>
                <p className="text-[18px] font-semibold text-navy-900 mb-2">
                  Ticket submitted!
                </p>
                <p className="text-[14px] text-navy-500">
                  We'll get back to you within 1–2 business days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-navy-900/[0.08] rounded-[24px] p-8 space-y-5"
              >
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={7}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none min-h-[160px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[12px] text-navy-400">
                    Enquiry type:{" "}
                    <span className="font-medium text-navy-600">
                      {CONTACT_TYPES.find((t) => t.value === formData.category)
                        ?.label || formData.category}
                    </span>
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
