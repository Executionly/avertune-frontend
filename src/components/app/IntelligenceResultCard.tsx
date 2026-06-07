"use client";

import { useState } from "react";
import type { IntelligenceResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OutcomeReporter } from "./OutcomeReporter";

interface Props {
  result: IntelligenceResult;
  suggestions?: string[];
  suggestionCategories?: string[];
  onSuggestionClick?: (s: string) => void;
  conversationId?: string;
  messageId?: string;
  capabilityDisplay?: string;
  modelUsed?: string;
  naturalScore?: number;
  onOutcomeResponse?: (text: string) => void;
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
  suggestionCategories = [],
  onSuggestionClick,
  conversationId,
  messageId,
  capabilityDisplay,
  modelUsed,
  naturalScore,
  onOutcomeResponse,
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

      {/* ── Degraded / preview plan ── */}
      {result.is_degraded && (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 overflow-hidden">
          {/* Preview badge */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-amber-500/15">
            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-400/15 text-amber-400 border border-amber-400/25 uppercase tracking-wide">
              Preview
            </span>
            <span className="text-[12px] text-[var(--text-muted)]">
              Limited response — upgrade to unlock full analysis
            </span>
          </div>

          <div className="px-4 py-3 space-y-3">
            {/* Situation read */}
            {result.situation_read && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-1">
                  Situation read
                </p>
                <p className="text-[13.5px] text-[var(--text-primary)] leading-[1.65]">
                  {result.situation_read}
                </p>
              </div>
            )}

            {/* Advice */}
            {result.replies?.advice?.insight && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-1">
                  Basic advice
                </p>
                <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.65]">
                  {result.replies.advice.insight}
                </p>
              </div>
            )}

            {/* Suggested message */}
            {result.replies?.advice?.text && (
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2">
                  Suggested message
                </p>
                <p className="text-[13.5px] text-[var(--text-primary)] leading-[1.7] whitespace-pre-wrap">
                  {result.replies.advice.text}
                </p>
                <CopyBtn text={result.replies.advice.text} />
              </div>
            )}

