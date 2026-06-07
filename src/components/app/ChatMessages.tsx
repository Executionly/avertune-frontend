"use client";

import { useRef, useEffect, useState } from "react";
import { formatTime, cn } from "@/lib/utils";
import { IntelligenceResultCard } from "./IntelligenceResultCard";
import { ModeSampleDropdown } from "./ModeSampleDropdown";
import type { ChatMessage, ModeId } from "@/lib/types";

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
  onOutcomeResponse?: (text: string) => void;
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

// Animated heading for empty state
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

// Streaming indicator — shown while waiting for complete event
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
          {/* Animated bars */}
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
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  // Track which mode the last fetch was for to avoid stale updates
  const fetchedModeRef = useRef<string>("");

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

  return (
    <div className="flex-1 overflow-y-auto py-6">
      <div className="max-w-[720px] w-full mx-auto px-4 flex flex-col gap-6">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[78%]">
                  <div
                    className="text-[14px] leading-[1.7] rounded-2xl px-4 py-3 text-[var(--text-primary)]"
                    style={{ background: "rgba(120,120,140,0.18)" }}
                  >
                    {msg.content}
                  </div>
                  <div className="flex justify-end mt-1">
                    <CopyButton text={msg.content} />
                  </div>
                </div>
              </div>
            ) : (
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
                      suggestions={msg.suggestions}
                      suggestionCategories={msg.suggestionCategories}
                      onSuggestionClick={onSuggestionClick}
                      conversationId={msg.conversationId ?? activeConversationId}
                      messageId={msg.id}
                      capabilityDisplay={msg.capabilityDisplay}
                      modelUsed={msg.modelUsed}
                      naturalScore={msg.naturalScore}
                      onOutcomeResponse={onOutcomeResponse}
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
                              <span className="block pl-1 mt-1">{line}</span>
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
                      <div className="mt-1">
                        <CopyButton text={msg.content} />
                      </div>
                      {/* Suggested prompts on clarify / greeting / free_reply / refinement */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.suggestions.map((s, i) => {
                            const cat = msg.suggestionCategories?.[i] ?? "exploration";
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
            )}
          </div>
        ))}

        {/* Live streaming indicator — never raw JSON */}
        {streamingPhase !== "idle" && (
          <StreamingIndicator
            phase={streamingPhase}
            capability={detectedCapability}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
