"use client";

import { useRef, useEffect, useState } from "react";
import { formatTime, cn } from "@/lib/utils";
import { IntelligenceResultCard } from "./IntelligenceResultCard";
import { ModeSampleDropdown } from "./ModeSampleDropdown";
import type { ChatMessage, ModeId } from "@/lib/types";
import { OutcomeResponseDisplay } from "./OutcomeResponseDisplay";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingPhase?: "idle" | "thinking" | "receiving";
  detectedCapability?: string;
  loadingConversation?: boolean;
  onSuggestionClick?: (s: string) => void;
  onPasteToInput?: (s: string) => void;
  activeConversationId?: string;
  activeMode?: ModeId;
  onOutcomeResponse?: (
    text: string,
    suggestions?: Array<{ text: string; category: string; position: number }>,
  ) => void;
  conversationSuggestions?: Array<{
    text: string;
    position: number;
    category: string;
  }>;
}

function AvertuneAvatar() {
  return (
    <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
      <img
        src="./logo-icon.png"
        alt="Avertune"
        className="w-7 h-7 object-contain"
      />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        })
      }
      className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3 h-3 text-violet-400"
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

function TypedHeading() {
  const full = "What can I analyse for you?";
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(iv);
    }, 45);
    return () => clearInterval(iv);
  }, []);
  return (
    <h2 className="text-[30px] font-semibold text-[var(--text-primary)] min-h-[30px]">
      {displayed}
      <span
        className="inline-block w-0.5 h-[1.1em] bg-violet-500 ml-0.5 align-middle animate-pulse"
        style={{ opacity: displayed.length < full.length ? 1 : 0 }}
      />
    </h2>
  );
}

