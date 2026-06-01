"use client";

import { cn } from "@/lib/utils";
import type { ConversationStats } from "@/lib/api/intelligence";

interface SessionIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: ConversationStats | null;
}

function ScoreBar({
  label,
  value,
  color = "bg-violet-500/60",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-[var(--text-secondary)] w-24 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--card-muted-bg)] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-[12px] font-semibold text-[var(--text-primary)] w-6 text-right flex-shrink-0">
        {value}
      </span>
    </div>
  );
}

function CIRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#8b5cf6" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-[var(--card-muted-bg)]"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[15px] font-bold text-[var(--text-primary)]">
          {score}
        </span>
      </div>
    </div>
  );
}

const MODE_COLORS: Record<string, string> = {
  professional: "bg-violet-500",
  sales: "bg-amber-400",
  relationship: "bg-green-500",
};

const EMPTY_STATE = (
  <div className="flex flex-col items-center justify-center py-12 px-4 gap-3 text-center">
    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-4 h-4 text-violet-400"
      >
        <rect x="1" y="10" width="3" height="5" rx="0.5" />
        <rect x="6" y="6" width="3" height="9" rx="0.5" />
        <rect x="11" y="2" width="3" height="13" rx="0.5" />
      </svg>
    </div>
    <div>
      <p className="text-[13px] font-medium text-[var(--text-primary)]">
        No data yet
      </p>
      <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-relaxed">
        Open a conversation to see its intelligence stats here.
      </p>
    </div>
  </div>
);

