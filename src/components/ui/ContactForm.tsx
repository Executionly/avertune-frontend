// FILE: src/components/ui/ContactForm.tsx
"use client";

import { useState } from "react";

const CONTACT_TYPES = [
  { label: "General Support", value: "General Support" },
  { label: "Billing Support", value: "Billing Support" },
  { label: "Partnerships", value: "Partnerships" },
  { label: "Affiliate Program", value: "Affiliate Program" },
  { label: "Enterprise Inquiries", value: "Enterprise Inquiries" },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "General Support",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const subjectLine = encodeURIComponent(
      `[${formData.type}] ${formData.subject}`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nType: ${formData.type}\n\nMessage:\n${formData.message}`,
    );

    window.location.href = `mailto:info@avertune.com?subject=${subjectLine}&body=${body}`;

    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-5 h-5 text-green-600 dark:text-green-400"
          >
            <path d="M2 8l4 4 8-8" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Message sent!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We'll get back to you within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="jane@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Enquiry type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-[#1c1c1c]"
          >
            {CONTACT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Subject *
          </label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            placeholder="What's this about?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Message *
        </label>
        <textarea
          required
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Tell us how we can help..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none min-h-[160px] bg-white dark:bg-transparent"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Enquiry type:{" "}
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {formData.type}
          </span>
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