function StreamingIndicator({
  phase,
  capability,
}: {
  phase: "thinking" | "receiving";
  capability: string;
}) {
  const THINKING_LABELS = [
    "Analysing your message…",
    "Reading intent and tone…",
    "Building strategy…",
    "Preparing responses…",
  ];
  const [labelIdx, setLabelIdx] = useState(0);

  useEffect(() => {
    if (phase !== "thinking") return;
    const iv = setInterval(() => {
      setLabelIdx((i) => (i + 1) % THINKING_LABELS.length);
    }, 1600);
    return () => clearInterval(iv);
  }, [phase]);

  return (
    <div className="flex gap-3">
      <AvertuneAvatar />
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">
            Avertune
          </span>
          {capability && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/10 border border-violet-500/20 text-violet-400">
              {capability}
            </span>
          )}
        </div>

        <div
          className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--card-border)]"
          style={{ background: "rgba(120,120,140,0.08)" }}
        >
          <div className="flex items-end gap-[3px] h-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-violet-500"
                style={{
                  animation: `barPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                  height: "100%",
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
          <span className="text-[13px] text-[var(--text-muted)]">
            {phase === "receiving"
              ? "Building your response…"
              : THINKING_LABELS[labelIdx]}
          </span>
        </div>

        <style>{`
          @keyframes barPulse {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export function ChatMessages({
  messages,
  isTyping,
  streamingPhase = "idle",
  detectedCapability = "",
  loadingConversation = false,
  onSuggestionClick,
  onPasteToInput,
  activeConversationId,
  activeMode = "professional",
  onOutcomeResponse,
  conversationSuggestions = [],
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingPhase]);

  if (loadingConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-[3px] border-violet-500/30 border-t-violet-500 animate-spin" />
          <p className="text-[13px] text-[var(--text-muted)]">
            Loading conversation…
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && streamingPhase === "idle") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="max-w-[420px]">
          <TypedHeading />
        </div>
        <div className="max-w-[560px] w-full">
          <ModeSampleDropdown onSelect={(s) => onPasteToInput?.(s)} />
        </div>
      </div>
    );
  }

  // Find the last assistant message to attach conversation suggestions
  const lastAssistantIndex = [...messages]
    .reverse()
    .findIndex((m) => m.role === "assistant");
  const lastAssistantId =
    lastAssistantIndex !== -1
      ? messages[messages.length - 1 - lastAssistantIndex]?.id
      : null;

  return (
    <div className="flex-1 overflow-y-auto py-6">
      <div className="max-w-[720px] w-full mx-auto px-4 flex flex-col gap-6">
        {messages.map((msg, idx) => {
          const isLastAssistant =
            msg.role === "assistant" && msg.id === lastAssistantId;
          const suggestionsToPass =
            isLastAssistant && conversationSuggestions.length > 0
              ? conversationSuggestions.map((s) => s.text)
              : msg.suggestions;
          const categoriesToPass =
            isLastAssistant && conversationSuggestions.length > 0
              ? conversationSuggestions.map((s) => s.category)
              : msg.suggestionCategories;

          return (
            <div key={msg.id}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[78%]">
                    <div
                      className="text-[14px] leading-[1.7] rounded-2xl px-4 py-3 text-[var(--text-primary)]"
                      style={{ background: "rgba(120,120,140,0.18)" }}
                    >
                      {msg.attachedFile && (
                        <div className="flex items-center gap-2.5 mb-2 pb-2 border-b border-white/10">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                            {msg.attachedFile.fileType?.startsWith("image/") ? (
                              <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                className="w-4 h-4"
                              >
                                <rect
                                  x="1"
                                  y="2"
                                  width="14"
                                  height="12"
                                  rx="2"
                                  stroke="#67e8f9"
                                  strokeWidth="1.3"
                                />
                                <circle
                                  cx="5.5"
                                  cy="6.5"
                                  r="1.5"
                                  fill="#67e8f9"
                                />
                                <path
                                  d="M1 11l3.5-3.5 3 3 2.5-3 4 4.5"
                                  stroke="#67e8f9"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                className="w-4 h-4"
                              >
                                <path
                                  d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"
                                  stroke="#a78bfa"
                                  strokeWidth="1.3"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10 2v3h3"
                                  stroke="#a78bfa"
                                  strokeWidth="1.3"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M5 8h6M5 10.5h4"
                                  stroke="#a78bfa"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-medium text-[var(--text-primary)] truncate leading-tight">
                              {msg.attachedFile.name}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5">
                              {msg.attachedFile.fileType === "application/pdf"
                                ? "PDF"
                                : msg.attachedFile.fileType?.startsWith(
                                      "image/",
                                    )
                                  ? "Image"
                                  : msg.attachedFile.fileType?.includes("word")
                                    ? "Word doc"
                                    : "Document"}
                            </p>
                          </div>
                        </div>
                      )}
                      {msg.content && msg.content}
                    </div>
                    <div className="flex justify-end mt-1">
                      <CopyButton text={msg.content} />
                    </div>
                  </div>
                </div>
              ) : (
                ((() => {
                  console.log("=== DEBUG MESSAGE ===");
                  console.log("Message role:", msg.role);
                  console.log("Message ID:", msg.id);
                  console.log("Message turnType:", (msg as any).turnType);
                  console.log(
                    "Message intelligence?.turn_type:",
                    (msg as any).intelligence?.turn_type,
                  );
                  console.log(
                    "Message intelligence?.ai_response:",
                    (msg as any).intelligence?.ai_response,
                  );
                  console.log("Full intelligence:", (msg as any).intelligence);
                  console.log("======================");
                  return null;
                })(),
                (
                  <div className="flex gap-3">
                    <AvertuneAvatar />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                          Avertune
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      {msg.intelligenceResult ? (
                        <IntelligenceResultCard
                          result={msg.intelligenceResult}
                          suggestions={suggestionsToPass}
                          suggestionCategories={categoriesToPass}
                          onSuggestionClick={onSuggestionClick}
                          conversationId={
                            msg.conversationId ?? activeConversationId
                          }
                          messageId={msg.id}
                          capabilityDisplay={msg.capabilityDisplay}
                          modelUsed={msg.modelUsed}
                          naturalScore={msg.naturalScore}
                          onOutcomeResponse={onOutcomeResponse}
                        />
                      ) : (msg as any).intelligence?.turn_type ===
                          "outcome_followup" &&
                        (msg as any).intelligence?.ai_response ? (
                        <OutcomeResponseDisplay
                          acknowledgment={
                            (msg as any).intelligence.ai_response.acknowledgment
                          }
                          analysis={
                            (msg as any).intelligence.ai_response.analysis
                          }
                          next_steps={
                            (msg as any).intelligence.ai_response.next_steps
                          }
                          what_to_watch_for={
                            (msg as any).intelligence.ai_response
                              .what_to_watch_for
                          }
                          alternative_path={
                            (msg as any).intelligence.ai_response
                              .alternative_path
                          }
                          encouragement={
                            (msg as any).intelligence.ai_response.encouragement
                          }
                          suggested_prompts={
                            (msg as any).intelligence.ai_response
                              .suggested_prompts
                          }
                          onSuggestionClick={onSuggestionClick}
                          outcome_recorded={(msg as any).intelligence?.outcome}
                        />
                      ) : (
                        <>
                          <div
                            className="text-[14px] leading-[1.7] rounded-2xl px-4 py-3 text-[var(--text-primary)]"
                            style={{ background: "rgba(120,120,140,0.13)" }}
                          >
                            {msg.content.split("\n").map((line, i) => (
                              <span key={i}>
                                {line.startsWith("•") ? (
                                  <span className="block pl-1 mt-1">
                                    {line}
                                  </span>
                                ) : (
                                  <>
                                    {line}
                                    {i < msg.content.split("\n").length - 1 && (
                                      <br />
                                    )}
                                  </>
                                )}
                              </span>
                            ))}
                          </div>
                          {!(msg as any).isStreaming && (
                            <div className="mt-1">
                              <CopyButton text={msg.content} />
                            </div>
                          )}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {msg.suggestions.map((s, i) => {
                                const cat =
                                  msg.suggestionCategories?.[i] ??
                                  "exploration";
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
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}

        {streamingPhase !== "idle" && (
          <StreamingIndicator
            phase={streamingPhase}
            capability={detectedCapability}
          />
        )}
        {/* Suggested prompts at bottom of conversation */}
        {conversationSuggestions &&
          conversationSuggestions.length > 0 &&
          streamingPhase === "idle" && (
            <div className="pt-4 pb-2 dark:border-gray-700 mt-4">
              <p className="text-[11px] text-[var(--text-muted)] mb-3">
                If you want, you can ask follow-up questions or request actions
                based on the analysis:
              </p>
              <div className="flex flex-wrap gap-2">
                {conversationSuggestions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick?.(prompt.text)}
                    className={cn(
                      "px-3.5 py-2 rounded-full text-[13px] border transition-all text-left",
                      prompt.category === "action"
                        ? "border-gray-500 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
                        : "border-gray-200 dark:border-gray-700 bg-[var(--card-bg)] text-[var(--text-muted)] hover:border-gray-400 hover:text-[var(--text-primary)]",
                    )}
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
