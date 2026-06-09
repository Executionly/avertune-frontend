const BASE = "https://avertuneserver.xyz/api";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface IntelligenceRequest {
  mode: string;
  capability?: string;
  message: string;
  thread_id?: string;
  stream?: boolean;
  platform?: string;
  style?: string;
  preferred_length?: string;
  context?: Record<string, any>;
}

export interface IntelligenceResponse {
  mode: string;
  scenario: string;
  risk_level?: string;
  analysis: string;
  strategy: string;
  responses: Array<{
    type: string;
    reply: string;
    why_it_works?: string;
    likely_outcome?: string;
    confidence: number;
  }>;
  scores?: {
    confidence?: number;
    clarity?: number;
    tone_match?: string;
    escalation_risk?: string;
  };
  thread_id?: string;
  title?: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: string;
  message_count: number;
  capability: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intelligence_result?: any;
  created_at: string;
}

export interface ConversationStats {
  ci_score: number;
  avg_risk_score: number;
  avg_clarity_score: number;
  avg_confidence: number;
  credits_used: number;
  message_count: { total: number; user: number; assistant: number };
  mode_breakdown: Record<string, number>;
  skill_scores: {
    clarity: number;
    tone_control: number;
    negotiation: number;
    boundaries: number;
    relationships: number;
  };
  relationship_impact: { positive: number; neutral: number; negative: number };
  capability_breakdown: Record<string, number>;
  insights: string[];
}

export interface ConversationMessagesResponse {
  messages: ConversationMessage[];
  conversation: Conversation;
  stats?: ConversationStats;
}

export interface CreditsResponse {
  credits_used: number;
  credits_remaining: number;
  credits_limit: number;
  plan_name: string;
  reset_date?: string;
}

export interface CreditTransaction {
  id: string;
  type: "usage" | "top_up" | "reset" | "bonus";
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface CreditsHistoryResponse {
  transactions: CreditTransaction[];
}

export interface OutcomeRequest {
  result:
    | "worked"
    | "partially"
    | "did_not_work"
    | "still_ongoing"
    | "no_response";
  what_happened?: string;
  message_id?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function authFetch(url: string, token: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `API error ${res.status}`);
  }
  return res.json();
}

// ── Analyse (streaming) ────────────────────────────────────────────────────────

export async function analyseMessageStream(
  token: string,
  req: IntelligenceRequest,
  callbacks: {
    onCapability?: (data: {
      capability: string;
      display_name: string;
      credit_cost: number;
    }) => void;
    onCredits?: (data: {
      credits_used: number;
      credits_remaining: number;
    }) => void;
    onChunk?: (text: string) => void;
    onComplete?: (output: any) => void;
    onSuggestedPrompts?: (prompts: any[]) => void;
    onConversationId?: (id: string) => void;
    onError?: (message: string, code?: string) => void;
    onNonStream?: (data: any) => void;
  },
): Promise<void> {
  const res = await fetch(`${BASE}/intelligence/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...req, stream: true }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `API error ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/event-stream")) {
    const data = await res.json();
    callbacks.onNonStream?.(data);
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let eventType = "";
  let pendingComplete: any = undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";

    for (const line of lines) {
      const t = line.trim();
      if (!t) {
        eventType = "";
        continue;
      }

      if (t.startsWith("event:")) {
        eventType = t.slice(6).trim();
        continue;
      }

      if (!t.startsWith("data:")) continue;
      const raw = t.slice(5).trim();

      try {
        const parsed = JSON.parse(raw);

        // Capture conversation_id from any SSE event that carries it
        const cid = parsed.conversation_id ?? parsed.thread_id;
        if (cid) callbacks.onConversationId?.(cid);

        if (eventType === "capability") callbacks.onCapability?.(parsed);
        else if (eventType === "credits") callbacks.onCredits?.(parsed);
        else if (eventType === "chunk") callbacks.onChunk?.(parsed.text ?? "");
        else if (eventType === "complete") {
          // Buffer — don't fire yet; suggested_prompts arrives after complete
          pendingComplete = parsed;
        }
        else if (eventType === "suggested_prompts") {
          callbacks.onSuggestedPrompts?.(parsed.suggested_prompts ?? parsed);
          // Fire buffered complete now — prompts are delivered
          if (pendingComplete !== undefined) {
            callbacks.onComplete?.(pendingComplete);
            pendingComplete = undefined;
          }
        }
        // "done" event intentionally ignored — suggested_prompts arrives after it,
        // so we let EOF safety fire onComplete if needed
        else if (eventType === "error")
          callbacks.onError?.(
            parsed.message ?? parsed.error ?? "Stream error",
            parsed.code,
          );
      } catch {}
    }
  }

  // EOF safety — fire complete if stream ended without done/suggested_prompts
  if (pendingComplete !== undefined) {
    callbacks.onComplete?.(pendingComplete);
  }
}

