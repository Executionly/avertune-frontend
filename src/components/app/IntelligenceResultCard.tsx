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
      className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-gray-600 transition-colors mt-2"
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3 h-3 text-gray-600"
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
    ? pct > 70
      ? "bg-red-500"
      : pct > 40
        ? "bg-amber-500"
        : "bg-green-500"
    : pct > 70
      ? "bg-green-500"
      : pct > 40
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] text-[var(--text-muted)] w-28 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-[var(--text-primary)] w-7 text-right">
        {value}
      </span>
    </div>
  );
}

const RISK_CONFIG = {
  low: {
    label: "Low risk",
    className:
      "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200",
  },
  medium: {
    label: "Medium risk",
    className:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200",
  },
  high: {
    label: "High risk",
    className: "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200",
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

  const getPrimaryMessage = (replyData: any): string => {
    if (replyData?.generated_reply) return replyData.generated_reply;
    if (replyData?.text) return replyData.text;
    if (replyData?.body) return replyData.body;
    return "";
  };

  return (
    <div className="space-y-4 text-[14px] max-w-[640px]">
      {/* Risk and badges */}
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
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 dark:border-gray-700 text-[var(--text-muted)]">
            Tone: {result.scores.toneMatch}
          </span>
        )}
        {capabilityDisplay && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 dark:border-gray-700 text-[var(--text-muted)]">
            {capabilityDisplay}
          </span>
        )}
        {naturalScore != null && naturalScore > 0 && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 dark:border-gray-700 text-[var(--text-muted)]">
            Natural {naturalScore}/100
          </span>
        )}
      </div>

      {modelUsed && (
        <p className="text-[11px] text-[var(--text-muted)]">
          Powered by {modelUsed}
        </p>
      )}

      {/* Question asked */}
      {result.question_asked && (
        <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 py-1">
          <p className="text-[11px] text-[var(--text-muted)] mb-1">
            Your question
          </p>
          <p className="text-[13px] text-[var(--text-primary)] leading-[1.6] italic">
            "{result.question_asked}"
          </p>
        </div>
      )}

      {/* Situation read */}
      {result.situation_read && (
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
            Situation read
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
            {result.situation_read}
          </p>
        </div>
      )}

      {/* Strategic reasoning */}
      {result.strategic_reasoning && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
            Strategic reasoning
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
            {result.strategic_reasoning}
          </p>
        </div>
      )}

      {/* Analysis */}
      {result.analysis && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">
            {result.analysis}
          </p>
        </div>
      )}

      {/* ── Replies with tabs (no Recommended badge) ── */}
      {hasReplies && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-[var(--card-bg)] overflow-hidden">
          {replyKeys.length > 1 && (
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
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
                        ? "border-gray-900 dark:border-gray-100 text-[var(--text-primary)]"
                        : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                    )}
                  >
                    {key.replace(/_/g, " ")}
                  </button>
                );
              })}
            </div>
          )}

          {activeReplyData && (
            <div className="p-4">
              {/* Primary message - generated_reply */}
              {(() => {
                const primaryMsg = getPrimaryMessage(activeReplyData);
                if (primaryMsg) {
                  return (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                      <p className="text-[14px] text-[var(--text-primary)] leading-[1.7] whitespace-pre-wrap">
                        {primaryMsg}
                      </p>
                      <CopyBtn text={primaryMsg} />
                    </div>
                  );
                }
                return null;
              })()}

              {/* Insight / why this works */}
              {activeReplyData.insight && (
                <div className="mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
                    Why this works
                  </p>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                    {activeReplyData.insight}
                  </p>
                </div>
              )}

              {/* Action steps */}
              {(activeReplyData as any).action_steps &&
                (activeReplyData as any).action_steps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
                      Action steps
                    </p>
                    <ol className="space-y-1.5">
                      {(activeReplyData as any).action_steps.map(
                        (step: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]"
                          >
                            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ),
                      )}
                    </ol>
                  </div>
                )}

              {/* What to avoid */}
              {(activeReplyData as any).what_to_avoid &&
                (activeReplyData as any).what_to_avoid.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
                      What to avoid
                    </p>
                    <ul className="space-y-1.5">
                      {(activeReplyData as any).what_to_avoid.map(
                        (item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-[6px]" />
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* Tone profile */}
              {activeReplyData.tone_profile && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
                    Tone profile
                  </p>
                  {(["respect", "warmth", "confidence"] as const).map((k) =>
                    activeReplyData.tone_profile[k] != null ? (
                      <ScoreBar
                        key={k}
                        label={k.charAt(0).toUpperCase() + k.slice(1)}
                        value={activeReplyData.tone_profile[k]}
                      />
                    ) : null,
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Alternative approach ── */}
      {result.alternative && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
            Alternative approach
          </p>
          {result.alternative.advice && (
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6] mb-3">
              {result.alternative.advice}
            </p>
          )}
          {result.alternative.generated_reply && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <p className="text-[13px] text-[var(--text-primary)] leading-[1.6]">
                {result.alternative.generated_reply}
              </p>
              <CopyBtn text={result.alternative.generated_reply} />
            </div>
          )}
          {result.alternative.why_this_works && (
            <p className="text-[12px] text-[var(--text-muted)] mt-2 italic">
              💡 {result.alternative.why_this_works}
            </p>
          )}
          {result.alternative.action_steps &&
            result.alternative.action_steps.length > 0 && (
              <div className="mt-2">
                <p className="text-[11px] text-[var(--text-muted)] mb-1">
                  Action steps
                </p>
                <ul className="space-y-1">
                  {result.alternative.action_steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-1.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* ── Preparation (what_to_know, what_to_gather, timing_guidance) ── */}
      {result.preparation && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Preparation
          </p>
          {result.preparation.what_to_know &&
            result.preparation.what_to_know.length > 0 && (
              <div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">
                  What to know
                </p>
                <ul className="space-y-1">
                  {result.preparation.what_to_know.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-[6px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {result.preparation.what_to_gather &&
            result.preparation.what_to_gather.length > 0 && (
              <div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">
                  What to gather
                </p>
                <ul className="space-y-1">
                  {result.preparation.what_to_gather.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-[6px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {result.preparation.timing_guidance && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
                Timing guidance
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {result.preparation.timing_guidance}
              </p>
            </div>
          )}
          {result.preparation.what_not_to_say &&
            result.preparation.what_not_to_say.length > 0 && (
              <div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">
                  What not to say
                </p>
                <ul className="space-y-1">
                  {result.preparation.what_not_to_say.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.55]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-[6px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* ── Conversation Script ── */}
      {result.conversation_script && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Conversation script
          </p>
          {result.conversation_script.opening && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
                Opening
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {result.conversation_script.opening}
              </p>
            </div>
          )}
          {result.conversation_script.contribution_statement && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
                Contribution statement
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {result.conversation_script.contribution_statement}
              </p>
            </div>
          )}
          {result.conversation_script.the_ask && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
                The ask
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {result.conversation_script.the_ask}
              </p>
            </div>
          )}
          {result.conversation_script.if_they_ask_for_evidence && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
                If they ask for evidence
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {result.conversation_script.if_they_ask_for_evidence}
              </p>
            </div>
          )}
          {result.conversation_script.closing && (
            <div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1">
                Closing
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {result.conversation_script.closing}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Scenario Planning ── */}
      {result.scenario_planning && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Scenario planning
          </p>
          {result.scenario_planning.if_things_go_well && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mb-0.5">
                  If things go well
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_things_go_well}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.if_they_push_back && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mb-0.5">
                  If they push back
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_they_push_back}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.if_things_get_complicated && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mb-0.5">
                  If things get complicated
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_things_get_complicated}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.if_they_say_yes && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mb-0.5">
                  If they say yes
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_they_say_yes}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.if_they_say_not_now && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mb-0.5">
                  If they say not now
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_they_say_not_now}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.if_they_say_budget_is_tight && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mb-0.5">
                  If budget is tight
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_they_say_budget_is_tight}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.if_they_get_defensive && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mb-0.5">
                  If they get defensive
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.if_they_get_defensive}
                </p>
              </div>
            </div>
          )}
          {result.scenario_planning.worst_case && (
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium mb-0.5">
                  Worst case
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {result.scenario_planning.worst_case}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Pushback Scripts ── */}
      {result.pushback_scripts && result.pushback_scripts.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Pushback scripts
          </p>
          {result.pushback_scripts.map((script, i) => (
            <div
              key={i}
              className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 py-1"
            >
              <p className="text-[12px] font-medium text-[var(--text-primary)] mb-1">
                {script.objection}
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                {script.response}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Scores ── */}
      {result.scores &&
        (result.scores.confidence > 0 ||
          result.scores.clarity > 0 ||
          (result.scores.riskScore ?? 0) > 0) && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2.5">
              Scores
            </p>
            {result.scores.confidence && result.scores.confidence > 0 && (
              <ScoreBar label="Confidence" value={result.scores.confidence} />
            )}
            {result.scores.clarity && result.scores.clarity > 0 && (
              <ScoreBar label="Clarity" value={result.scores.clarity} />
            )}
            {result.scores.riskScore && result.scores.riskScore > 0 && (
              <ScoreBar
                label="Risk"
                value={result.scores.riskScore}
                invertColor
              />
            )}
            {result.scores.escalationProbability != null &&
              result.scores.escalationProbability > 0 && (
                <ScoreBar
                  label="Escalation %"
                  value={result.scores.escalationProbability}
                  invertColor
                />
              )}
            {result.scores.relationshipImpact && (
              <div className="flex items-center gap-2.5 pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
                <span className="text-[11px] text-[var(--text-muted)] w-20 flex-shrink-0">
                  Relationship
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full",
                    result.scores.relationshipImpact === "positive"
                      ? "text-green-600 bg-green-50 dark:bg-green-950/30"
                      : result.scores.relationshipImpact === "negative"
                        ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                        : "text-[var(--text-muted)] bg-gray-100 dark:bg-gray-800",
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
        <div className="border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1">
          <p className="text-[11px] text-[var(--text-muted)] mb-0.5">
            Next best action
          </p>
          <p className="text-[13px] text-[var(--text-primary)] font-medium leading-[1.5]">
            {result.next_best_action}
          </p>
        </div>
      )}

      {/* ── Coach note ── */}
      {result.coach_note && (
        <div className="border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1">
          <p className="text-[11px] text-[var(--text-muted)] mb-0.5">
            Coach insight
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
            {result.coach_note}
          </p>
        </div>
      )}

      {/* ── Follow-up suggestions from API (conversation.last_suggested_prompts) ── */}
      {suggestions && suggestions.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] text-[var(--text-muted)] mb-2">
            I can suggest more follow-up questions or actions based on our
            conversation. Just click
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => {
              const cat = suggestionCategories?.[i] ?? "exploration";
              const isAction = cat === "action";
              return (
                <button
                  key={i}
                  onClick={() => onSuggestionClick?.(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12.5px] border transition-all text-left",
                    isAction
                      ? "border-gray-500 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
                      : "border-gray-200 dark:border-gray-700 text-[var(--text-muted)] hover:border-gray-400 hover:text-[var(--text-primary)]",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* ── Outcome reporter ── */}
      {conversationId && (
        <OutcomeReporter
          conversationId={conversationId}
          messageId={messageId ?? conversationId}
          onResponse={onOutcomeResponse}
        />
      )}
    </div>
  );
}
