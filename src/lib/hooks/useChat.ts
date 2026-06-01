"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ModeId, IntelligenceResult, ChatMessage } from "@/lib/types";
import { generateId } from "@/lib/utils";
import {
  analyseMessageStream,
  getConversationMessages,
  type Conversation,
  type ConversationStats,
} from "@/lib/api/intelligence";
import { useCredits } from "@/lib/contexts/CreditsContext";

const LAST_CONV_KEY = "avertune_last_conversation_id";

// ── Normalise a history message → ChatMessage ─────────────────────────────────
function normaliseHistoryMessage(msg: any, mode: ModeId): ChatMessage {
  const intel = msg.intelligence ?? msg.intelligence_result ?? null;
  const turnType: string = intel?.turn_type ?? "";

  if (
    !intel ||
    turnType === "clarify" ||
    turnType === "followup" ||
    intel.questions
  ) {
    return {
      id: msg.id ?? generateId(),
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content ?? "",
      timestamp: new Date(msg.created_at ?? Date.now()),
      turnType: turnType || undefined,
    };
  }

  if (
    intel.replies ||
    intel.responses ||
    intel.emails ||
    turnType === "generate"
  ) {
    const analysis = intel.analysis ?? {};
    const replies = intel.replies ?? intel.responses ?? intel.emails ?? {};
    const intelligenceResult: IntelligenceResult = {
      mode,
      riskLevel: analysis.risk_level ?? "low",
      analysis: analysis.intent ?? analysis.tone ?? "",
      strategy: analysis.strategy ?? "",
      recommended: intel.recommended,
      replies,
      scores: intel.scoring
        ? {
            confidence: intel.scoring.confidence_score ?? 0,
            clarity: intel.scoring.intent_clarity_score ?? 0,
            toneMatch: intel.scoring.tone_detected ?? "",
            escalationRisk:
              intel.scoring.escalation_probability > 0.5
                ? "high"
                : intel.scoring.escalation_probability > 0.25
                  ? "medium"
                  : "low",
          }
        : undefined,
      next_best_action: intel.next_best_action,
      situation_read: intel.situation_read,
      coach_note: intel.coach_note,
    };
    return {
      id: msg.id ?? generateId(),
      role: "assistant",
      content: msg.content ?? "",
      timestamp: new Date(msg.created_at ?? Date.now()),
      intelligenceResult,
      turnType: "generate",
    };
  }

  return {
    id: msg.id ?? generateId(),
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content ?? "",
    timestamp: new Date(msg.created_at ?? Date.now()),
  };
}

