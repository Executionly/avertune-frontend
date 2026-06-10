"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ModeId, IntelligenceResult, ChatMessage } from "@/lib/types";
import { generateId } from "@/lib/utils";
import {
  analyseMessageStream,
  getConversationMessages,
  getConversations,
  uploadFile,
  uploadVoice,
  transcribeVoice,
  type Conversation,
  type ConversationStats,
} from "@/lib/api/intelligence";
import { useCredits } from "@/lib/contexts/CreditsContext";

const LAST_CONV_KEY = "avertune_last_conversation_id";

// ── Normalise a history message → ChatMessage ─────────────────────────────────
function normaliseHistoryMessage(
  msg: any,
  mode: ModeId,
  conversationId?: string,
): ChatMessage {
  // ADD THIS DEBUG LOG
  console.log("=== normaliseHistoryMessage ===");
  console.log("Message ID:", msg.id);
  console.log("Message has intelligence?", !!msg.intelligence);
  console.log(
    "Message intelligence keys:",
    msg.intelligence ? Object.keys(msg.intelligence) : "none",
  );
  console.log("Message turn_type:", msg.intelligence?.turn_type);
  console.log("=================================");
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
      intelligence: msg.intelligence, // ADD THIS LINE
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
    const rawReplies = intel.replies ?? intel.emails ?? intel.responses;
    const isDegraded =
      rawReplies?.is_degraded === true ||
      (rawReplies && typeof rawReplies.basic_advice === "string");

    let replies: Record<string, any> = {};
    let recommendedKey: string | undefined;
    let situationRead: string | undefined = intel.situation_read;
    let nextBestAction: string | undefined =
      intel.next_best_action ?? msg.next_best_action;

    if (isDegraded) {
      situationRead = rawReplies?.situation_read ?? situationRead;
      nextBestAction = rawReplies?.next_best_action ?? nextBestAction;
      if (rawReplies?.basic_advice || rawReplies?.balanced) {
        replies = {
          advice: {
            text: rawReplies?.balanced ?? rawReplies?.basic_advice ?? "",
            insight: rawReplies?.basic_advice ?? "",
          },
        };
        recommendedKey = "advice";
      }
    } else if (rawReplies) {
      replies = rawReplies;
      recommendedKey = intel.recommended;
    } else {
      if (intel.recommended && typeof intel.recommended === "object") {
        replies["recommended"] = {
          text: intel.recommended.advice ?? "",
          insight: intel.recommended.why_this_works ?? "",
          generated_reply: intel.recommended.generated_reply,
          action_steps: intel.recommended.action_steps,
          what_to_avoid: intel.recommended.what_to_avoid,
        };
        recommendedKey = "recommended";
      }
      if (intel.alternative && typeof intel.alternative === "object") {
        replies["alternative"] = {
          text: intel.alternative.advice ?? "",
          insight: intel.alternative.why_this_works ?? "",
          generated_reply: intel.alternative.generated_reply,
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
      strategy:
        intel.strategic_reasoning && intel.answer
          ? intel.strategic_reasoning
          : "",
      recommended: recommendedKey,
      replies: Object.keys(replies).length > 0 ? replies : undefined,
      scores:
        Object.keys(scoring).length > 0
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
      next_best_action: nextBestAction,
      situation_read: situationRead,
      coach_note: intel.coach_note ?? msg.coach_note,
      scenario_planning: intel.scenario_planning,
      is_degraded: isDegraded,
      upgrade_message: rawReplies?.upgrade_message ?? intel.upgrade_message,
      upgrade_required: rawReplies?.upgrade_required ?? intel.upgrade_required,
      locked_features: rawReplies?.locked_features ?? intel.locked_features,
      available_plans: rawReplies?.available_plans ?? intel.available_plans,
    };
    return {
      id: msg.id ?? generateId(),
      role: "assistant",
      content: msg.content ?? "",
      timestamp: new Date(msg.created_at ?? Date.now()),
      intelligenceResult,
      turnType: "generate",
      conversationId,
      intelligence: msg.intelligence, // ADD THIS LINE
    };
  }

  return {
    id: msg.id ?? generateId(),
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content ?? "",
    timestamp: new Date(msg.created_at ?? Date.now()),
    intelligence: msg.intelligence, // ADD THIS LINE
  };
}

// ── Normalise live complete output → IntelligenceResult ──────────────────────
function normaliseLiveResult(output: any, mode: ModeId): IntelligenceResult {
  const scoring = output.scoring ?? {};

  // The top-level output may wrap things under output.output (streaming complete event)
  const payload = output.output ?? output;

  // Replies shape detection
  const rawReplies = payload.replies ?? payload.emails ?? payload.responses;

  // Detect flat/degraded shape — replies is a plain object with string values
  // (situation_read, basic_advice, balanced, next_best_action, is_degraded…)
  const isDegraded =
    payload.replies?.is_degraded === true ||
    (rawReplies && typeof rawReplies.basic_advice === "string");

  let replies: Record<string, any> | undefined;
  let recommendedKey: string | undefined;
  let situationRead: string | undefined = payload.situation_read;
  let nextBestAction: string | undefined = payload.next_best_action;

  if (isDegraded) {
    // Flat shape — pull fields out directly, don't treat as tab variants
    situationRead = rawReplies?.situation_read ?? situationRead;
    nextBestAction = rawReplies?.next_best_action ?? nextBestAction;
    // Build a single "response" reply tab from basic_advice + balanced
    if (rawReplies?.basic_advice || rawReplies?.balanced) {
      replies = {
        advice: {
          text: rawReplies?.balanced ?? rawReplies?.basic_advice ?? "",
          insight: rawReplies?.basic_advice ?? "",
        },
      };
      recommendedKey = "advice";
    }
  } else if (rawReplies) {
    replies = rawReplies;
    recommendedKey = payload.recommended;
  } else if (payload.recommended && typeof payload.recommended === "object") {
    replies = {
      recommended: {
        text: payload.recommended.advice ?? "",
        insight: payload.recommended.why_this_works ?? "",
        generated_reply: payload.recommended.generated_reply,
        action_steps: payload.recommended.action_steps,
        what_to_avoid: payload.recommended.what_to_avoid,
      },
    };
    recommendedKey = "recommended";
    if (payload.alternative && typeof payload.alternative === "object") {
      replies["alternative"] = {
        text: payload.alternative.advice ?? "",
        insight: payload.alternative.why_this_works ?? "",
        generated_reply: payload.alternative.generated_reply,
        action_steps: payload.alternative.action_steps,
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
    analysis: payload.answer ?? payload.strategic_reasoning ?? "",
    strategy:
      payload.strategic_reasoning && payload.answer
        ? payload.strategic_reasoning
        : "",
    recommended: recommendedKey,
    replies: replies && Object.keys(replies).length > 0 ? replies : undefined,
    scores:
      Object.keys(scoring).length > 0
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
    next_best_action: nextBestAction,
    situation_read: situationRead,
    coach_note: payload.coach_note,
    scenario_planning: payload.scenario_planning,
    is_degraded: isDegraded || payload.replies?.upgrade_required || false,
    upgrade_message:
      payload.replies?.upgrade_message ?? payload.upgrade_message,
    upgrade_required:
      payload.replies?.upgrade_required ?? payload.upgrade_required,
    locked_features:
      payload.replies?.locked_features ?? payload.locked_features,
    available_plans:
      payload.replies?.available_plans ?? payload.available_plans,
    // meeting_preparation
    meeting_strategy: payload.meeting_strategy,
    opening_statement: payload.opening_statement,
    key_talking_points: payload.key_talking_points,
    how_to_handle_pushback: payload.how_to_handle_pushback,
    // interview_prep
    preparation_strategy: payload.preparation_strategy,
    questions_to_ask_interviewer: payload.questions_to_ask_interviewer,
    // cold_outreach
    outreach_angle: payload.outreach_angle,
    power_dynamic: payload.power_dynamic,
    subject_lines: payload.subject_lines,
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
  chatErrorCode: string | null;
  pendingChallenge: {
    challenge: string;
    risk_type: string;
    originalMessage: string;
    suggestions?: string[];
  } | null;
  dismissCreditsAlert: () => void;
  dismissChatError: () => void;
  silentRefreshStats: (conversationId: string) => Promise<void>;
  proceedChallenge: () => void;
  dismissChallenge: () => void;
  setActiveMode: (mode: ModeId) => void;
  sendMessage: (content: string, skipChallenge?: boolean) => Promise<void>;
  sendFile: (file: File, text?: string) => Promise<void>;
  sendVoice: (
    audio: Blob,
    onTranscript: (text: string) => void,
  ) => Promise<void>;
  pendingVoice: { audio: Blob; transcript: string } | null;
  isTranscribing: boolean;
  confirmVoiceSend: (editedTranscript: string) => Promise<void>;
  dismissPendingVoice: () => void;
  startNewConversation: () => void;
  loadConversation: (conversationId: string) => Promise<void>;
  restoreLastConversation: () => void;
  appendMessage: (content: string) => void;
  refreshSidebar: number;
  conversationSuggestions: Array<{
    text: string;
    position: number;
    category: string;
  }>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useChat(): UseChatReturn {
  const { applyUsage } = useCredits();
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [chunkBuffer, setChunkBuffer] = useState<string>("");
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
  const [chatErrorCode, setChatErrorCode] = useState<string | null>(null);
  const [pendingChallenge, setPendingChallenge] = useState<{
    challenge: string;
    risk_type: string;
    originalMessage: string;
    suggestions?: string[];
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
  const dismissChatError = useCallback(() => {
    setChatError(null);
    setChatErrorCode(null);
  }, []);
  const dismissChallenge = useCallback(() => setPendingChallenge(null), []);

  const appendMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        role: "assistant",
        content,
        timestamp: new Date(),
        turnType: "free_reply",
      } as ChatMessage,
    ]);
  }, []);

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
        normaliseHistoryMessage(m, mode, conversationId),
      );
      setMessages(loaded);
      setThreadId(conversationId);
      setActiveConversation(data.conversation ?? null);
      setSessionStats(data.stats ?? null);
      setActiveMode(mode);
      setModeLocked(loaded.length > 0);
      localStorage.setItem(LAST_CONV_KEY, conversationId);

      // Force refresh of conversationSuggestions
      setRefreshSidebar((n) => n + 1);
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
      const turnType: string = output.turn_type ?? data.turn_type ?? "";

      // Save conversation ID (always present per spec)
      const convId =
        output.conversation_id ??
        output.thread_id ??
        data.conversation_id ??
        data.thread_id ??
        (data.output
          ? (data.output.conversation_id ?? data.output.thread_id)
          : undefined);
      if (convId) {
        // Always sync the ref so fetchConvId is correct for all turn types
        threadIdRef.current = convId;
        setThreadId(convId);
        setModeLocked(true);
        localStorage.setItem(LAST_CONV_KEY, convId);
      }

      // Suggested prompts from the event stream (arrive after complete)
      const suggestions: string[] = (
        pendingSuggestedPrompts ??
        output.suggested_prompts ??
        data.suggested_prompts ??
        []
      )
        .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
        .map((p: any) => p.text ?? p);

      // ── Error turn (business errors — HTTP 200 with turn_type: error) ──
      if (turnType === "error") {
        const code: string = output.code ?? data.code ?? "";
        const msg: string =
          output.message ??
          output.error ??
          data.message ??
          data.error ??
          "Something went wrong.";
        setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        setChatErrorCode(code);

        if (code === "INSUFFICIENT_CREDITS") {
          setInsufficientCredits(true);
        } else if (code === "CAPABILITY_LOCKED") {
          setChatError(
            `This capability requires a higher plan. ${output.upgrade_required ? "Upgrade to unlock it." : ""}`,
          );
        } else if (code === "CREDIT_DEDUCTION_FAILED") {
          setChatError(
            "A temporary issue occurred. Your credits were not deducted — please try again.",
          );
        } else if (code === "GENERATION_FAILED") {
          setChatError(
            "Generation failed. Your credits have been refunded — please try again.",
          );
        } else if (code === "WORD_LIMIT_EXCEEDED") {
          setChatError(
            "Your message exceeds the word limit for your plan. Please shorten it and try again.",
          );
        } else if (code === "USER_NOT_FOUND") {
          // Force logout — auth token valid but user record missing
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          if (typeof window !== "undefined")
            window.location.href = "/auth/signin";
        } else if (code === "ACCOUNT_INACTIVE") {
          setChatError("Your account is inactive. Please contact support.");
        } else {
          setChatError(msg);
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
          suggestions,
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
        const clarifyConvId = convId ?? threadIdRef.current;
        const clarifyToken = localStorage.getItem("access_token");
        if (clarifyConvId && clarifyToken) {
          getConversationMessages(clarifyToken, clarifyConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        }
        return;
      }

      // ── Greeting ──
      if (turnType === "greeting") {
        const text =
          output.reply ?? output.message ?? data.reply ?? data.message ?? "";
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
        const greetConvId = convId ?? threadIdRef.current;
        const greetToken = localStorage.getItem("access_token");
        if (greetConvId && greetToken) {
          getConversationMessages(greetToken, greetConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        }
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
        const fetchConvId =
          convId ??
          threadIdRef.current ??
          localStorage.getItem(LAST_CONV_KEY) ??
          undefined;
        const token = localStorage.getItem("access_token");

        // Extract generate-specific fields from spec
        const rawPrompts =
          pendingSuggestedPrompts ??
          output.suggested_prompts ??
          data.suggested_prompts ??
          [];
        const sortedPrompts = [...rawPrompts].sort(
          (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0),
        );
        const suggestionTexts = sortedPrompts.map((p: any) => p.text ?? p);
        const suggestionCats = sortedPrompts.map(
          (p: any) => p.category ?? "exploration",
        );

        const intelligenceResult = normaliseLiveResult(output, currentMode);
        const msgLocalId = generateId();
        const newAssistantMsg: ChatMessage = {
          id: msgLocalId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          intelligenceResult,
          turnType: "generate",
          suggestions: suggestionTexts,
          suggestionCategories: suggestionCats,
          conversationId: fetchConvId ?? undefined,
          messageId: output.message_id ?? data.message_id,
          capabilityDisplay:
            output.capability_display ?? data.capability_display,
          modelUsed: output.model_used ?? data.model_used,
          naturalScore: output.natural_score ?? data.natural_score,
        };
        setMessages((prev) => [...prev, newAssistantMsg]);

        if (!token) return;

        if (fetchConvId) {
          // Known conversation — fetch stats directly
          getConversationMessages(token, fetchConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        } else {
          // The SSE stream never carries conversation_id — use getConversations
          // to discover the ID that the server just created, then fetch its stats
          // and patch it onto the message so OutcomeReporter renders
          getConversations(token)
            .then((d) => {
              const latest = d.conversations?.[0];
              if (!latest) return;
              const cid = latest.id;
              // Persist so subsequent turns can use it directly
              threadIdRef.current = cid;
              setThreadId(cid);
              setModeLocked(true);
              localStorage.setItem(LAST_CONV_KEY, cid);
              // Patch the message so OutcomeReporter shows immediately
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === msgLocalId ? { ...m, conversationId: cid } : m,
                ),
              );
              setRefreshSidebar((n) => n + 1);
              // Now fetch full stats for this conversation
              return getConversationMessages(token, cid);
            })
            .then((d) => {
              if (d?.stats) setSessionStats(d.stats);
            })
            .catch(() => {});
        }
        return;
      }

      // ── Refinement ──
      if (turnType === "refinement") {
        const text =
          output.reply ?? output.message ?? data.reply ?? data.message ?? "";
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
        const refineConvId = convId ?? threadIdRef.current;
        const refineToken = localStorage.getItem("access_token");
        if (refineConvId && refineToken) {
          getConversationMessages(refineToken, refineConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        }
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
        const freeConvId = convId ?? threadIdRef.current;
        const freeToken = localStorage.getItem("access_token");
        if (freeConvId && freeToken) {
          getConversationMessages(freeToken, freeConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        }
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
            onConversationId: (id) => {
              if (!threadIdRef.current) {
                threadIdRef.current = id;
                setThreadId(id);
                setModeLocked(true);
                localStorage.setItem(LAST_CONV_KEY, id);
              }
            },
            onChunk: (chunkData) => {
              setStreamingPhase("receiving");

              // Buffer the incoming chunk
              setChunkBuffer((prev) => prev + chunkData);

              // Try to extract complete JSON objects from buffer
              let completeJsonEnd = -1;
              let braceCount = 0;
              let inString = false;
              let escapeNext = false;
              const buffer = chunkBuffer + chunkData;

              for (let i = 0; i < buffer.length; i++) {
                const char = buffer[i];

                if (escapeNext) {
                  escapeNext = false;
                  continue;
                }

                if (char === "\\") {
                  escapeNext = true;
                  continue;
                }

                if (char === '"' && !escapeNext) {
                  inString = !inString;
                  continue;
                }

                if (!inString) {
                  if (char === "{") braceCount++;
                  if (char === "}") {
                    braceCount--;
                    if (braceCount === 0) {
                      completeJsonEnd = i;
                      break;
                    }
                  }
                }
              }

              if (completeJsonEnd !== -1) {
                // Extract complete JSON string
                const jsonStr = buffer.substring(0, completeJsonEnd + 1);
                setChunkBuffer(buffer.substring(completeJsonEnd + 1));

                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.text || parsed.content || "";

                  if (text) {
                    if (!streamingMessageId) {
                      const newId = generateId();
                      setStreamingMessageId(newId);
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: newId,
                          role: "assistant",
                          content: text,
                          timestamp: new Date(),
                          isStreaming: true,
                        },
                      ]);
                    } else {
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === streamingMessageId
                            ? { ...msg, content: msg.content + text }
                            : msg,
                        ),
                      );
                    }
                  }
                } catch (e) {
                  // Invalid JSON, ignore
                  console.debug("Failed to parse JSON chunk:", jsonStr);
                }
              }
            },
            onSuggestedPrompts: (prompts) => {
              pendingPrompts = prompts;
            },
            onComplete: (output) => {
              setStreamingPhase("idle");
              setIsTyping(false);

              // Clear buffer
              setChunkBuffer("");

              // Remove streaming message
              if (streamingMessageId) {
                setMessages((prev) =>
                  prev.filter((m) => m.id !== streamingMessageId),
                );
                setStreamingMessageId(null);
              }

              handleComplete(output, currentMode, userMsgId, pendingPrompts);
            },
            onNonStream: (data) => {
              setStreamingPhase("idle");
              setIsTyping(false);

              setChunkBuffer("");

              if (streamingMessageId) {
                setMessages((prev) =>
                  prev.filter((m) => m.id !== streamingMessageId),
                );
                setStreamingMessageId(null);
              }

              const turnType = data.turn_type ?? "";
              if (turnType === "challenge") {
                setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
                setPendingChallenge({
                  challenge: data.challenge ?? "",
                  risk_type: data.risk_type ?? "",
                  originalMessage: content,
                });
                return;
              }
              const prompts = (data.suggested_prompts ?? []).sort(
                (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0),
              );
              handleComplete(data, currentMode, userMsgId, prompts);
            },
            onError: (message, code) => {
              setStreamingPhase("idle");
              setIsTyping(false);
              setChatErrorCode(code ?? null);

              setChunkBuffer("");

              if (streamingMessageId) {
                setMessages((prev) =>
                  prev.filter((m) => m.id !== streamingMessageId),
                );
                setStreamingMessageId(null);
              }

              if (code === "INSUFFICIENT_CREDITS") {
                setInsufficientCredits(true);
                setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
              } else if (code === "USER_NOT_FOUND") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                if (typeof window !== "undefined")
                  window.location.href = "/auth/signin";
              } else if (code === "ACCOUNT_INACTIVE") {
                setChatError(
                  "Your account is inactive. Please contact support.",
                );
              } else {
                setChatError(
                  message || "Something went wrong. Please try again.",
                );
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

  // ── Shared upload stream handler ──────────────────────────────────────────
  const handleUploadStream = useCallback(
    async (
      label: string,
      doUpload: (callbacks: Parameters<typeof uploadFile>[3]) => Promise<void>,
      attachedFile?: { name: string; size: number; fileType: string },
    ) => {
      const token = localStorage.getItem("access_token") ?? "";
      const currentMode = activeModeRef.current;

      const userMsgId = generateId();
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        content: label, // context text typed by user (may be empty)
        timestamp: new Date(),
        attachedFile,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setStreamingPhase("thinking");
      setDetectedCapability("");

      let pendingPrompts: any[] | undefined;

      try {
        await doUpload({
          onCapability: ({ display_name }) => {
            setDetectedCapability(display_name ?? "");
          },
          onCredits: ({ credits_used, credits_remaining }) => {
            applyUsage(credits_used, credits_remaining);
          },
          onConversationId: (id) => {
            if (!threadIdRef.current) {
              threadIdRef.current = id;
              setThreadId(id);
              setModeLocked(true);
              localStorage.setItem(LAST_CONV_KEY, id);
            }
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
            // Non-stream upload: intelligence_response drives the flow
            const ir = data.intelligence_response ?? data;
            const prompts = (ir.suggested_prompts ?? []).sort(
              (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0),
            );
            handleComplete(ir, currentMode, userMsgId, prompts);
          },
          onError: (message, code) => {
            setStreamingPhase("idle");
            setIsTyping(false);
            setChatErrorCode(code ?? null);
            if (code === "INSUFFICIENT_CREDITS") {
              setInsufficientCredits(true);
              setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
            } else if (code === "USER_NOT_FOUND") {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              if (typeof window !== "undefined")
                window.location.href = "/auth/signin";
            } else if (code === "ACCOUNT_INACTIVE") {
              setChatError("Your account is inactive. Please contact support.");
            } else {
              setChatError(
                message || "Something went wrong. Please try again.",
              );
            }
          },
        });
      } catch (err: any) {
        setStreamingPhase("idle");
        setIsTyping(false);
        setChatError(err?.message ?? "Something went wrong. Please try again.");
      }
    },
    [applyUsage, handleComplete],
  );

  const sendFile = useCallback(
    async (file: File, text?: string) => {
      const token = localStorage.getItem("access_token") ?? "";
      const currentMode = activeModeRef.current;
      const currentThreadId = threadIdRef.current;
      await handleUploadStream(
        text?.trim() || "",
        (callbacks) =>
          uploadFile(
            token,
            file,
            { mode: currentMode, thread_id: currentThreadId ?? undefined },
            callbacks,
          ),
        { name: file.name, size: file.size, fileType: file.type },
      );
    },
    [handleUploadStream],
  );

  // ── Two-step voice: transcribe → review → send ────────────────────────────
  const [pendingVoice, setPendingVoice] = useState<{
    audio: Blob;
    transcript: string;
  } | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Step 1: transcribe only — result shown to user for review/editing

  const sendVoice = useCallback(
    async (audio: Blob, onTranscript: (text: string) => void) => {
      const token = localStorage.getItem("access_token") ?? "";
      setIsTranscribing(true);
      try {
        const result = await transcribeVoice(token, audio);
        onTranscript(result.text);
      } catch (err: any) {
        setChatError(err?.message ?? "Transcription failed. Please try again.");
      } finally {
        setIsTranscribing(false);
      }
    },
    [],
  );

  // Step 2: user confirms/edits transcript → send for full intelligence analysis
  const confirmVoiceSend = useCallback(
    async (editedTranscript: string) => {
      if (!pendingVoice) return;
      const { audio } = pendingVoice;
      setPendingVoice(null);
      const token = localStorage.getItem("access_token") ?? "";
      const currentMode = activeModeRef.current;
      const currentThreadId = threadIdRef.current;
      await handleUploadStream(`${editedTranscript}`, (callbacks) =>
        uploadVoice(
          token,
          audio,
          { mode: currentMode, thread_id: currentThreadId ?? undefined },
          callbacks,
        ),
      );
    },
    [pendingVoice, handleUploadStream],
  );

  const dismissPendingVoice = useCallback(() => setPendingVoice(null), []);

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
    chatErrorCode,
    pendingChallenge,
    dismissCreditsAlert,
    dismissChatError,
    silentRefreshStats,
    appendMessage,
    proceedChallenge,
    dismissChallenge,
    setActiveMode,
    sendMessage,
    sendFile,
    sendVoice,
    isTranscribing,
    pendingVoice: null,
    confirmVoiceSend,
    dismissPendingVoice,
    startNewConversation,
    loadConversation,
    restoreLastConversation,
    refreshSidebar,
    // In useChat.ts return object, add:
    conversationSuggestions: activeConversation?.last_suggested_prompts || [],
  };
}
