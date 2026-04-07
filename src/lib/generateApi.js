import { api } from "./apiClient";

// ── Helpers ────────────────────────────────────────────────────────────────
function mapRelationship(val) {
  const map = {
    Colleague: "colleague",
    "Boss / Manager": "boss_manager",
    "Direct report": "direct_report",
    Client: "client",
    "Partner / Spouse": "partner_spouse",
    Friend: "friend",
    Stranger: "stranger",
  };
  return map[val] || val?.toLowerCase() || "colleague";
}

function mapTension(val) {
  const map = {
    "No history": "no_history",
    "Minor tension": "minor_tension",
    "Ongoing conflict": "ongoing_conflict",
    "Recent argument": "recent_argument",
    Reconciling: "reconciling",
  };
  return map[val] || "no_history";
}

function parseChips(val) {
  if (!val) return [];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function capitalize(str) {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// ── Pack ID mapping (internal → backend) ───────────────────────────────────
const PACK_ID_TO_BACKEND = {
  personal: "personal",
  customer_support: "customer_support",
  work: "work_corporate", // internal "work" → backend "work_corporate"
  sales: "sales_negotiation", // internal "sales" → backend "sales_negotiation"
  dating: "dating",
  core_professional: "core_professional",
};

// ── Request builders ──────────────────────────────────────────────────────────
function buildRepliesRequest(fields) {
  const ps = fields.pack_scenario || {};
  const chips = parseChips(fields.context);
  if (ps.scenarioLabel) chips.push(ps.scenarioLabel);

  // Map internal pack ID to backend enum
  const backendPack = ps.packId
    ? PACK_ID_TO_BACKEND[ps.packId] || ps.packId
    : "";

  return {
    message: fields.message || "",
    thread_context: "",
    medium: fields.medium || "email",
    preferred_length: fields.length || "short",
    tone: fields.tone_pref || "professional",
    goal: fields.goal || "",
    audience: fields.audience || "",
    context_chips: chips,
    pack: backendPack,
  };
}

function buildToneRequest(fields) {
  return {
    message: fields.message || "",
    relationship: mapRelationship(fields.relationship),
    prior_tension: mapTension(fields.history),
    context: fields.context || "",
  };
}

function buildBoundaryRequest(fields) {
  return {
    what_is_happening: fields.what_is_happening || "",
    what_boundary_needed: fields.what_boundary_needed || "",
    relationship: fields.relationship || "colleague",
    relationship_stakes: fields.relationship_stakes || "medium",
    said_before: fields.said_before || "first_time",
    medium: fields.medium || "email",
  };
}

function buildNegotiationRequest(fields) {
  return {
    their_message: fields.their_message || "",
    your_position: fields.your_position || "",
    negotiation_context: fields.negotiation_context || "salary_negotiation",
    leverage: fields.leverage || "moderate",
    style: fields.style || "collaborative",
    context: "",
    medium: fields.medium || "email",
  };
}

function buildFollowupRequest(fields) {
  return {
    context: fields.context || "",
    last_contact: fields.last_contact || "1_week",
    follow_up_type: fields.follow_up_type || "job_application",
    follow_up_number: fields.follow_up_number || "first_follow_up",
    preferred_tone: fields.preferred_tone || "professional",
    medium: fields.medium || "email",
    extra_detail: "",
  };
}

function buildDifficultEmailRequest(fields) {
  return {
    what_to_communicate: fields.what_to_communicate || "",
    draft: fields.draft || "",
    situation: fields.situation || "giving_bad_news",
    relationship: fields.relationship || "client",
    sensitivity: fields.sensitivity || "medium",
    context: "",
  };
}

function buildIntentRequest(fields) {
  return {
    message: fields.message || "",
    relationship: fields.relationship || "colleague",
    channel: fields.channel || "email",
    background: fields.background || "",
  };
}

// ── Response normalizers (all include _generationId) ─────────────────────────

function normalizeRepliesResponse(raw) {
  const data = raw.data || raw;
  const replies = {};
  const insights = {};
  const descriptors = {};
  let recommendedVariant = null;

  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant);
      replies[key] = r.text || "";
      insights[key] = r.insight || "";
      descriptors[key] = r.descriptor || "";
      if (r.recommended) recommendedVariant = key;
    });
  }

  const { replies: _, ...rest } = data;
  return {
    replies,
    _replyInsights: insights,
    _replyDescriptors: descriptors,
    _recommendedVariant: recommendedVariant,
    ...rest,
    _remaining: raw.remaining,
    _limit: raw.limit,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

function normalizeToneResponse(raw) {
  const data = raw.data || raw;
  return {
    primary_tone: data.primary_tone || "",
    secondary_signals: data.secondary_signals || [],
    emotional_intensity: data.emotional_intensity || "",
    risk_level: data.risk_level || "",
    interpretation: data.interpretation || "",
    _remaining: raw.remaining,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

function normalizeBoundaryResponse(raw) {
  const data = raw.data || raw;
  const replies = {};
  const insights = {};
  const responses = data.responses || {};
  const variants = ["soft", "balanced", "firm"];
  variants.forEach((v) => {
    const text = responses[v];
    if (text) {
      const key = capitalize(v);
      replies[key] = text;
    }
  });
  const { responses: _, ...rest } = data;
  return {
    replies,
    _replyInsights: insights,
    _replyDescriptors: {},
    _recommendedVariant: data.recommended ? capitalize(data.recommended) : null,
    situation_read: data.situation_read || "",
    power_note: data.power_note || data.what_to_avoid || "",
    ...rest,
    _remaining: raw.remaining,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

function normalizeNegotiationResponse(raw) {
  const data = raw.data || raw;
  const replies = {};
  const insights = {};
  const repliesObj = data.replies || {};
  Object.entries(repliesObj).forEach(([key, value]) => {
    const displayKey = key
      .split("_")
      .map((w) => capitalize(w))
      .join(" ");
    replies[displayKey] = value.text || value;
    insights[displayKey] = value.insight || "";
  });
  const { replies: _, ...rest } = data;
  return {
    replies,
    _replyInsights: insights,
    _replyDescriptors: {},
    _recommendedVariant: data.recommended
      ? data.recommended
          .split("_")
          .map((w) => capitalize(w))
          .join(" ")
      : null,
    situation_read: data.situation_read || "",
    insight: data.insight || "",
    ...rest,
    _remaining: raw.remaining,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

function normalizeFollowupResponse(raw) {
  const data = raw.data || raw;
  const replies = {};
  const insights = {};
  const followUps = data.follow_ups || {};
  Object.entries(followUps).forEach(([key, value]) => {
    const displayKey = key
      .split("_")
      .map((w) => capitalize(w))
      .join(" ");
    if (typeof value === "object" && value !== null) {
      replies[displayKey] = value.body || "";
      insights[displayKey] = value.subject || "";
      if (!replies._emailDetails) replies._emailDetails = {};
      replies._emailDetails[displayKey] = value;
    } else {
      replies[displayKey] = value || "";
    }
  });
  const { follow_ups: _, ...rest } = data;
  return {
    replies,
    _replyInsights: insights,
    _replyDescriptors: {},
    _recommendedVariant: data.recommended
      ? data.recommended
          .split("_")
          .map((w) => capitalize(w))
          .join(" ")
      : null,
    ...rest,
    _remaining: raw.remaining,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

function normalizeDifficultEmailResponse(raw) {
  const data = raw.data || raw;
  const replies = {};
  const insights = {};
  const emails = data.emails || {};
  Object.entries(emails).forEach(([key, value]) => {
    const displayKey = capitalize(key);
    replies[displayKey] = value.body || "";
    insights[displayKey] = value.insight || "";
    if (!replies._emailSubjects) replies._emailSubjects = {};
    replies._emailSubjects[displayKey] = value.subject || "";
  });
  const { emails: _, ...rest } = data;
  return {
    replies,
    _replyInsights: insights,
    _replyDescriptors: {},
    _recommendedVariant: data.recommended ? capitalize(data.recommended) : null,
    ...rest,
    _remaining: raw.remaining,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

function normalizeIntentResponse(raw) {
  const data = raw.data || raw;
  return {
    surface_meaning: data.surface_meaning || "",
    likely_intents: data.likely_intents || [],
    primary_intent: data.primary_intent || "",
    emotional_tone: data.emotional_tone || "",
    subtext: data.subtext || "",
    risk_indicators: data.risk_indicators || [],
    what_they_want: data.what_they_want || "",
    what_they_expect_next: data.what_they_expect_next || "",
    confidence: data.confidence || 0,
    trust_signal: data.trust_signal || "",
    recommended_response_strategy: data.recommended_response_strategy || "",
    ...data,
    _remaining: raw.remaining,
    _raw: raw,
    _generationId: raw.generation_id || data.generation_id || raw.id || data.id,
  };
}

// ── API calls ───────────────────────────────────────────────────────────────
export const generateApi = {
  replies: async (fields) => {
    const { data } = await api.post(
      "/generate/replies",
      buildRepliesRequest(fields),
    );
    return normalizeRepliesResponse(data);
  },
  tone: async (fields) => {
    const { data } = await api.post("/generate/tone", buildToneRequest(fields));
    return normalizeToneResponse(data);
  },
  boundary: async (fields) => {
    const { data } = await api.post(
      "/generate/boundary",
      buildBoundaryRequest(fields),
    );
    return normalizeBoundaryResponse(data);
  },
  negotiation: async (fields) => {
    const { data } = await api.post(
      "/generate/negotiation",
      buildNegotiationRequest(fields),
    );
    return normalizeNegotiationResponse(data);
  },
  followup: async (fields) => {
    const { data } = await api.post(
      "/generate/followup",
      buildFollowupRequest(fields),
    );
    return normalizeFollowupResponse(data);
  },
  difficultEmail: async (fields) => {
    const { data } = await api.post(
      "/generate/difficult-email",
      buildDifficultEmailRequest(fields),
    );
    return normalizeDifficultEmailResponse(data);
  },
  intent: async (fields) => {
    const { data } = await api.post(
      "/generate/intent",
      buildIntentRequest(fields),
    );
    return normalizeIntentResponse(data);
  },
};