export function SessionIntelligencePanel({
  isOpen,
  onClose,
  stats,
}: SessionIntelligencePanelProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col bg-[var(--bg-surface)] border-l border-[var(--border-default)] overflow-hidden",
          "transition-[width,opacity] duration-300 ease-in-out",
          "fixed right-0 top-0 h-screen z-40 lg:relative lg:z-auto",
          isOpen ? "w-[280px] opacity-100" : "w-0 opacity-0",
        )}
      >
        <div className="w-[280px] flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border-default)] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-violet-600/80 flex items-center justify-center">
                <svg
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  className="w-2.5 h-2.5"
                >
                  <path d="M5 1v2M5 7v2M1 5h2M7 5h2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">
                Session Intelligence
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--card-muted-bg)] hover:text-[var(--text-primary)] transition-all"
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-3 h-3"
              >
                <path d="M2 2l8 8M10 2L2 10" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto sidebar-scroll">
            {!stats ? (
              EMPTY_STATE
            ) : (
              <>
                {/* CI Score */}
                <div className="px-4 pt-4 pb-4 border-b border-[var(--border-default)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-3">
                    CI Score
                  </p>
                  <div className="flex items-center gap-4">
                    <CIRing score={stats.ci_score} />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Avg risk
                        </span>
                        <span
                          className={cn(
                            "text-[11px] font-semibold",
                            stats.avg_risk_score > 65
                              ? "text-red-400"
                              : stats.avg_risk_score > 35
                                ? "text-amber-400"
                                : "text-emerald-400",
                          )}
                        >
                          {stats.avg_risk_score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Avg clarity
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--text-primary)]">
                          {stats.avg_clarity_score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Confidence
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--text-primary)]">
                          {stats.avg_confidence}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Credits used
                        </span>
                        <span className="text-[11px] font-semibold text-violet-400">
                          {stats.credits_used}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message counts */}
                <div className="px-4 pt-3.5 pb-3.5 border-b border-[var(--border-default)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
                    Messages
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Total", value: stats.message_count.total },
                      { label: "You", value: stats.message_count.user },
                      { label: "AI", value: stats.message_count.assistant },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-lg bg-[var(--card-muted-bg)] px-2 py-2 text-center"
                      >
                        <p className="text-[16px] font-bold text-[var(--text-primary)]">
                          {m.value}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mode breakdown */}
                {Object.keys(stats.mode_breakdown).length > 0 && (
                  <div className="px-4 pt-3.5 pb-3.5 border-b border-[var(--border-default)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
                      Mode breakdown
                    </p>
                    <div className="space-y-2.5">
                      {Object.entries(stats.mode_breakdown).map(
                        ([mode, pct]) => (
                          <div key={mode}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] text-[var(--text-secondary)] capitalize">
                                {mode}
                              </span>
                              <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                                {pct}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[var(--card-muted-bg)] overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  MODE_COLORS[mode] ?? "bg-violet-500",
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Skill scores */}
                <div className="px-4 pt-3.5 pb-3.5 border-b border-[var(--border-default)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
                    Skill scores
                  </p>
                  <div className="space-y-2">
                    <ScoreBar
                      label="Clarity"
                      value={stats.skill_scores.clarity}
                    />
                    <ScoreBar
                      label="Tone control"
                      value={stats.skill_scores.tone_control}
                    />
                    <ScoreBar
                      label="Negotiation"
                      value={stats.skill_scores.negotiation}
                    />
                    <ScoreBar
                      label="Boundaries"
                      value={stats.skill_scores.boundaries}
                    />
                    <ScoreBar
                      label="Relationships"
                      value={stats.skill_scores.relationships}
                    />
                  </div>
                </div>

                {/* Relationship impact */}
                <div className="px-4 pt-3.5 pb-3.5 border-b border-[var(--border-default)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
                    Relationship impact
                  </p>
                  <div className="flex rounded-lg overflow-hidden h-5 gap-px">
                    {stats.relationship_impact.positive > 0 && (
                      <div
                        className="bg-emerald-500 flex items-center justify-center"
                        style={{
                          width: `${stats.relationship_impact.positive}%`,
                        }}
                      >
                        <span className="text-[9px] font-bold text-white">
                          {stats.relationship_impact.positive > 12
                            ? `${stats.relationship_impact.positive}%`
                            : ""}
                        </span>
                      </div>
                    )}
                    {stats.relationship_impact.neutral > 0 && (
                      <div
                        className="bg-[var(--card-muted-bg)] flex items-center justify-center"
                        style={{
                          width: `${stats.relationship_impact.neutral}%`,
                        }}
                      >
                        <span className="text-[9px] font-semibold text-[var(--text-muted)]">
                          {stats.relationship_impact.neutral > 12
                            ? `${stats.relationship_impact.neutral}%`
                            : ""}
                        </span>
                      </div>
                    )}
                    {stats.relationship_impact.negative > 0 && (
                      <div
                        className="bg-red-400 flex items-center justify-center"
                        style={{
                          width: `${stats.relationship_impact.negative}%`,
                        }}
                      >
                        <span className="text-[9px] font-bold text-white">
                          {stats.relationship_impact.negative > 12
                            ? `${stats.relationship_impact.negative}%`
                            : ""}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      Positive
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--card-muted-bg)] border border-[var(--border-default)] inline-block" />
                      Neutral
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                      Negative
                    </span>
                  </div>
                </div>

                {/* Capability breakdown */}
                {Object.keys(stats.capability_breakdown).length > 0 && (
                  <div className="px-4 pt-3.5 pb-3.5 border-b border-[var(--border-default)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
                      Capabilities used
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(stats.capability_breakdown).map(
                        ([cap, count]) => (
                          <span
                            key={cap}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--card-muted-bg)] border border-[var(--card-border)] text-[11px] text-[var(--text-muted)] capitalize"
                          >
                            {cap.replace(/_/g, " ")}
                            <span className="text-[10px] font-semibold text-violet-400">
                              {count}
                            </span>
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {stats.insights && stats.insights.length > 0 && (
                  <div className="px-4 pt-3.5 pb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
                      Insights
                    </p>
                    <div className="space-y-2.5">
                      {stats.insights.map((ins, i) => (
                        <div key={i} className="flex gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-[5px]" />
                          <p className="text-[12.5px] text-[var(--text-secondary)] leading-[1.6]">
                            {ins}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
