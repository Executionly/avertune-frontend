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
import { track } from "@/lib/analytics/track";

const LAST_CONV_KEY = "avertune_last_conversation_id";

// ── Normalise a history message → ChatMessage ─────────────────────────────────
function normaliseHistoryMessage(
  msg: any,
  mode: ModeId,
  conversationId?: string,
): ChatMessage {
  const intel = msg.intelligence ?? msg.intelligence_result ?? null;
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
      intelligence: msg.intelligence,
    };
  }

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
      strategic_reasoning: intel.strategic_reasoning,
      question_asked: intel.question_asked,
      coach_note: intel.coach_note ?? msg.coach_note,
      scenario_planning: intel.scenario_planning,
      pushback_scripts: intel.pushback_scripts,
      preparation: intel.preparation,
      conversation_script: intel.conversation_script,
      alternative:
        intel.alternative && typeof intel.alternative === "object"
          ? {
              advice: intel.alternative.advice,
              action_steps: intel.alternative.action_steps,
              why_this_works: intel.alternative.why_this_works,
              generated_reply: intel.alternative.generated_reply,
            }
          : undefined,
      is_degraded: isDegraded,
      upgrade_message: rawReplies?.upgrade_message ?? intel.upgrade_message,
      upgrade_required: rawReplies?.upgrade_required ?? intel.upgrade_required,
      locked_features: rawReplies?.locked_features ?? intel.locked_features,
      available_plans: rawReplies?.available_plans ?? intel.available_plans,
      // ── v2.0 dynamic sections ──────────────────────────────────────────────
      objection_analysis: intel.objection_analysis,
      deal_risk: intel.deal_risk,
      negotiation_guidance: intel.negotiation_guidance,
      follow_up_strategy: intel.follow_up_strategy,
      revenue_opportunity: intel.revenue_opportunity,
      leverage_assessment: intel.leverage_assessment,
      concession_analysis: intel.concession_analysis,
      batna: intel.batna,
      negotiation_strategy: intel.negotiation_strategy,
      team_impact: intel.team_impact,
      retention_risk: intel.retention_risk,
      morale_impact: intel.morale_impact,
      stakeholder_analysis: intel.stakeholder_analysis,
      emotional_insight: intel.emotional_insight,
      relationship_health: intel.relationship_health,
      conflict_drivers: intel.conflict_drivers,
      trust_impact: intel.trust_impact,
      candidate_experience: intel.candidate_experience,
      escalation_risk: intel.escalation_risk,
      compliance_considerations: intel.compliance_considerations,
      customer_sentiment: intel.customer_sentiment,
      churn_risk: intel.churn_risk,
      recovery_strategy: intel.recovery_strategy,
      scoring: Object.keys(scoring).length > 0 ? scoring : undefined,
    };
    return {
      id: msg.id ?? generateId(),
      role: "assistant",
      content: msg.content ?? "",
      timestamp: new Date(msg.created_at ?? Date.now()),
      intelligenceResult,
      naturalScore: intel.natural_score,
      turnType: "generate",
      conversationId,
      intelligence: msg.intelligence,
    };
  }

  return {
    id: msg.id ?? generateId(),
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content ?? "",
    timestamp: new Date(msg.created_at ?? Date.now()),
    intelligence: msg.intelligence,
  };
}