// ── Analyse (non-streaming fallback) ──────────────────────────────────────────

export async function analyseMessage(
  token: string,
  req: IntelligenceRequest,
): Promise<any> {
  return authFetch(`${BASE}/intelligence/analyze`, token, {
    method: "POST",
    body: JSON.stringify(req),
  });
}

// ── Conversations list ─────────────────────────────────────────────────────────

export async function getConversations(
  token: string,
  page = 1,
  limit = 30,
  mode?: string,
): Promise<ConversationsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (mode) params.set("mode", mode);
  return authFetch(`${BASE}/intelligence/conversations?${params}`, token);
}

// ── Single conversation messages ───────────────────────────────────────────────

export async function getConversationMessages(
  token: string,
  conversationId: string,
): Promise<ConversationMessagesResponse> {
  return authFetch(
    `${BASE}/intelligence/conversations/${conversationId}`,
    token,
  );
}

// ── Delete conversation ────────────────────────────────────────────────────────

export async function deleteConversation(
  token: string,
  conversationId: string,
): Promise<void> {
  await authFetch(
    `${BASE}/intelligence/conversations/${conversationId}`,
    token,
    {
      method: "DELETE",
    },
  );
}

// ── Archive conversation ───────────────────────────────────────────────────────

export async function archiveConversation(
  token: string,
  conversationId: string,
): Promise<void> {
  await authFetch(
    `${BASE}/intelligence/conversations/${conversationId}/archive`,
    token,
    { method: "PATCH" },
  );
}

// ── Report outcome ─────────────────────────────────────────────────────────────

export async function reportOutcome(
  token: string,
  conversationId: string,
  outcome: OutcomeRequest,
): Promise<any> {
  return authFetch(
    `${BASE}/intelligence/conversations/${conversationId}/outcome`,
    token,
    { method: "POST", body: JSON.stringify(outcome) },
  );
}

// ── Credits ────────────────────────────────────────────────────────────────────

export async function getCredits(token: string): Promise<CreditsResponse> {
  return authFetch(`${BASE}/intelligence/credits`, token);
}

export async function getCreditsHistory(
  token: string,
): Promise<CreditsHistoryResponse> {
  return authFetch(`${BASE}/intelligence/credits/history`, token);
}

// ── Brand voice ────────────────────────────────────────────────────────────────

export async function getBrandVoice(token: string): Promise<any> {
  return authFetch(`${BASE}/intelligence/brand`, token);
}

