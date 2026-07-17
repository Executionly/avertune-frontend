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
    full_name: "",
    work_email: "",
    company: "",
    team_size: "",
    looking_for: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        "https://avertuneserver.xyz/api/contact/request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: formData.full_name,
            work_email: formData.work_email,
            company: formData.company,
            team_size: formData.team_size,
            looking_for:
              formData.looking_for || `${solutionTitle} customization request`,
          }),
        },
      );

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

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
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
        <p className="text-lg font-semibold text-gray-900 mb-2">
          Request sent!
        </p>
        <p className="text-sm text-gray-500">
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
          Request customization
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tell us about your needs and we'll get back to you.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full name *
          </label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
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
            value={formData.work_email}
            onChange={(e) =>
              setFormData({ ...formData, work_email: e.target.value })
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
            value={formData.team_size}
            onChange={(e) =>
              setFormData({ ...formData, team_size: e.target.value })
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
          value={formData.looking_for}
          onChange={(e) =>
            setFormData({ ...formData, looking_for: e.target.value })
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
