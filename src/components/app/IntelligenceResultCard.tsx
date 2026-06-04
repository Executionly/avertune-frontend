"use client";

import { useState } from "react";
import type { IntelligenceResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OutcomeReporter } from "./OutcomeReporter";

interface Props {
  result: IntelligenceResult;
  suggestions?: string[];
  onSuggestionClick?: (s: string) => void;
  conversationId?: string;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        })
      }
      className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-violet-400 transition-colors mt-2"
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3 h-3 text-violet-500"
          >
            <path
              d="M2 6l3 3 5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="w-3 h-3"
          >
            <rect x="4" y="1" width="7" height="8" rx="1" />
            <path
              d="M2 3.5H1.5A.5.5 0 001 4v6.5a.5.5 0 00.5.5H7a.5.5 0 00.5-.5V10"
              strokeLinecap="round"
            />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// Scores bar
function ScoreBar({
  label,
  value,
  max = 100,
  invertColor = false,
}: {
  label: string;
  value: number;
  max?: number;
  invertColor?: boolean;
}) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const color = invertColor
    ? pct > 70 ? "bg-red-400" : pct > 40 ? "bg-amber-400" : "bg-emerald-500"
    : pct > 70 ? "bg-emerald-500" : pct > 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] text-[var(--text-muted)] w-20 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--card-border)]">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-[var(--text-muted)] w-7 text-right">
        {value}
      </span>
    </div>
  );
}