            {/* Next best action */}
            {result.next_best_action && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-violet-500/8 border border-violet-500/20">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5">
                  <path d="M7 1v6l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="7" r="6" />
                </svg>
                <p className="text-[12.5px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.next_best_action}
                </p>
              </div>
            )}
          </div>

          {/* Locked features + upgrade CTA */}
          {result.upgrade_message && (
            <div className="px-4 pb-4 space-y-3">
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-muted-bg)] p-3">
                <p className="text-[12px] text-[var(--text-muted)] leading-[1.55] mb-2">
                  {result.upgrade_message}
                </p>
                {result.locked_features && result.locked_features.length > 0 && (
                  <ul className="space-y-1">
                    {result.locked_features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-2.5 h-2.5 text-violet-400/60 flex-shrink-0">
                          <rect x="2" y="4.5" width="6" height="4.5" rx=".8" />
                          <path d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5" strokeLinecap="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {result.available_plans && result.available_plans.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {result.available_plans.map((plan) => (
                    <div key={plan.name} className="flex-1 min-w-[120px] rounded-xl border border-violet-500/30 bg-violet-500/8 px-3 py-2">
                      <p className="text-[12px] font-semibold text-violet-400">{plan.name}</p>
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{plan.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Normal (non-degraded) card body ── */}
      {!result.is_degraded && (<>
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
        {capabilityDisplay && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-violet-500/30 text-violet-400 bg-violet-500/8">
            {capabilityDisplay}
          </span>
        )}
        {naturalScore != null && naturalScore > 0 && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-teal-500/30 text-teal-400 bg-teal-500/8">
            Natural {naturalScore}/100
          </span>
        )}
      </div>
      {modelUsed && (
        <p className="text-[11px] text-[var(--text-muted)] px-0.5">
          Powered by {modelUsed}
        </p>
      )}

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
              {/* Main text / advice */}
              {(activeReplyData.text ?? (activeReplyData as any).body) && (
                <p className="text-[13.5px] text-[var(--text-primary)] leading-[1.7] whitespace-pre-wrap">
                  {activeReplyData.text ?? (activeReplyData as any).body}
                </p>
              )}
              {/* Action steps */}
              {(activeReplyData as any).action_steps?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2">
                    Action steps
                  </p>
                  <ol className="space-y-1.5">
                    {(activeReplyData as any).action_steps.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                        <span className="w-4 h-4 rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {/* What to avoid */}
              {(activeReplyData as any).what_to_avoid?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--card-border)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2">
                    What to avoid
                  </p>
                  <ul className="space-y-1.5">
                    {(activeReplyData as any).what_to_avoid.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0 mt-[6px]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Insight */}
              {activeReplyData.insight && (
                <p className="text-[12px] text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--card-border)] leading-[1.55]">
                  💡 {activeReplyData.insight}
                </p>
              )}
              {/* Tone profile */}
              {activeReplyData.tone_profile && (
                <div className="mt-3 pt-3 border-t border-[var(--card-border)] space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)] mb-2">
                    Tone profile
                  </p>
                  {(["respect", "warmth", "confidence"] as const).map((k) =>
                    activeReplyData.tone_profile[k] != null ? (
                      <ScoreBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={activeReplyData.tone_profile[k]} />
                    ) : null
                  )}
                </div>
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

      {/* ── Scenario planning ── */}
      {result.scenario_planning &&
        (result.scenario_planning.if_things_go_well ||
          result.scenario_planning.if_things_get_complicated ||
          result.scenario_planning.worst_case) && (
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">
              Scenario planning
            </p>
            {result.scenario_planning.if_things_go_well && (
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-[5px]" />
                <div>
                  <p className="text-[11px] text-emerald-400 font-medium mb-0.5">If things go well</p>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                    {result.scenario_planning.if_things_go_well}
                  </p>
                </div>
              </div>
            )}
            {result.scenario_planning.if_things_get_complicated && (
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-[5px]" />
                <div>
                  <p className="text-[11px] text-amber-400 font-medium mb-0.5">If things get complicated</p>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                    {result.scenario_planning.if_things_get_complicated}
                  </p>
                </div>
              </div>
            )}
            {result.scenario_planning.worst_case && (
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-[5px]" />
                <div>
                  <p className="text-[11px] text-red-400 font-medium mb-0.5">Worst case</p>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                    {result.scenario_planning.worst_case}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      {/* ── Capability-specific extra fields ── */}
      {(result.meeting_strategy || result.opening_statement || result.key_talking_points?.length || result.how_to_handle_pushback ||
        result.preparation_strategy || result.questions_to_ask_interviewer?.length ||
        result.outreach_angle || result.power_dynamic || result.subject_lines?.length) && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text-muted)]">
            Strategy details
          </p>
          {result.meeting_strategy && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">Meeting strategy</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{result.meeting_strategy}</p>
            </div>
          )}
          {result.opening_statement && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">Opening statement</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{result.opening_statement}</p>
            </div>
          )}
          {result.key_talking_points && result.key_talking_points.length > 0 && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">Key talking points</p>
              <ol className="space-y-1.5">
                {result.key_talking_points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                    <span className="w-4 h-4 rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {pt}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {result.how_to_handle_pushback && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">Handling pushback</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{result.how_to_handle_pushback}</p>
            </div>
          )}
          {result.preparation_strategy && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">Preparation strategy</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{result.preparation_strategy}</p>
            </div>
          )}
          {result.questions_to_ask_interviewer && result.questions_to_ask_interviewer.length > 0 && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">Questions to ask</p>
              <ul className="space-y-1">
                {result.questions_to_ask_interviewer.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 flex-shrink-0 mt-[6px]" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.outreach_angle && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">Outreach angle</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{result.outreach_angle}</p>
            </div>
          )}
          {result.power_dynamic && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">Power dynamic</p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{result.power_dynamic}</p>
            </div>
          )}
          {result.subject_lines && result.subject_lines.length > 0 && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">Subject line options</p>
              <ul className="space-y-1">
                {result.subject_lines.map((s, i) => (
                  <li key={i} className="text-[13px] text-[var(--text-secondary)] px-3 py-1.5 rounded-lg bg-[var(--card-muted-bg)] border border-[var(--card-border)]">{s}</li>
                ))}
              </ul>
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

      {/* ── Outcome reporter — always shown on generate messages ── */}
      {!result.is_degraded && null}
      </>)}
      {conversationId && (
        <OutcomeReporter
          conversationId={conversationId}
          messageId={messageId ?? conversationId}
          onResponse={onOutcomeResponse}
        />
      )}

      {/* ── Follow-up suggestions ── */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {suggestions.map((s, i) => {
            const cat = suggestionCategories[i] ?? "exploration";
            const isAction = cat === "action";
            return (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12.5px] border transition-all text-left",
                  isAction
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 font-medium"
                    : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-violet-400/60 hover:text-[var(--text-primary)]",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
