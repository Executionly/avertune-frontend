"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getAnalytics } from "@/lib/api/intelligence";

type Period = "daily" | "weekly" | "monthly";

const PERIOD_LABELS: Record<Period, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
};

export default function IntelligenceAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (!token) return;
    setLoading(true);
    getAnalytics(token, period)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [period]);

  const score = data?.communication_score;
  const insights = data?.intelligence_insights;
  const contribution = data?.contribution;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-page)] p-6 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-1">
            Intelligence Analytics
          </h1>
          <p className="text-[13px] text-[var(--text-muted)]">
            How Avertune has contributed to your communication —{" "}
            {PERIOD_LABELS[period].toLowerCase()}
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--card-muted-bg)] border border-[var(--border-default)]">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all capitalize",
                period === p
                  ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 rounded-full border-[3px] border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      ) : !data ? (
        <div className="text-center py-24 text-[var(--text-muted)] text-[14px]">
          No analytics data available for this period.
        </div>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Conversations", value: data.conversations },
              { label: "Messages Analysed", value: data.messages_analysed },
              { label: "Escalations Avoided", value: data.escalations_avoided },
              { label: "Strategic Responses", value: data.strategic_responses },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-5"
              >
                <p className="text-[12px] text-[var(--text-muted)] font-medium mb-3">
                  {stat.label}
                </p>
                <p className="text-[28px] font-bold text-[var(--text-primary)] leading-none">
                  {stat.value ?? "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Communication Score + Insights */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Score card */}
            <div className="md:col-span-1 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-widest mb-4">
                  Communication Score
                </p>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-[56px] font-bold text-[var(--text-primary)] leading-none">
                    {score?.score ?? "—"}
                  </span>
                  {score?.change != null && (
                    <span
                      className={cn(
                        "text-[13px] font-semibold mb-2",
                        score.change >= 0 ? "text-teal-400" : "text-red-400",
                      )}
                    >
                      {score.change >= 0 ? "+" : ""}
                      {score.change}
                    </span>
                  )}
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--card-muted-bg)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${score?.score ?? 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-2">
                  out of {score?.out_of ?? 100}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[var(--border-default)]">
                <p className="text-[12px] text-[var(--text-muted)]">
                  Top mode:{" "}
                  <span className="font-semibold text-[var(--text-primary)] capitalize">
                    {score?.top_mode ?? "—"}
                  </span>
                </p>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">
                  Avg risk level:{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {score?.avg_risk ?? "—"}
                  </span>
                </p>
              </div>
            </div>

            {/* Intelligence Insights */}
            {insights && (
              <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-6">
                <p className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-widest mb-5">
                  Intelligence Insights
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Clarity Score */}
                  <div className="bg-[var(--card-muted-bg)] rounded-xl p-4">
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">
                      Clarity Score
                    </p>
                    <p className="text-[20px] font-bold text-[var(--text-primary)] mb-1">
                      {insights.clarity_score.value}
                      {insights.clarity_score.unit}
                    </p>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        insights.clarity_score.change >= 0
                          ? "text-teal-400"
                          : "text-red-400",
                      )}
                    >
                      {insights.clarity_score.change >= 0 ? "+" : ""}
                      {insights.clarity_score.change}
                      {insights.clarity_score.unit}
                    </span>
                  </div>

                  {/* Tone Consistency */}
                  <div className="bg-[var(--card-muted-bg)] rounded-xl p-4">
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">
                      Tone Consistency
                    </p>
                    <p className="text-[20px] font-bold text-[var(--text-primary)] mb-1">
                      {insights.tone_consistency.value}
                      {insights.tone_consistency.unit}
                    </p>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        insights.tone_consistency.change >= 0
                          ? "text-teal-400"
                          : "text-red-400",
                      )}
                    >
                      {insights.tone_consistency.change >= 0 ? "+" : ""}
                      {insights.tone_consistency.change}
                      {insights.tone_consistency.unit}
                    </span>
                  </div>

                  {/* Escalation Risk */}
                  <div className="bg-[var(--card-muted-bg)] rounded-xl p-4">
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">
                      Escalation Risk
                    </p>
                    <p className="text-[20px] font-bold text-[var(--text-primary)] mb-1">
                      {insights.escalation_risk.label}
                    </p>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        insights.escalation_risk.change <= 0
                          ? "text-teal-400"
                          : "text-red-400",
                      )}
                    >
                      {insights.escalation_risk.flags} flag
                      {insights.escalation_risk.flags !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Response Confidence */}
                  <div className="bg-[var(--card-muted-bg)] rounded-xl p-4">
                    <p className="text-[11px] text-[var(--text-muted)] mb-2">
                      Response Confidence
                    </p>
                    <p className="text-[20px] font-bold text-[var(--text-primary)] mb-1">
                      {insights.response_confidence.value}
                      {insights.response_confidence.unit}
                    </p>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        insights.response_confidence.change >= 0
                          ? "text-teal-400"
                          : "text-red-400",
                      )}
                    >
                      {insights.response_confidence.change >= 0 ? "+" : ""}
                      {insights.response_confidence.change}
                      {insights.response_confidence.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Platform contribution summary */}
          {contribution && (
            <div className="mt-6 bg-gradient-to-br from-violet-600 to-navy-800 rounded-2xl p-6 text-white">
              <p className="text-[12px] font-medium uppercase tracking-widest text-violet-200 mb-3">
                Avertune&apos;s Contribution — {PERIOD_LABELS[period]}
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[22px] font-bold text-white mb-1">
                    {contribution.messages_guided}/{contribution.messages_total}
                  </p>
                  <p className="text-[11px] text-violet-200 leading-snug">
                    Messages guided strategically
                  </p>
                </div>
                <div>
                  <p className="text-[22px] font-bold text-white mb-1">
                    {contribution.escalations_avoided}
                  </p>
                  <p className="text-[11px] text-violet-200 leading-snug">
                    Escalations helped you avoid
                  </p>
                </div>
                <div>
                  <p className="text-[22px] font-bold text-white mb-1">
                    {contribution.score_improvement} pts
                  </p>
                  <p className="text-[11px] text-violet-200 leading-snug">
                    Score improvement
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
