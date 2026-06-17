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

// ── Panel Heading: number + title + description ──
function PanelHeading({
  stepNumber,
  title,
  description,
}: {
  stepNumber: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {stepNumber}
        </div>
        <div className="w-[2px] flex-1 bg-gray-200 dark:bg-gray-700 min-h-[16px] mt-1" />
      </div>
      <div className="pb-1 pt-0.5">
        <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
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

  // Track step numbers dynamically
  let stepCounter = 0;
  const nextStep = () => ++stepCounter;

  return (
    <div className="space-y-4 text-[14px] max-w-[640px]">
      {/* ── Hero Header ── */}

      {/* ── Situation Read ── */}
      {result.situation_read && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Reading the situation"
            description="Analyzed context, power dynamics, and emotional stakes to understand what's really going on."
          />
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl px-4 py-3">
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
              {result.situation_read}
            </p>
          </div>
        </>
      )}

      {/* ── Strategic Reasoning ── */}
      {result.strategic_reasoning && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Building the strategy"
            description="Based on the situation analysis, this is the best approach to maximize your chance of success."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
              {result.strategic_reasoning}
            </p>
          </div>
        </>
      )}

      {/* ── Analysis ── */}
      {result.analysis && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Deep analysis"
            description="A thorough breakdown of the factors at play and how they influence the recommended approach."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">
              {result.analysis}
            </p>
          </div>
        </>
      )}

      {/* ── The Response ── */}
      {hasReplies && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Crafting your response"
            description=" Generated tailored reply options, each calibrated for different tones and outcomes."
          />
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
                {/* Risk and badges */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium border",
                      risk.className,
                    )}
                  >
                    {risk.label}
                  </span>
                  {result.scores?.toneMatch && (
                    <span className="px-2.5 py-1 text-[11px] font-medium  dark:border-gray-700 text-[var(--text-muted)]">
                      Tone: {result.scores.toneMatch}
                    </span>
                  )}
                  {capabilityDisplay && (
                    <span className="px-2.5 py-1 text-[11px] font-medium  dark:border-gray-700 text-[var(--text-muted)]">
                      {capabilityDisplay}
                    </span>
                  )}
                  {naturalScore != null && naturalScore > 0 && (
                    <span className="px-2.5 py-1 text-[11px] font-medium  dark:border-gray-700 text-[var(--text-muted)]">
                      Human-like response score {naturalScore}/100
                    </span>
                  )}
                </div>

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
                  Array.isArray((activeReplyData as any).action_steps) &&
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
                  Array.isArray((activeReplyData as any).what_to_avoid) &&
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
        </>
      )}

      {/* ── Alternative approach ── */}
      {result.alternative && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Alternative approach"
            description="A different angle if the primary strategy doesn't feel right for your situation."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
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
              Array.isArray(result.alternative.action_steps) &&
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
        </>
      )}

      {/* ── Preparation ── */}
      {result.preparation && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Getting you ready"
            description="Everything you need to know, gather, and avoid before having this conversation."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
            {result.preparation.what_to_know &&
              Array.isArray(result.preparation.what_to_know) &&
              result.preparation.what_to_know.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
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
              Array.isArray(result.preparation.what_to_gather) &&
              result.preparation.what_to_gather.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
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
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  Timing guidance
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {result.preparation.timing_guidance}
                </p>
              </div>
            )}
            {result.preparation.what_not_to_say &&
              Array.isArray(result.preparation.what_not_to_say) &&
              result.preparation.what_not_to_say.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
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
        </>
      )}

      {/* ── Opening Statement ── */}
      {result.opening_statement && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Opening statement"
            description="How to open the conversation with confidence and clarity."
          />
          <div className="border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1">
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
              {result.opening_statement}
            </p>
          </div>
        </>
      )}

      {/* ── Key Talking Points ── */}
      {result.key_talking_points && result.key_talking_points.length > 0 && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Key talking points"
            description="The core points to hit during your conversation."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-2">
            {result.key_talking_points.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── How to Handle Pushback ── */}
      {result.how_to_handle_pushback && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="How to handle pushback"
            description="What to say if they resist, object, or push back."
          />
          <div className="border-l-2 border-amber-400 dark:border-amber-500 pl-3 py-1">
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
              {result.how_to_handle_pushback}
            </p>
          </div>
        </>
      )}

      {/* ── Conversation Script ── */}
      {result.conversation_script && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Conversation script"
            description="A walkthrough of how the conversation might flow, with your key moments highlighted."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
            {result.conversation_script.opening && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  Opening
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {result.conversation_script.opening}
                </p>
              </div>
            )}
            {result.conversation_script.contribution_statement && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  Contribution statement
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {result.conversation_script.contribution_statement}
                </p>
              </div>
            )}
            {result.conversation_script.the_ask && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  The ask
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {result.conversation_script.the_ask}
                </p>
              </div>
            )}
            {result.conversation_script.if_they_ask_for_evidence && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  If they ask for evidence
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {result.conversation_script.if_they_ask_for_evidence}
                </p>
              </div>
            )}
            {result.conversation_script.closing && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  Closing
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {result.conversation_script.closing}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Scenario Planning ── */}
      {result.scenario_planning && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Scenario planning"
            description="Prepare for every possible reaction so nothing catches you off guard."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
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
        </>
      )}

      {/* ── Pushback Scripts ── */}
      {result.pushback_scripts && result.pushback_scripts.length > 0 && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Pushback scripts"
            description="Ready-made responses to common objections you might face."
          />
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-3">
            {result.pushback_scripts.map((script, i) => (
              <div
                key={i}
                className="border-l-2 border-gray-300 dark:border-gray-600 pl-3 py-1"
              >
                <p className="text-[12px] font-medium text-[var(--text-primary)] mb-1">
                  {script.trigger ?? script.objection}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                  {script.response}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── v2.0 Dynamic Sections ── */}
      {(() => {
        type DynamicSection = {
          label: string;
          description: string;
          fields: { key: string; label: string; color?: "green" | "amber" | "red" }[];
          listFields?: string[];
        };

        const DYNAMIC_SECTIONS: Partial<Record<keyof typeof result, DynamicSection>> = {
          objection_analysis: {
            label: "Objection analysis",
            description: "What's really behind the objection and how to counter it.",
            fields: [
              { key: "stated_objection", label: "Stated objection" },
              { key: "real_objection", label: "Real objection" },
              { key: "objection_type", label: "Type" },
              { key: "severity", label: "Severity" },
              { key: "recommended_counter", label: "Recommended counter" },
            ],
          },
          deal_risk: {
            label: "Deal risk",
            description: "Factors that could put this deal at risk and how to mitigate them.",
            fields: [
              { key: "risk_level", label: "Risk level" },
              { key: "risk_mitigation", label: "Mitigation" },
            ],
            listFields: ["risk_factors"],
          },
          negotiation_guidance: {
            label: "Negotiation guidance",
            description: "Strategic moves to strengthen your position.",
            fields: [
              { key: "current_position", label: "Current position" },
              { key: "recommended_move", label: "Recommended move" },
              { key: "what_to_avoid", label: "What to avoid" },
            ],
          },
          follow_up_strategy: {
            label: "Follow-up strategy",
            description: "When, where and how to follow up for the best outcome.",
            fields: [
              { key: "timing", label: "Timing" },
              { key: "channel", label: "Channel" },
              { key: "hook", label: "Hook" },
            ],
          },
          revenue_opportunity: {
            label: "Revenue opportunity",
            description: "Signals and potential for expanding this deal.",
            fields: [
              { key: "deal_stage", label: "Deal stage" },
              { key: "expansion_potential", label: "Expansion potential" },
              { key: "urgency_signal", label: "Urgency signal" },
            ],
          },
          leverage_assessment: {
            label: "Leverage assessment",
            description: "Where the power sits in this negotiation and how to shift it.",
            fields: [
              { key: "user_leverage", label: "Your leverage" },
              { key: "their_leverage", label: "Their leverage" },
              { key: "balance", label: "Balance" },
              { key: "how_to_strengthen", label: "How to strengthen" },
            ],
          },
          concession_analysis: {
            label: "Concession analysis",
            description: "What to trade, what to protect and in what order.",
            fields: [
              { key: "what_to_give", label: "What to give" },
              { key: "what_to_protect", label: "What to protect" },
              { key: "trade_sequence", label: "Trade sequence" },
            ],
          },
          batna: {
            label: "BATNA",
            description: "Your best alternative and theirs — and where to walk away.",
            fields: [
              { key: "user_batna", label: "Your BATNA" },
              { key: "their_batna", label: "Their BATNA" },
              { key: "walk_away_point", label: "Walk-away point" },
            ],
          },
          negotiation_strategy: {
            label: "Negotiation strategy",
            description: "How to open, where to target and how to anchor.",
            fields: [
              { key: "opening_position", label: "Opening position" },
              { key: "target_position", label: "Target position" },
              { key: "anchoring_language", label: "Anchoring language" },
            ],
          },
          team_impact: {
            label: "Team impact",
            description: "How this message lands with your team and what signal it sends.",
            fields: [
              { key: "immediate_impact", label: "Immediate impact" },
              { key: "broader_impact", label: "Broader impact" },
              { key: "tone_signal", label: "Tone signal" },
            ],
          },
          retention_risk: {
            label: "Retention risk",
            description: "Risk indicators and the action needed to keep this person.",
            fields: [
              { key: "risk_level", label: "Risk level" },
              { key: "retention_action", label: "Retention action" },
            ],
            listFields: ["risk_indicators"],
          },
          morale_impact: {
            label: "Morale impact",
            description: "How this affects morale and the path to recovery.",
            fields: [
              { key: "impact", label: "Impact" },
              { key: "affected_parties", label: "Affected parties" },
              { key: "recovery_path", label: "Recovery path" },
            ],
          },
          stakeholder_analysis: {
            label: "Stakeholder analysis",
            description: "Who has skin in the game and what political dynamics to navigate.",
            fields: [
              { key: "primary_stakeholder", label: "Primary stakeholder" },
              { key: "secondary_stakeholders", label: "Secondary stakeholders" },
              { key: "political_considerations", label: "Political considerations" },
            ],
          },
          emotional_insight: {
            label: "Emotional insight",
            description: "The emotional undercurrent on both sides and what needs to be heard.",
            fields: [
              { key: "user_emotional_state", label: "Your state" },
              { key: "other_party_state", label: "Their state" },
              { key: "emotional_gap", label: "Emotional gap" },
              { key: "what_they_need_to_hear", label: "What they need to hear" },
            ],
          },
          relationship_health: {
            label: "Relationship health",
            description: "Current state of the relationship and how to repair it.",
            fields: [
              { key: "current_state", label: "Current state" },
              { key: "primary_stressor", label: "Primary stressor" },
              { key: "repair_path", label: "Repair path" },
            ],
          },
          conflict_drivers: {
            label: "Conflict drivers",
            description: "What's really fuelling this conflict and how to de-escalate.",
            fields: [
              { key: "surface_issue", label: "Surface issue" },
              { key: "root_cause", label: "Root cause" },
              { key: "de_escalation_path", label: "De-escalation path" },
            ],
            listFields: ["escalation_triggers"],
          },
          trust_impact: {
            label: "Trust impact",
            description: "How this message affects trust and what to do to build it.",
            fields: [
              { key: "current_trust_level", label: "Current trust level" },
              { key: "impact_of_message", label: "Impact of message" },
              { key: "trust_building_move", label: "Trust-building move" },
            ],
          },
          candidate_experience: {
            label: "Candidate experience",
            description: "How the candidate perceives this interaction and how to improve it.",
            fields: [
              { key: "current_impression", label: "Current impression" },
              { key: "experience_risk", label: "Experience risk" },
              { key: "improvement", label: "Improvement" },
            ],
          },
          escalation_risk: {
            label: "Escalation risk",
            description: "Triggers that could escalate this and how to prevent it.",
            fields: [
              { key: "risk_level", label: "Risk level" },
              { key: "de_escalation_move", label: "De-escalation move" },
            ],
            listFields: ["escalation_triggers"],
          },
          compliance_considerations: {
            label: "Compliance considerations",
            description: "Language and framing risks to be aware of.",
            fields: [
              { key: "language_to_avoid", label: "Language to avoid" },
              { key: "recommended_framing", label: "Recommended framing" },
            ],
            listFields: ["areas_to_watch"],
          },
          customer_sentiment: {
            label: "Customer sentiment",
            description: "Where the customer's head is at and how to shift it.",
            fields: [
              { key: "current_sentiment", label: "Current sentiment" },
              { key: "sentiment_driver", label: "Sentiment driver" },
              { key: "shift_opportunity", label: "Shift opportunity" },
            ],
          },
          churn_risk: {
            label: "Churn risk",
            description: "Warning signals and the move to keep this customer.",
            fields: [
              { key: "risk_level", label: "Risk level" },
              { key: "retention_move", label: "Retention move" },
            ],
            listFields: ["churn_signals"],
          },
          recovery_strategy: {
            label: "Recovery strategy",
            description: "How to recover trust and what to avoid saying.",
            fields: [
              { key: "recovery_priority", label: "Recovery priority" },
              { key: "message_angle", label: "Message angle" },
              { key: "what_not_to_say", label: "What not to say" },
            ],
          },
        };

        const rendered = (Object.entries(DYNAMIC_SECTIONS) as [keyof typeof result, DynamicSection][])
          .filter(([key]) => result[key] != null)
          .map(([key, section]) => {
            const data = result[key] as Record<string, unknown>;
            const sectionKey = key as string;
            return (
              <div key={sectionKey}>
                <PanelHeading
                  stepNumber={nextStep()}
                  title={section.label}
                  description={section.description}
                />
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-2.5">
                  {section.fields.map(({ key: fk, label }) =>
                    data[fk] ? (
                      <div key={fk} className="flex flex-col gap-0.5">
                        <span className="text-[10.5px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                          {label}
                        </span>
                        <span className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                          {String(data[fk])}
                        </span>
                      </div>
                    ) : null
                  )}
                  {section.listFields?.map((lk) => {
                    const arr = data[lk] as string[] | undefined;
                    if (!arr?.length) return null;
                    return (
                      <div key={lk} className="flex flex-col gap-1">
                        <span className="text-[10.5px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                          {lk.replace(/_/g, " ")}
                        </span>
                        <ul className="space-y-0.5 pl-1">
                          {arr.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0 mt-1.5" />
                              <span className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });

        return rendered.length > 0 ? <>{rendered}</> : null;
      })()}

      {/* ── Scores ── */}
      {(() => {
        // Core known fields already mapped in result.scores
        const KNOWN_SCORING_KEYS = new Set([
          "confidence_score",
          "intent_clarity_score",
          "tone_detected",
          "escalation_probability",
          "risk_score",
          "relationship_impact",
        ]);

        // Adaptive v2.0 scoring keys = whatever the backend sent minus the known ones
        const adaptiveEntries = result.scoring
          ? Object.entries(result.scoring).filter(
              ([k]) => !KNOWN_SCORING_KEYS.has(k),
            )
          : [];

        const hasCore =
          result.scores &&
          (result.scores.confidence > 0 ||
            result.scores.clarity > 0 ||
            (result.scores.riskScore ?? 0) > 0);

        const hasAdaptive = adaptiveEntries.length > 0;

        if (!hasCore && !hasAdaptive) return null;

        return (
          <>
            <PanelHeading
              stepNumber={nextStep()}
              title="Quality analysis"
              description="Evaluation of the strength and safety of this response."
            />
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 space-y-2">
              {/* ── Core scores (always present when scores exist) ── */}
              {hasCore && (
                <>
                  {result.scores!.confidence > 0 && (
                    <ScoreBar label="Confidence" value={result.scores!.confidence} />
                  )}
                  {result.scores!.clarity > 0 && (
                    <ScoreBar label="Clarity" value={result.scores!.clarity} />
                  )}
                  {(result.scores!.riskScore ?? 0) > 0 && (
                    <ScoreBar
                      label="Risk"
                      value={result.scores!.riskScore ?? 0}
                      invertColor
                    />
                  )}
                  {result.scores!.escalationProbability != null &&
                    result.scores!.escalationProbability > 0 && (
                      <ScoreBar
                        label="Escalation %"
                        value={result.scores!.escalationProbability}
                        invertColor
                      />
                    )}
                  {result.scores!.toneMatch && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-[var(--text-muted)] w-20 flex-shrink-0">
                        Tone
                      </span>
                      <span className="text-[11px] font-medium capitalize text-[var(--text-secondary)]">
                        {result.scores!.toneMatch}
                      </span>
                    </div>
                  )}
                  {result.scores!.relationshipImpact && (
                    <div className="flex items-center gap-2.5 pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-[11px] text-[var(--text-muted)] w-20 flex-shrink-0">
                        Relationship
                      </span>
                      <span
                        className={cn(
                          "text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full",
                          result.scores!.relationshipImpact === "positive"
                            ? "text-green-600 bg-green-50 dark:bg-green-950/30"
                            : result.scores!.relationshipImpact === "negative"
                              ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                              : "text-[var(--text-muted)] bg-gray-100 dark:bg-gray-800",
                        )}
                      >
                        {result.scores!.relationshipImpact}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* ── Adaptive v2.0 scoring metrics ── */}
              {hasAdaptive && (
                <div
                  className={cn(
                    "space-y-2",
                    hasCore &&
                      "pt-1 mt-1 border-t border-gray-200 dark:border-gray-700",
                  )}
                >
                  {adaptiveEntries.map(([key, value]) => {
                    const label = key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    if (typeof value === "number") {
                      const isRisk =
                        key.includes("risk") || key.includes("churn");
                      return (
                        <ScoreBar
                          key={key}
                          label={label}
                          value={value}
                          invertColor={isRisk}
                        />
                      );
                    }
                    if (typeof value === "string") {
                      const isNeg =
                        value === "negative" ||
                        value === "high" ||
                        value === "low";
                      const isPos =
                        value === "positive" ||
                        value === "strong" ||
                        value === "good";
                      return (
                        <div key={key} className="flex items-center gap-2.5">
                          <span className="text-[11px] text-[var(--text-muted)] w-28 flex-shrink-0">
                            {label}
                          </span>
                          <span
                            className={cn(
                              "text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full",
                              isPos
                                ? "text-green-600 bg-green-50 dark:bg-green-950/30"
                                : isNeg
                                  ? "text-red-600 bg-red-50 dark:bg-red-950/30"
                                  : "text-[var(--text-muted)] bg-gray-100 dark:bg-gray-800",
                            )}
                          >
                            {value}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* ── Next best action ── */}
      {result.next_best_action && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Next best action"
            description="The single most important thing to do after sending this response."
          />
          <div className="border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1">
            <p className="text-[13px] text-[var(--text-primary)] font-medium leading-[1.5]">
              {result.next_best_action}
            </p>
          </div>
        </>
      )}

      {/* ── Coach note ── */}
      {result.coach_note && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Coach insight"
            description="A final piece of strategic wisdom from your communication coach."
          />
          <div className="border-l-2 border-gray-400 dark:border-gray-500 pl-3 py-1">
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
              {result.coach_note}
            </p>
          </div>
        </>
      )}

      {/* ── Follow-up suggestions ── */}
      {suggestions && suggestions.length > 0 && (
        <>
          <PanelHeading
            stepNumber={nextStep()}
            title="Continue the journey"
            description="Explore deeper strategies or take the next step in our conversation. Click to continue"
          />
          <div className="pt-2">
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
        </>
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