// ── Normalise live complete output → IntelligenceResult ──────────────────────
function normaliseLiveResult(output: any, mode: ModeId): IntelligenceResult {
  const scoring = output.scoring ?? {};
  const payload = output.output ?? output;
  const rawReplies = payload.replies ?? payload.emails ?? payload.responses;
  const isDegraded =
    payload.replies?.is_degraded === true ||
    (rawReplies && typeof rawReplies.basic_advice === "string");

  let replies: Record<string, any> | undefined;
  let recommendedKey: string | undefined;
  let situationRead: string | undefined = payload.situation_read;
  let nextBestAction: string | undefined = payload.next_best_action;

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
    strategic_reasoning: payload.strategic_reasoning,
    question_asked: payload.question_asked,
    coach_note: payload.coach_note,
    scenario_planning: payload.scenario_planning,
    pushback_scripts: payload.pushback_scripts,
    preparation: payload.preparation,
    conversation_script: payload.conversation_script,
    alternative:
      payload.alternative && typeof payload.alternative === "object"
        ? {
            advice: payload.alternative.advice,
            action_steps: payload.alternative.action_steps,
            why_this_works: payload.alternative.why_this_works,
            generated_reply: payload.alternative.generated_reply,
          }
        : undefined,
    is_degraded: isDegraded || payload.replies?.upgrade_required || false,
    upgrade_message:
      payload.replies?.upgrade_message ?? payload.upgrade_message,
    upgrade_required:
      payload.replies?.upgrade_required ?? payload.upgrade_required,
    locked_features:
      payload.replies?.locked_features ?? payload.locked_features,
    available_plans:
      payload.replies?.available_plans ?? payload.available_plans,
    meeting_strategy: payload.meeting_strategy,
    opening_statement: payload.opening_statement,
    key_talking_points: payload.key_talking_points,
    how_to_handle_pushback: payload.how_to_handle_pushback,
    preparation_strategy: payload.preparation_strategy,
    questions_to_ask_interviewer: payload.questions_to_ask_interviewer,
    outreach_angle: payload.outreach_angle,
    power_dynamic: payload.power_dynamic,
    subject_lines: payload.subject_lines,
    // ── v2.0 dynamic sections ──────────────────────────────────────────────
    objection_analysis: payload.objection_analysis,
    deal_risk: payload.deal_risk,
    negotiation_guidance: payload.negotiation_guidance,
    follow_up_strategy: payload.follow_up_strategy,
    revenue_opportunity: payload.revenue_opportunity,
    leverage_assessment: payload.leverage_assessment,
    concession_analysis: payload.concession_analysis,
    batna: payload.batna,
    negotiation_strategy: payload.negotiation_strategy,
    team_impact: payload.team_impact,
    retention_risk: payload.retention_risk,
    morale_impact: payload.morale_impact,
    stakeholder_analysis: payload.stakeholder_analysis,
    emotional_insight: payload.emotional_insight,
    relationship_health: payload.relationship_health,
    conflict_drivers: payload.conflict_drivers,
    trust_impact: payload.trust_impact,
    candidate_experience: payload.candidate_experience,
    escalation_risk: payload.escalation_risk,
    compliance_considerations: payload.compliance_considerations,
    customer_sentiment: payload.customer_sentiment,
    churn_risk: payload.churn_risk,
    recovery_strategy: payload.recovery_strategy,
    scoring: Object.keys(scoring).length > 0 ? scoring : undefined,
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
  retryLastMessage: () => Promise<void>;
  lastFailedMessageId: string | null;
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

  // Retry state
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(
    null,
  );
  const [lastFailedSkipChallenge, setLastFailedSkipChallenge] =
    useState<boolean>(false);
  const [lastFailedMessageId, setLastFailedMessageId] = useState<string | null>(
    null,
  );

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

  const retryLastMessage = useCallback(async () => {
    if (!lastFailedMessage) return;
    const content = lastFailedMessage;
    const skipChallenge = lastFailedSkipChallenge;

    setLastFailedMessageId(null);
    setChatError(null);
    setChatErrorCode(null);
    track("chat_message_retried", { mode: activeModeRef.current });
    await sendMessageInternal(content, skipChallenge);
  }, [lastFailedMessage, lastFailedSkipChallenge]);

  // ── Silent stats refresh ────────────────────────────────────────────────────
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
    setLastFailedMessageId(null);
    setLastFailedMessage(null);
    localStorage.removeItem(LAST_CONV_KEY);
  }, []);

  // ── handleComplete ──────────────────────────────────────────────────────────
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

      const convId =
        output.conversation_id ??
        output.thread_id ??
        data.conversation_id ??
        data.thread_id ??
        (data.output
          ? (data.output.conversation_id ?? data.output.thread_id)
          : undefined);
      if (convId) {
        threadIdRef.current = convId;
        setThreadId(convId);
        setModeLocked(true);
        localStorage.setItem(LAST_CONV_KEY, convId);
      }

      const suggestions: string[] = (
        pendingSuggestedPrompts ??
        output.suggested_prompts ??
        data.suggested_prompts ??
        []
      )
        .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
        .map((p: any) => p.text ?? p);

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

        const failedUserMsg = messages.find((m) => m.id === userMsgId);
        if (failedUserMsg && failedUserMsg.role === "user") {
          setLastFailedMessage(failedUserMsg.content);
          setLastFailedMessageId(userMsgId);
          setLastFailedSkipChallenge(false);
        }

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

      setLastFailedMessageId(null);
      setLastFailedMessage(null);

      if (turnType === "insufficient_credits") {
        setInsufficientCredits(true);
        setMessages((prev) => prev.filter((m) => m.id !== userMsgId));
        return;
      }

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
          getConversationMessages(token, fetchConvId)
            .then((d) => {
              if (d.stats) setSessionStats(d.stats);
              setRefreshSidebar((n) => n + 1);
            })
            .catch(() => {});
        } else {
          getConversations(token)
            .then((d) => {
              const latest = d.conversations?.[0];
              if (!latest) return;
              const cid = latest.id;
              threadIdRef.current = cid;
              setThreadId(cid);
              setModeLocked(true);
              localStorage.setItem(LAST_CONV_KEY, cid);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === msgLocalId ? { ...m, conversationId: cid } : m,
                ),
              );
              setRefreshSidebar((n) => n + 1);
              return getConversationMessages(token, cid);
            })
            .then((d) => {
              if (d?.stats) setSessionStats(d.stats);
            })
            .catch(() => {});
        }
        return;
      }

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
    [messages],
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

      track("chat_message_sent", {
        mode: currentMode,
        is_new_thread: !currentThreadId,
        message_length: content.length,
      });

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
              setChunkBuffer((prev) => prev + chunkData);

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
              setChunkBuffer("");

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

              setLastFailedMessage(content);
              setLastFailedMessageId(userMsgId);
              setLastFailedSkipChallenge(skipChallenge);

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
        setLastFailedMessage(content);
        setLastFailedMessageId(userMsgId);
        setLastFailedSkipChallenge(skipChallenge);
        track("chat_message_error", {
          mode: currentMode,
          error: err?.message ?? "unknown",
        });
      }
    },
    [applyUsage, handleComplete, chunkBuffer, streamingMessageId],
  );

  const proceedChallenge = useCallback(() => {
    if (!pendingChallenge) return;
    const msg = pendingChallenge.originalMessage;
    setPendingChallenge(null);
    sendMessageInternal(msg, true);
  }, [pendingChallenge, sendMessageInternal]);

  const sendMessage = useCallback(
    (content: string, skipChallenge = false) => {
      return sendMessageInternal(content, skipChallenge);
    },
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
        content: label,
        timestamp: new Date(),
        attachedFile,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setStreamingPhase("thinking");
      setDetectedCapability("");

      track(attachedFile ? "chat_file_uploaded" : "chat_voice_sent", {
        mode: currentMode,
        ...(attachedFile
          ? { file_type: attachedFile.fileType, file_size: attachedFile.size }
          : {}),
      });

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
            setLastFailedMessage(label);
            setLastFailedMessageId(userMsgId);
            setLastFailedSkipChallenge(false);
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
        setLastFailedMessage(label);
        setLastFailedMessageId(userMsgId);
        setLastFailedSkipChallenge(false);
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

  // ── Two-step voice ─────────────────────────────────────────────────────────
  const [pendingVoice, setPendingVoice] = useState<{
    audio: Blob;
    transcript: string;
  } | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

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
    retryLastMessage,
    lastFailedMessageId,
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
    conversationSuggestions: activeConversation?.last_suggested_prompts || [],
  };
}