export async function saveBrandVoice(token: string, data: any): Promise<any> {
  return authFetch(`${BASE}/intelligence/brand`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Analytics ──────────────────────────────────────────────────────────────────

export async function getAnalytics(
  token: string,
  period?: "daily" | "weekly" | "monthly",
): Promise<any> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  const query = params.toString() ? `?${params}` : "";
  return authFetch(`${BASE}/intelligence/analytics${query}`, token);
}

// ── Sample Messages ────────────────────────────────────────────────────────────

export async function getSampleMessages(
  token: string,
  mode?: string,
): Promise<any> {
  const params = new URLSearchParams();
  if (mode) params.set("mode", mode);
  const query = params.toString() ? `?${params}` : "";
  return authFetch(`${BASE}/intelligence/sample-messages${query}`, token);
}

// ── File Upload ────────────────────────────────────────────────────────────────

export interface UploadCallbacks {
  onCapability?: (data: { capability: string; display_name: string; credit_cost: number }) => void;
  onCredits?: (data: { credits_used: number; credits_remaining: number }) => void;
  onChunk?: (text: string) => void;
  onComplete?: (output: any) => void;
  onSuggestedPrompts?: (prompts: any[]) => void;
  onConversationId?: (id: string) => void;
  onError?: (message: string, code?: string) => void;
  onNonStream?: (data: any) => void;
}

async function handleUploadStream(res: Response, callbacks: UploadCallbacks): Promise<void> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/event-stream")) {
    const data = await res.json();
    // For non-stream: check if ready_to_generate or return the full response
    callbacks.onNonStream?.(data);
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let eventType = "";
  let pendingComplete: any = undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";

    for (const line of lines) {
      const t = line.trim();
      if (!t) { eventType = ""; continue; }
      if (t.startsWith("event:")) { eventType = t.slice(6).trim(); continue; }
      if (!t.startsWith("data:")) continue;
      const raw = t.slice(5).trim();

      try {
        const parsed = JSON.parse(raw);
        const cid = parsed.conversation_id ?? parsed.thread_id
          ?? parsed.intelligence_response?.conversation_id;
        if (cid) callbacks.onConversationId?.(cid);

        if (eventType === "capability") callbacks.onCapability?.(parsed);
        else if (eventType === "credits") callbacks.onCredits?.(parsed);
        else if (eventType === "chunk") callbacks.onChunk?.(parsed.text ?? "");
        else if (eventType === "complete") {
          pendingComplete = parsed;
        }
        else if (eventType === "suggested_prompts") {
          callbacks.onSuggestedPrompts?.(parsed.suggested_prompts ?? parsed);
          if (pendingComplete !== undefined) {
            callbacks.onComplete?.(pendingComplete);
            pendingComplete = undefined;
          }
        }
        // "done" event intentionally ignored — suggested_prompts arrives after it
        else if (eventType === "error")
          callbacks.onError?.(parsed.message ?? parsed.error ?? "Upload error", parsed.code);
      } catch {}
    }
  }

  if (pendingComplete !== undefined) {
    callbacks.onComplete?.(pendingComplete);
  }
}

export async function uploadFile(
  token: string,
  file: File,
  params: { mode: string; capability?: string; thread_id?: string },
  callbacks: UploadCallbacks,
): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  form.append("mode", params.mode);
  if (params.capability) form.append("capability", params.capability);
  if (params.thread_id) form.append("thread_id", params.thread_id);

  const res = await fetch(`${BASE}/intelligence/upload/file?stream=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `Upload error ${res.status}`);
  }

  await handleUploadStream(res, callbacks);
}

export async function uploadVoice(
  token: string,
  audio: Blob,
  params: { mode: string; capability?: string; thread_id?: string; language?: string },
  callbacks: UploadCallbacks,
): Promise<void> {
  const form = new FormData();
  form.append("audio", audio, "recording.webm");
  form.append("mode", params.mode);
  if (params.capability) form.append("capability", params.capability);
  if (params.thread_id) form.append("thread_id", params.thread_id);
  if (params.language) form.append("language", params.language);

  const res = await fetch(`${BASE}/intelligence/upload/voice?stream=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `Voice upload error ${res.status}`);
  }

  await handleUploadStream(res, callbacks);
}

export async function transcribeVoice(
  token: string,
  audio: Blob,
  params: { language?: string } = {},
): Promise<{ text: string; metadata?: Record<string, any> }> {
  const form = new FormData();
  form.append("audio", audio, "recording.webm");
  if (params.language) form.append("language", params.language);

  const res = await fetch(`${BASE}/intelligence/upload/voice/transcribe`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `Transcribe error ${res.status}`);
  }

  const data = await res.json();
  return {
    text: data.extraction?.text ?? data.text ?? "",
    metadata: data.extraction?.metadata ?? data.metadata,
  };
}
