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
  // scoring may live at top level on the message or inside intelligence
  const topScoring = msg.scoring ?? null;
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

  // Detect generate shape: has recommended/alternative/answer/strategic_reasoning
  const isGenerateShape =
    intel.replies ||
    intel.responses ||
    intel.emails ||
    intel.recommended ||
    intel.alternative ||
    intel.answer ||
    intel.strategic_reasoning ||
    turnType === "generate";

  if (isGenerateShape) {
    // Build replies map from whatever shape the API returned
    let replies: Record<string, any> = {};

    if (intel.replies) {
      // Already in replies map shape
      replies = intel.replies;
    } else if (intel.emails) {
      replies = intel.emails;
    } else if (intel.responses) {
      replies = intel.responses;
    } else {
      // New shape: recommended + alternative objects
      if (intel.recommended && typeof intel.recommended === "object") {
        replies["recommended"] = {
          text: intel.recommended.advice ?? "",
          insight: intel.recommended.why_this_works ?? "",
          action_steps: intel.recommended.action_steps,
          what_to_avoid: intel.recommended.what_to_avoid,
        };
      }
      if (intel.alternative && typeof intel.alternative === "object") {
        replies["alternative"] = {
          text: intel.alternative.advice ?? "",
          insight: intel.alternative.why_this_works ?? "",
          action_steps: intel.alternative.action_steps,
        };
      }
    }

    const scoring = topScoring ?? intel.scoring ?? {};

    const intelligenceResult: IntelligenceResult = {
      mode,
      riskLevel:
        (scoring.risk_score ?? 0) > 65
          ? "high"
          : (scoring.risk_score ?? 0) > 35
            ? "medium"
            : "low",
      analysis: intel.answer ?? intel.strategic_reasoning ?? "",
      strategy: intel.strategic_reasoning && intel.answer ? intel.strategic_reasoning : "",
      recommended: intel.recommended ? "recommended" : undefined,
      replies: Object.keys(replies).length > 0 ? replies : undefined,
      scores: Object.keys(scoring).length > 0
        ? {
            confidence: scoring.confidence_score ?? 0,
            clarity: scoring.intent_clarity_score ?? 0,
            toneMatch: scoring.tone_detected ?? "",
            escalationRisk:
              (scoring.escalation_probability ?? 0) > 0.5
                ? "high"
                : (scoring.escalation_probability ?? 0) > 0.25
                  ? "medium"
                  : "low",
            riskScore: scoring.risk_score ?? 0,
            escalationProbability:
              scoring.escalation_probability != null
                ? Math.round(scoring.escalation_probability * 100)
                : undefined,
            relationshipImpact: scoring.relationship_impact ?? undefined,
          }
        : undefined,
      next_best_action: intel.next_best_action ?? msg.next_best_action,
      situation_read: intel.situation_read,
      coach_note: intel.coach_note ?? msg.coach_note,
      scenario_planning: intel.scenario_planning,
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

  // Build replies from whatever shape came back
  let replies: Record<string, any> = {};
  let recommendedKey: string | undefined;

  if (output.replies) {
    replies = output.replies;
    recommendedKey = output.recommended;
  } else if (output.emails) {
    replies = output.emails;
    recommendedKey = output.recommended;
  } else if (output.responses) {
    replies = output.responses;
  } else {
    // New shape: recommended + alternative objects
    if (output.recommended && typeof output.recommended === "object") {
      replies["recommended"] = {
        text: output.recommended.advice ?? "",
        insight: output.recommended.why_this_works ?? "",
        action_steps: output.recommended.action_steps,
        what_to_avoid: output.recommended.what_to_avoid,
      };
      recommendedKey = "recommended";
    }
    if (output.alternative && typeof output.alternative === "object") {
      replies["alternative"] = {
        text: output.alternative.advice ?? "",
        insight: output.alternative.why_this_works ?? "",
        action_steps: output.alternative.action_steps,
      };
    }
  }

  return {
    mode,
    riskLevel:
      scoring.risk_score > 65
        ? "high"
        : scoring.risk_score > 35
          ? "medium"
          : "low",
    analysis: output.answer ?? output.strategic_reasoning ?? "",
    strategy: output.strategic_reasoning && output.answer ? output.strategic_reasoning : "",
    recommended: recommendedKey,
    replies: Object.keys(replies).length > 0 ? replies : undefined,
    scores: {
      confidence: scoring.confidence_score ?? 0,
      clarity: scoring.intent_clarity_score ?? 0,
      toneMatch: scoring.tone_detected ?? "",
      escalationRisk:
        (scoring.escalation_probability ?? 0) > 0.5
          ? "high"
          : (scoring.escalation_probability ?? 0) > 0.25
            ? "medium"
            : "low",
      riskScore: scoring.risk_score ?? 0,
      escalationProbability:
        scoring.escalation_probability != null
          ? Math.round(scoring.escalation_probability * 100)
          : undefined,
      relationshipImpact: scoring.relationship_impact ?? undefined,
    },
    next_best_action: output.next_best_action,
    situation_read: output.situation_read,
    coach_note: output.coach_note,
    scenario_planning: output.scenario_planning,
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
  chatError: string | null;
  pendingChallenge: {
    challenge: string;
    risk_type: string;
    originalMessage: string;
  } | null;
  dismissCreditsAlert: () => void;
  dismissChatError: () => void;
  silentRefreshStats: (conversationId: string) => Promise<void>;
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
  const [chatError, setChatError] = useState<string | null>(null);
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
  const dismissChatError = useCallback(() => setChatError(null), []);
  const dismissChallenge = useCallback(() => setPendingChallenge(null), []);

  // ── Silent stats refresh — no spinner, no message replacement ──────────────
  const silentRefreshStats = useCallback(async (conversationId: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getConversationMessages(token, conversationId);
      if (data.stats) setSessionStats(data.stats);
      setRefreshSidebar((n) => n + 1);
    } catch {}
  }, []);

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
      pendingSuggestedPrompts?: any[],
    ) => {
      setStreamingPhase("idle");
      setIsTyping(false);
      setDetectedCapability("");

      const output = data.output ?? data;
      const turnType: string =
        output.turn_type ?? data.turn_type ?? "";

      // Save conversation ID (always present per spec)
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
      }

      // Suggested prompts from the event stream (arrive after complete)
      const suggestions: string[] =
        (pendingSuggestedPrompts ?? output.suggested_prompts ?? data.suggested_prompts ?? [])
          .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
          .map((p: any) => p.text ?? p);

      // ── Error turn (business errors — HTTP 200 with turn_type: error) ──
      if (turnType === "error") {
        const code: string = output.code ?? data.code ?? "";
        const msg: string = output.message ?? output.error ?? data.message ?? data.error ?? "Something went wrong.";
        if (code === "INSUFFICIENT_CREDITS") {
          setInsufficientCredits(true);
          setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        } else {
          setChatError(msg);
          setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        }
        return;
      }

      // ── Insufficient credits (legacy key) ──
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
          originalMessage: "",
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
          ? questions[0]
          : (output.reply ?? data.reply ?? "Can you give me more context?");
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: text,
            timestamp: new Date(),
            turnType: "clarify",
            suggestions,
          },
        ]);
        return;
      }

      // ── Greeting ──
      if (turnType === "greeting") {
        const text = output.reply ?? output.message ?? data.reply ?? data.message ?? "";
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: text,
            timestamp: new Date(),
            turnType: "greeting",
            suggestions,
          },
        ]);
        return;
      }

      // ── Generate ──
      const isGenerate =
        turnType === "generate" ||
        output.ready_to_generate === true ||
        output.output ||
        output.recommended ||
        output.emails ||
        output.replies ||
        output.responses;

      if (isGenerate) {
        const fetchConvId = convId ?? threadIdRef.current;
        const token = localStorage.getItem("access_token");

        // Build the local result immediately so the user sees it now
        const intelligenceResult = normaliseLiveResult(output, currentMode);
        const newAssistantMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
          intelligenceResult,
          turnType: "generate",
          suggestions,
          conversationId: fetchConvId ?? undefined,
        };
        setMessages((prev) => [...prev, newAssistantMsg]);

        // Background: update stats + sidebar only — do NOT replace messages
        if (fetchConvId && token) {
          getConversationMessages(token, fetchConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        }
        return;
      }

      // ── Refinement ──
      if (turnType === "refinement") {
        const text = output.reply ?? output.message ?? data.reply ?? data.message ?? "";
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: text,
            timestamp: new Date(),
            turnType: "refinement",
            suggestions,
          },
        ]);
        return;
      }

      // ── Free reply / followup / any other text turn ──
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
            turnType: turnType || "free_reply",
            suggestions,
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

      // Collect suggested_prompts from SSE — arrives after complete event
      let pendingPrompts: any[] | undefined;

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
            onChunk: () => {
              setStreamingPhase("receiving");
            },
            onSuggestedPrompts: (prompts) => {
              pendingPrompts = prompts;
            },
            onComplete: (output) => {
              handleComplete(output, currentMode, userMsgId, pendingPrompts);
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
              const prompts =
                (data.suggested_prompts ?? [])
                  .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
              handleComplete(data, currentMode, userMsgId, prompts);
            },
            onError: (message, code) => {
              setStreamingPhase("idle");
              setIsTyping(false);
              if (code === "INSUFFICIENT_CREDITS") {
                setInsufficientCredits(true);
                setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
              } else {
                setChatError(message || "Something went wrong. Please try again.");
              }
            },
          },
        );
      } catch (err: any) {
        setStreamingPhase("idle");
        setIsTyping(false);
        setChatError(err?.message ?? "Something went wrong. Please try again.");
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
    chatError,
    pendingChallenge,
    dismissCreditsAlert,
    dismissChatError,
    silentRefreshStats,
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
