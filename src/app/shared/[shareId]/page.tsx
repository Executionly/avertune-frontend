"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getSharedConversation,
  type SharedConversationResponse,
} from "@/lib/api/intelligence";

// ── Helper: Parse assistant content JSON ────────────────────────────────────

function parseIntelligence(content: string): Record<string, any> | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// ── Components ──────────────────────────────────────────────────────────────

function ScoreBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--card-muted-bg)] border border-[var(--card-border)]">
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-[11px] text-[var(--text-muted)]">{label}</span>
      <span className="text-[11px] font-semibold text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}

function UserBubble({ message }: { message: any }) {
  return (
    <div className="self-end max-w-[85%]">
      <div className="rounded-2xl px-4 py-3 bg-violet-600 text-white text-[14px] leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>
      {message.created_at && (
        <p className="text-[10px] text-[var(--text-muted)] text-right mt-1">
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}

function AssistantBubble({ message }: { message: any }) {
  // Try parsed intelligence object first, then parse content JSON string
  const intel = message.intelligence || parseIntelligence(message.content);
  const scoring = message.scoring || intel?.scoring;

  return (
    <div className="self-start max-w-[90%] w-full">
      {/* Scoring badges */}
      {scoring && (
        <div className="flex flex-wrap gap-2 mb-2">
          <ScoreBadge
            label="Risk"
            value={`${scoring.risk_score}%`}
            color={
              scoring.risk_score > 60
                ? "bg-red-400"
                : scoring.risk_score > 30
                  ? "bg-amber-400"
                  : "bg-emerald-400"
            }
          />
          <ScoreBadge
            label="Confidence"
            value={`${scoring.confidence_score}%`}
            color="bg-violet-400"
          />
          <ScoreBadge
            label="Clarity"
            value={`${scoring.intent_clarity_score}%`}
            color="bg-teal-400"
          />
          {scoring.tone_detected && (
            <ScoreBadge
              label="Tone"
              value={scoring.tone_detected}
              color="bg-blue-400"
            />
          )}
          {scoring.relationship_impact && (
            <ScoreBadge
              label="Impact"
              value={scoring.relationship_impact}
              color={
                scoring.relationship_impact === "positive"
                  ? "bg-emerald-400"
                  : scoring.relationship_impact === "negative"
                    ? "bg-red-400"
                    : "bg-gray-400"
              }
            />
          )}
        </div>
      )}

      <div className="rounded-2xl px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-default)] text-[var(--text-primary)] text-[14px] leading-relaxed space-y-4">
        {/* Situation Read */}
        {intel?.situation_read && (
          <div className="border-l-2 border-violet-400/40 pl-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-400 mb-1">
              Situation
            </p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
              {intel.situation_read}
            </p>
          </div>
        )}

        {/* Question */}
        {intel?.question_asked && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
              Question
            </p>
            <p className="text-[13px] text-[var(--text-primary)] font-medium leading-[1.6]">
              {intel.question_asked}
            </p>
          </div>
        )}

        {/* Strategy */}
        {intel?.strategic_reasoning && (
          <div className="border-l-2 border-teal-400/40 pl-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-400 mb-1">
              Strategy
            </p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
              {intel.strategic_reasoning}
            </p>
          </div>
        )}

        {/* Answer */}
        {intel?.answer && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
              Answer
            </p>
            <p className="text-[13px] text-[var(--text-primary)] leading-[1.7]">
              {intel.answer}
            </p>
          </div>
        )}

        {/* Recommended */}
        {intel?.recommended && (
          <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <p className="text-[12px] font-semibold text-violet-400 uppercase tracking-wide">
                {intel.recommended.label}
              </p>
            </div>
            <p className="text-[13px] text-[var(--text-primary)] leading-[1.7] mb-3">
              {intel.recommended.advice}
            </p>
            <p className="text-[12px] text-[var(--text-muted)] mb-2">
              <span className="font-medium text-[var(--text-secondary)]">
                Approach:
              </span>{" "}
              {intel.recommended.approach}
            </p>

            {intel.recommended.generated_reply && (
              <div className="bg-[var(--card-bg)] rounded-lg p-3 border border-[var(--border-default)] mb-3">
                <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  Generated Reply
                </p>
                <p className="text-[13px] text-[var(--text-primary)] italic leading-[1.6]">
                  &ldquo;{intel.recommended.generated_reply}&rdquo;
                </p>
              </div>
            )}

            {intel.recommended.action_steps?.length > 0 && (
              <div className="mb-2">
                <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  Action Steps
                </p>
                <ol className="space-y-1">
                  {intel.recommended.action_steps.map(
                    (step: string, i: number) => (
                      <li
                        key={i}
                        className="text-[12px] text-[var(--text-secondary)] flex gap-2"
                      >
                        <span className="text-violet-400 font-semibold flex-shrink-0">
                          {i + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ),
                  )}
                </ol>
              </div>
            )}

            {intel.recommended.what_to_avoid?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-red-400/80 mb-1">
                  What to Avoid
                </p>
                <ul className="space-y-1">
                  {intel.recommended.what_to_avoid.map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="text-[12px] text-red-400/70 flex gap-2"
                      >
                        <span className="flex-shrink-0">×</span>
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-[var(--text-muted)] mt-3 pt-2 border-t border-[var(--border-default)]">
              <span className="font-medium">Why this works:</span>{" "}
              {intel.recommended.why_this_works}
            </p>
          </div>
        )}

        {/* Alternative */}
        {intel?.alternative && (
          <div className="bg-[var(--card-muted-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <p className="text-[12px] font-semibold text-amber-400 uppercase tracking-wide">
                {intel.alternative.label}
              </p>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6] mb-2">
              {intel.alternative.advice}
            </p>
            {intel.alternative.generated_reply && (
              <div className="bg-[var(--card-bg)] rounded-lg p-3 border border-[var(--border-default)]">
                <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  Generated Reply
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] italic leading-[1.6]">
                  &ldquo;{intel.alternative.generated_reply}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Best Action */}
        {intel?.next_best_action && (
          <div className="border-l-2 border-emerald-400/40 pl-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400 mb-1">
              Next Best Action
            </p>
            <p className="text-[13px] text-[var(--text-primary)] font-medium leading-[1.6]">
              {intel.next_best_action}
            </p>
          </div>
        )}

        {/* Fallback raw content */}
        {!intel?.situation_read && !intel?.answer && (
          <p className="text-[14px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mt-1.5">
        {message.model_used && (
          <span className="text-[10px] text-[var(--text-muted)]">
            {message.model_used}
          </span>
        )}
        {message.credits_used > 0 && (
          <span className="text-[10px] text-violet-400/70">
            {message.credits_used} credits
          </span>
        )}
        {message.created_at && (
          <span className="text-[10px] text-[var(--text-muted)]">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function SharedConversationPage() {
  const params = useParams();
  const shareId = String(params?.shareId ?? "");

  const [data, setData] = useState<SharedConversationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) return;
    (async () => {
      try {
        const res = await getSharedConversation(shareId);
        // Handle both old flat format and new nested format
        const normalized = normalizeResponse(res);
        setData(normalized);
      } catch (err) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "This shared link doesn't exist or has been removed.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [shareId]);

  return (
    <div className="min-h-screen bg-[var(--page-bg,#0a0a0c)] flex flex-col">
      <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--border-default)] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src="/logo-icon.png"
            alt="Avertune"
            className="w-8 h-8 object-contain"
          />
        </div>
        <a
          href="/"
          className="h-8 px-3.5 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors flex items-center"
        >
          Try Avertune
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[720px]">
          {isLoading && (
            <div className="flex flex-col gap-3 mt-10">
              <div className="h-5 w-1/2 rounded bg-[var(--card-muted-bg)] animate-pulse" />
              <div className="h-20 w-full rounded-2xl bg-[var(--card-muted-bg)] animate-pulse" />
              <div className="h-20 w-3/4 rounded-2xl bg-[var(--card-muted-bg)] animate-pulse ml-auto" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center text-center mt-20">
              <div className="w-12 h-12 rounded-full bg-[var(--card-muted-bg)] border border-[var(--border-default)] flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="w-5 h-5 text-[var(--text-muted)]"
                >
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
                Link unavailable
              </h1>
              <p className="text-[13px] text-[var(--text-muted)] max-w-[320px]">
                {error}
              </p>
            </div>
          )}

          {!isLoading && !error && data && (
            <>
              <div className="mb-6 pb-4 border-b border-[var(--border-default)]">
                <h1 className="text-[18px] font-semibold text-[var(--text-primary)] mb-2">
                  {data.title || "Shared conversation"}
                </h1>
                <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] flex-wrap">
                  {data.mode && (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--card-muted-bg)] border border-[var(--card-border)] capitalize">
                      {data.mode}
                    </span>
                  )}
                  {data.created_at && (
                    <span>
                      {new Date(data.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {data.shared_by && <span>· Shared by {data.shared_by}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {data.messages.map((m, i) =>
                  m.role === "user" ? (
                    <UserBubble key={i} message={m} />
                  ) : (
                    <AssistantBubble key={i} message={m} />
                  ),
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-[var(--border-default)] flex flex-col items-center text-center gap-3">
                <p className="text-[13px] text-[var(--text-muted)]">
                  This is a read-only view. Start your own conversation with
                  Avertune.
                </p>
                <a
                  href="/"
                  className="h-9 px-5 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors inline-flex items-center"
                >
                  Get started free
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Normalize API response ──────────────────────────────────────────────────
// Handles both old flat format and new nested format

function normalizeResponse(res: any): SharedConversationResponse {
  // Already in expected format (old flat format)
  if (res.title !== undefined || res.is_revoked !== undefined) {
    return res;
  }
  // New nested format: { conversation, messages, snapshotted_at, shared_at }
  if (res.conversation) {
    return {
      title: "Shared conversation",
      mode: res.conversation.mode,
      messages: res.messages || [],
      created_at: res.conversation.created_at,
      shared_by: undefined,
      is_revoked: false,
    };
  }
  return res;
}