// ── Normalise live complete output → IntelligenceResult ──────────────────────
function normaliseLiveResult(output: any, mode: ModeId): IntelligenceResult {
  const scoring = output.scoring ?? {};
  const replies = output.replies ?? output.responses ?? output.emails ?? {};

  return {
    mode,
    riskLevel:
      scoring.risk_score > 65
        ? "high"
        : scoring.risk_score > 35
          ? "medium"
          : "low",
    analysis: "",
    strategy: "",
    recommended: output.recommended,
    replies,
    scores: {
      confidence: scoring.confidence_score ?? 0,
      clarity: scoring.intent_clarity_score ?? 0,
      toneMatch: scoring.tone_detected ?? "",
      escalationRisk:
        scoring.escalation_probability > 0.5
          ? "high"
          : scoring.escalation_probability > 0.25
            ? "medium"
            : "low",
    },
    next_best_action: output.next_best_action,
    situation_read: output.situation_read,
    coach_note: output.coach_note,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UseChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  streamingPhase: "idle" | "thinking" | "receiving";
  detectedCapability: string;
  activeMode: ModeId;
  threadId: string | undefined;
  activeConversation: Conversation | null;
  sessionStats: ConversationStats | null;
  loadingConversation: boolean;
  modeLocked: boolean;
  insufficientCredits: boolean;
  pendingChallenge: {
    challenge: string;
    risk_type: string;
    originalMessage: string;
  } | null;
  dismissCreditsAlert: () => void;
  proceedChallenge: () => void;
  dismissChallenge: () => void;
  setActiveMode: (mode: ModeId) => void;
  sendMessage: (content: string, skipChallenge?: boolean) => Promise<void>;
  startNewConversation: () => void;
  loadConversation: (conversationId: string) => Promise<void>;
  restoreLastConversation: () => void;
  refreshSidebar: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useChat(): UseChatReturn {
  const { applyUsage } = useCredits();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  // "thinking" = connected, waiting for first chunk | "receiving" = chunks arriving
  const [streamingPhase, setStreamingPhase] = useState<
    "idle" | "thinking" | "receiving"
  >("idle");
  const [detectedCapability, setDetectedCapability] = useState("");
  const [activeMode, setActiveMode] = useState<ModeId>("professional");
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [sessionStats, setSessionStats] = useState<ConversationStats | null>(
    null,
  );
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [modeLocked, setModeLocked] = useState(false);
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const [pendingChallenge, setPendingChallenge] = useState<{
    challenge: string;
    risk_type: string;
    originalMessage: string;
  } | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  const threadIdRef = useRef<string | undefined>(undefined);
  const activeModeRef = useRef<ModeId>("professional");

  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);
  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  const dismissCreditsAlert = useCallback(
    () => setInsufficientCredits(false),
    [],
  );
  const dismissChallenge = useCallback(() => setPendingChallenge(null), []);

  // ── Load conversation ──────────────────────────────────────────────────────
  const loadConversation = useCallback(async (conversationId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setLoadingConversation(true);
    setMessages([]);

    try {
      const data = await getConversationMessages(token, conversationId);
      const mode = (data.conversation?.mode as ModeId) ?? "professional";
      const loaded: ChatMessage[] = (data.messages ?? []).map((m) =>
        normaliseHistoryMessage(m, mode),
      );
      setMessages(loaded);
      setThreadId(conversationId);
      setActiveConversation(data.conversation ?? null);
      setSessionStats(data.stats ?? null);
      setActiveMode(mode);
      setModeLocked(loaded.length > 0);
      localStorage.setItem(LAST_CONV_KEY, conversationId);
    } catch (err) {
      console.error("Failed to load conversation:", err);
      localStorage.removeItem(LAST_CONV_KEY);
    } finally {
      setLoadingConversation(false);
    }
  }, []);

  const restoreLastConversation = useCallback(() => {
    const lastId = localStorage.getItem(LAST_CONV_KEY);
    if (lastId) loadConversation(lastId);
  }, [loadConversation]);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setThreadId(undefined);
    setActiveConversation(null);
    setSessionStats(null);
    setModeLocked(false);
    setStreamingPhase("idle");
    setDetectedCapability("");
    setPendingChallenge(null);
    localStorage.removeItem(LAST_CONV_KEY);
  }, []);

  // ── handleComplete — called by both streaming onComplete and non-streaming ──
  const handleComplete = useCallback(
    (
      data: any,
      currentMode: ModeId,
      userMsgId: string,
      skipConvCheck = false,
    ) => {
      setStreamingPhase("idle");
      setIsTyping(false);
      setDetectedCapability("");

      const output = data.output ?? data;
      const turnType: string = output.turn_type ?? data.turn_type ?? "";

      // Save conversation ID
      const convId =
        output.conversation_id ??
        output.thread_id ??
        data.conversation_id ??
        data.thread_id;
      if (convId && !threadIdRef.current) {
        setThreadId(convId);
        threadIdRef.current = convId;
        setModeLocked(true);
        localStorage.setItem(LAST_CONV_KEY, convId);
        setRefreshSidebar((n) => n + 1);
      }

      // ── Insufficient credits ──
      if (turnType === "insufficient_credits") {
        setInsufficientCredits(true);
        setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        return;
      }

      // ── Challenge ──
      if (turnType === "challenge") {
        setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        setPendingChallenge({
          challenge: output.challenge ?? data.challenge ?? "",
          risk_type: output.risk_type ?? data.risk_type ?? "",
          originalMessage: "", // set at call site
        });
        return;
      }

      // ── Clarify ──
      if (turnType === "clarify") {
        const questions: string[] = (
          output.questions ??
          data.questions ??
          []
        ).map((q: any) => q.question ?? q);
        const text = questions.length
          ? "I need a bit more context:\n\n" +
            questions.map((q: string) => `• ${q}`).join("\n")
          : (output.reply ?? data.reply ?? "Can you give me more context?");
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: text,
            timestamp: new Date(),
            turnType: "clarify",
          },
        ]);
        return;
      }

      // ── Generate ──
      const hasReplies =
        output.replies ||
        output.responses ||
        output.emails ||
        turnType === "generate";

      if (hasReplies) {
        const intelligenceResult = normaliseLiveResult(output, currentMode);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: "",
            timestamp: new Date(),
            intelligenceResult,
            turnType: "generate",
            conversationId: convId ?? threadIdRef.current,
          } as ChatMessage & { conversationId?: string },
        ]);
        return;
      }

      // ── Free reply / followup ──
      const text =
        output.reply ??
        output.followup_prompt ??
        output.message ??
        data.reply ??
        data.message ??
        "";
      if (text) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: text,
            timestamp: new Date(),
            turnType,
          },
        ]);
      }
    },
    [],
  );

  // ── Core send logic ────────────────────────────────────────────────────────
  const sendMessageInternal = useCallback(
    async (content: string, skipChallenge = false) => {
      if (!content.trim()) return;

      const token = localStorage.getItem("access_token") ?? "";
      const currentMode = activeModeRef.current;
      const currentThreadId = threadIdRef.current;

      const userMsgId = generateId();
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setStreamingPhase("thinking");
      setDetectedCapability("");

      try {
        await analyseMessageStream(
          token,
          {
            mode: currentMode,
            message: content,
            thread_id: currentThreadId,
            stream: true,
            ...(skipChallenge ? { context: { __skip_challenge: true } } : {}),
          },
          {
            onCapability: ({ display_name }) => {
              setDetectedCapability(display_name ?? "");
            },
            onCredits: ({ credits_used, credits_remaining }) => {
              applyUsage(credits_used, credits_remaining);
            },
            // ⚠️  Chunks are raw JSON fragments — we NEVER display them.
            // We only flip phase to "receiving" so the UI shows "building response…"
            onChunk: () => {
              setStreamingPhase("receiving");
            },
            onComplete: (output) => {
              handleComplete(output, currentMode, userMsgId);
            },
            onNonStream: (data) => {
              const turnType: string = data.turn_type ?? "";
              if (turnType === "challenge") {
                setStreamingPhase("idle");
                setIsTyping(false);
                setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
                setPendingChallenge({
                  challenge: data.challenge ?? "",
                  risk_type: data.risk_type ?? "",
                  originalMessage: content,
                });
                return;
              }
              handleComplete(data, currentMode, userMsgId);
            },
            onError: (message) => {
              setStreamingPhase("idle");
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: generateId(),
                  role: "assistant",
                  content: message || "Something went wrong. Please try again.",
                  timestamp: new Date(),
                },
              ]);
            },
          },
        );
      } catch (err: any) {
        setStreamingPhase("idle");
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: err?.message ?? "Something went wrong. Please try again.",
            timestamp: new Date(),
          },
        ]);
      }
    },
    [applyUsage, handleComplete],
  );

  const proceedChallenge = useCallback(() => {
    if (!pendingChallenge) return;
    const msg = pendingChallenge.originalMessage;
    setPendingChallenge(null);
    sendMessageInternal(msg, true);
  }, [pendingChallenge, sendMessageInternal]);

  const sendMessage = useCallback(
    (content: string, skipChallenge = false) =>
      sendMessageInternal(content, skipChallenge),
    [sendMessageInternal],
  );

  return {
    messages,
    isTyping,
    streamingPhase,
    detectedCapability,
    activeMode,
    threadId,
    activeConversation,
    sessionStats,
    loadingConversation,
    modeLocked,
    insufficientCredits,
    pendingChallenge,
    dismissCreditsAlert,
    proceedChallenge,
    dismissChallenge,
    setActiveMode,
    sendMessage,
    startNewConversation,
    loadConversation,
    restoreLastConversation,
    refreshSidebar,
  };
}
