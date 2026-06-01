"use client";

import { useState } from "react";

export default function HelpCenterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const subject = encodeURIComponent(`[Help Center] ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    );
    window.location.href = `mailto:info@avertune.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 500);
  };

  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Resources
          </p>
          <h1
            className="font-display font-medium text-white mb-4"
            style={{ fontSize: "clamp(28px,4vw,48px)" }}
          >
            Help Center
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7] max-w-[480px]">
            Feel free to ask us anything...
          </p>
        </div>
      </section>

      {/* Topic grid */}
      <section className="py-16 px-8">
        <div className="max-w-[1120px] mx-auto">
          {/* Contact form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <h2 className="text-[22px] font-semibold text-navy-900 mb-3">
                Need help?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg  border border-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4 text-violet-500"
                    >
                      <path
                        d="M2 4h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M2 4l6 5 6-5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-navy-800">
                      Email support
                    </p>
                    <a
                      href="mailto:info@avertune.com"
                      className="text-[13px] text-violet-600 hover:underline"
                    >
                      info@avertune.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4 text-violet-500"
                    >
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M8 5v3.5" strokeLinecap="round" />
                      <circle
                        cx="8"
                        cy="11"
                        r=".6"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-navy-800">
                      Response time
                    </p>
                    <p className="text-[13px] text-navy-500">
                      1–2 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              {submitted ? (
                <div className="bg-violet-50 border border-violet-200 rounded-[24px] p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center mx-auto mb-4">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="w-5 h-5 text-violet-600"
                    >
                      <path d="M2 8l4 4 8-8" />
                    </svg>
                  </div>
                  <p className="text-[18px] font-semibold text-navy-900 mb-2">
                    Message sent!
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your name"
                        className=" bg-white w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="bg-white w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
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
                      placeholder="What do you need help with?"
                      className="bg-white w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Describe your issue or question in detail..."
                      className="bg-white w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] text-navy-800 placeholder:text-navy-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none min-h-[150px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