const RISK_CONFIG = {
  low: {
    label: "Low risk",
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  medium: {
    label: "Medium risk",
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  high: {
    label: "High risk",
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

export function IntelligenceResultCard({
  result,
  suggestions = [],
  onSuggestionClick,
  conversationId,
}: Props) {
  const [activeReply, setActiveReply] = useState<string | null>(null);

  // Build ordered reply list — keep recommended first
  const replyKeys: string[] = result.replies
    ? [
        ...(result.recommended && result.replies[result.recommended]
          ? [result.recommended]
          : []),
        ...Object.keys(result.replies).filter((k) => k !== result.recommended),
      ]
    : [];

  const hasReplies = replyKeys.length > 0;
  const defaultActive =
    activeReply ?? result.recommended ?? replyKeys[0] ?? null;
  const activeReplyData =
    defaultActive && result.replies ? result.replies[defaultActive] : null;

  const risk = RISK_CONFIG[result.riskLevel ?? "low"];

  return (
    <div className="space-y-3 text-[14px] max-w-[640px]">
      {/* ── Header row: risk badge + scores ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-[11px] font-medium border",
            risk.className,
          )}
        >
          {risk.label}
        </span>
        {result.scores?.toneMatch && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-[var(--card-border)] text-[var(--text-muted)]">
            Tone: {result.scores.toneMatch}
          </span>
        )}
        {result.scores?.escalationRisk &&
          result.scores.escalationRisk !== "low" && (
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium border",
                result.scores.escalationRisk === "high"
                  ? "text-red-400 bg-red-400/10 border-red-400/20"
                  : "text-amber-400 bg-amber-400/10 border-amber-400/20",
              )}
            >
              Escalation: {result.scores.escalationRisk}
            </span>
          )}
      </div>

      {/* ── Situation read ── */}
      {result.situation_read && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-violet-400 mb-1.5">
            Situation read
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
            {result.situation_read}
          </p>
        </div>
      )}

      {/* ── Analysis + Strategy (if present) ── */}
      {(result.analysis || result.strategy) && (
        <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-4 space-y-3">
          {result.analysis && (
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.7]">
              {result.analysis}
            </p>
          )}
          {result.strategy && (
            <div
              className={
                result.analysis
                  ? "border-t border-[var(--card-border)] pt-3"
                  : ""
              }
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-violet-400 mb-1.5">
                Strategy
              </p>
              <p className="text-[13.5px] text-[var(--text-primary)] leading-[1.65]">
                {result.strategy}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Replies — tab strip + active panel ── */}
      {hasReplies && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
          {/* Tab strip */}
          {replyKeys.length > 1 && (
            <div className="flex border-b border-[var(--card-border)] overflow-x-auto">
              {replyKeys.map((key) => {
                const isActive =
                  (activeReply ?? result.recommended ?? replyKeys[0]) === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveReply(key)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2.5 text-[12px] font-medium border-b-2 transition-all capitalize",
                      isActive
                        ? "border-violet-500 text-violet-400"
                        : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {key.replace(/_/g, " ")}
                    {key === result.recommended && (
                      <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded-full bg-violet-500/15 text-violet-400">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active reply body */}
          {activeReplyData && (
            <div className="p-4">
              {/* subject line for email variants */}
              {(activeReplyData as any).subject && (
                <div className="flex items-start gap-2 mb-3 pb-3 border-b border-[var(--card-border)]">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mt-0.5 w-12 flex-shrink-0">
                    Subject
                  </span>
                  <span className="text-[13px] text-[var(--text-primary)]">
                    {(activeReplyData as any).subject}
                  </span>
                </div>
              )}
              <p className="text-[13.5px] text-[var(--text-primary)] leading-[1.7] whitespace-pre-wrap">
                {activeReplyData.text ?? (activeReplyData as any).body}
              </p>
              {activeReplyData.insight && (
                <p className="text-[12px] text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--card-border)] leading-[1.55]">
                  💡 {activeReplyData.insight}
                </p>
              )}
              <CopyBtn
                text={
                  activeReplyData.text ?? (activeReplyData as any).body ?? ""
                }
              />
            </div>
          )}
        </div>
      )}

      {/* ── Scoring bars ── */}
      {result.scores &&
        (result.scores.confidence > 0 || result.scores.clarity > 0 || (result.scores.riskScore ?? 0) > 0) && (
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2.5">
              Scores
            </p>
            {result.scores.confidence > 0 && (
              <ScoreBar label="Confidence" value={result.scores.confidence} />
            )}
            {result.scores.clarity > 0 && (
              <ScoreBar label="Clarity" value={result.scores.clarity} />
            )}
            {(result.scores.riskScore ?? 0) > 0 && (
              <ScoreBar
                label="Risk"
                value={result.scores.riskScore!}
                invertColor
              />
            )}
            {result.scores.escalationProbability != null && result.scores.escalationProbability > 0 && (
              <ScoreBar
                label="Escalation %"
                value={result.scores.escalationProbability}
                invertColor
              />
            )}
            {result.scores.relationshipImpact && (
              <div className="flex items-center gap-2.5 pt-1 mt-1 border-t border-[var(--card-border)]">
                <span className="text-[11px] text-[var(--text-muted)] w-20 flex-shrink-0">
                  Relationship
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full",
                    result.scores.relationshipImpact === "positive"
                      ? "text-emerald-400 bg-emerald-400/10"
                      : result.scores.relationshipImpact === "negative"
                        ? "text-red-400 bg-red-400/10"
                        : "text-[var(--text-muted)] bg-[var(--card-muted-bg)]",
                  )}
                >
                  {result.scores.relationshipImpact}
                </span>
              </div>
            )}
          </div>
        )}

      {/* ── Next best action ── */}
      {result.next_best_action && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-1.5">
            Next step
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
            {result.next_best_action}
          </p>
        </div>
      )}

      {/* ── Coach note (Pro) ── */}
      {result.coach_note && (
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.05] px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="w-3 h-3 text-teal-400"
            >
              <circle cx="7" cy="7" r="5.5" />
              <path d="M7 4v3.5" strokeLinecap="round" />
              <circle
                cx="7"
                cy="9.5"
                r=".5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-teal-400">
              Coach insight
            </p>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
            {result.coach_note}
          </p>
        </div>
      )}

      {/* ── Outcome reporter ── */}
      {conversationId && <OutcomeReporter conversationId={conversationId} />}

      {/* ── Follow-up suggestions ── */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick?.(s)}
              className="px-3 py-1.5 rounded-full text-[12.5px] bg-[var(--card-bg)] border border-[var(--card-border)]
                text-[var(--text-muted)] hover:border-violet-400/60 hover:text-[var(--text-primary)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
