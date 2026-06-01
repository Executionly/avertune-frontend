// FILE: src/components/ui/SolutionRequestForm.tsx
"use client";

import { useState } from "react";

interface SolutionRequestFormProps {
  solutionTitle: string;
  solutionId: string;
  compact?: boolean;
}

export function SolutionRequestForm({
  solutionTitle,
  solutionId,
  compact = false,
}: SolutionRequestFormProps) {
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

    const subject = encodeURIComponent(
      `${solutionTitle} - Customisation Request`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nTeam Size: ${formData.teamSize}\n\nMessage:\n${formData.message}`,
    );

    // For now, use mailto. Can be replaced with API endpoint later.
    window.location.href = `mailto:info@avertune.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-5 h-5 text-violet-600 dark:text-violet-400"
          >
            <path d="M2 8l4 4 8-8" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Request sent!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Our team will get back to you within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/[0.08] rounded-2xl ${compact ? "p-6" : "p-8"} space-y-5`}
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Request customisation
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tell us about your needs and we'll get back to you.
        </p>
      </div>

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
            Work email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="jane@company.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Company / Organisation
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Team size
          </label>
          <select
            value={formData.teamSize}
            onChange={(e) =>
              setFormData({ ...formData, teamSize: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all bg-white dark:bg-[#1c1c1c]"
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          What are you looking for? *
        </label>
        <textarea
          required
          rows={compact ? 4 : 5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder={`Tell us about your ${solutionTitle} needs, current challenges, and what you'd like Avertune to help with...`}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.1] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none min-h-[120px] bg-white dark:bg-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
