import { api } from "./apiClient";

// ── Helper functions ─────────────────────────────────────────────────────

function parseChips(val) {
  if (!val) return [];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);
}

function normalizeMedium(val) {
  const map = {
    Email: "email",
    "SMS / Text": "sms",
    WhatsApp: "whatsapp",
    LinkedIn: "linkedin",
    Slack: "slack",
    "In person": "in_person",
  };
  return map[val] || val.toLowerCase();
}

function capitalize(str) {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Map UI values to backend enums
function mapLength(val) {
  const map = {
    "Very short (1-2 sentences)": "very_short",
    "Short (3-4 sentences)": "short",
    "Medium (1 paragraph)": "medium",
    "Long (detailed)": "long",
  };
  return map[val] || "short";
}

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
  return map[val] || "colleague";
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

function mapSaidBefore(val) {
  const map = {
    first_time: "first_time",
    said_once: "said_once",
    said_multiple_times: "said_multiple_times",
  };
  return map[val] || val;
}

function mapStakes(val) {
  const map = {
    high: "high",
    medium: "medium",
    low: "low",
  };
  return map[val] || "medium";
}

function mapLeverage(val) {
  const map = {
    strong: "strong",
    moderate: "moderate",
    weak: "weak",
    unknown: "unknown",
  };
  return map[val] || "moderate";
}

function mapStyle(val) {
  const map = {
    collaborative: "collaborative",
    competitive: "competitive",
    principled: "principled",
    relationship_first: "relationship_first",
  };
  return map[val] || "collaborative";
}

function mapFollowUpType(val) {
  const map = {
    job_application: "job_application",
    sales_proposal: "sales_proposal",
    invoice_payment: "invoice_payment",
    meeting_request: "meeting_request",
    project_update: "project_update",
    personal: "personal",
    other: "other",
  };
  return map[val] || "other";
}

function mapFollowUpNumber(val) {
  const map = {
    first_follow_up: "first_follow_up",
    second_follow_up: "second_follow_up",
    third_follow_up: "third_follow_up",
    post_meeting: "post_meeting",
  };
  return map[val] || "first_follow_up";
}

function mapTone(val) {
  const map = {
    professional: "professional",
    friendly: "friendly",
    urgent: "urgent",
    brief: "brief",
  };
  return map[val] || "professional";
}

function mapSituation(val) {
  const map = {
    giving_bad_news: "giving_bad_news",
    declining_request: "declining_request",
    addressing_conflict: "addressing_conflict",
    delivering_feedback: "delivering_feedback",
    apologizing: "apologizing",
    setting_expectations: "setting_expectations",
    other: "other",
  };
  return map[val] || "other";
}

function mapSensitivity(val) {
  const map = {
    high: "high",
    medium: "medium",
    low: "low",
  };
  return map[val] || "medium";
}

function mapChannel(val) {
  const map = {
    email: "email",
    slack: "slack",
    whatsapp: "whatsapp",
    sms: "sms",
    linkedin: "linkedin",
    in_person: "in_person",
  };
  return map[val] || "email";
}

// ── Request builders ─────────────────────────────────────────────────────

function buildRepliesRequest(fields) {
  const ps = fields.pack_scenario || {};
  const chips = parseChips(fields.context);
  if (ps.scenarioLabel) chips.push(ps.scenarioLabel);

  return {
    message: fields.message || "",
    thread_context: "",
    medium: normalizeMedium(fields.medium || "Email"),
    preferred_length: mapLength(fields.length),
    tone: (fields.tone_pref || "Professional").toLowerCase(),
    goal: fields.goal || "",
    audience: fields.audience || "",
    context_chips: chips.slice(0, 2),
    pack: ps.packId || "",
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
    relationship: fields.relationship || "",
    relationship_stakes: fields.relationship_stakes || "medium",
    said_before: mapSaidBefore(fields.said_before) || "first_time",
    medium: normalizeMedium(fields.medium || "Email"),
  };
}

function buildNegotiationRequest(fields) {
  return {
    their_message: fields.their_message || "",
    your_position: fields.your_position || "",
    negotiation_context: fields.negotiation_context || "",
    leverage: mapLeverage(fields.leverage),
    style: mapStyle(fields.style),
    context: "",
    medium: normalizeMedium(fields.medium || "Email"),
  };
}

function buildFollowupRequest(fields) {
  return {
    context: fields.context || "",
    last_contact: fields.last_contact || "",
    follow_up_type: mapFollowUpType(fields.follow_up_type),
    follow_up_number: mapFollowUpNumber(fields.follow_up_number),
    preferred_tone: mapTone(fields.preferred_tone),
    medium: normalizeMedium(fields.medium || "Email"),
    extra_detail: "",
  };
}

function buildDifficultEmailRequest(fields) {
  return {
    what_to_communicate: fields.what_to_communicate || "",
    draft: fields.draft || "",
    situation: mapSituation(fields.situation),
    relationship: fields.relationship || "",
    sensitivity: mapSensitivity(fields.sensitivity),
    context: "",
  };
}

function buildIntentRequest(fields) {
  return {
    message: fields.message || "",
    relationship: fields.relationship || "",
    channel: mapChannel(fields.channel),
    background: fields.background || "",
  };
}

// ── Response normalizers ─────────────────────────────────────────────────

function normalizeRepliesResponse(data) {
  const briefing = data.decision_briefing || {};
  const receipt = data.tone_receipt || {};

  const repliesMap = {};
  const replyInsights = {};
  const replyDescriptors = {};
  let recommendedVariant = null;

  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant);
      repliesMap[key] = r.text || "";
      replyInsights[key] = r.insight || "";
      replyDescriptors[key] = r.label || "";
      if (r.recommended) recommendedVariant = key;
    });
  } else if (data.replies && typeof data.replies === "object") {
    Object.assign(repliesMap, data.replies);
  }

  const toneScores = [];
  if (receipt.respect != null) toneScores.push(`Respect ${receipt.respect}%`);
  if (receipt.warmth != null) toneScores.push(`Warmth ${receipt.warmth}%`);
  if (receipt.confidence != null)
    toneScores.push(`Confidence ${receipt.confidence}%`);

  return {
    tone: toneScores[0] || "",
    risk: capitalize(briefing.risk_level || ""),
    intent: briefing.what_is_happening || "",
    strategy: briefing.recommended_strategy || "",
    tip: receipt.risk_note || "",
    replies: repliesMap,
    _replyInsights: replyInsights,
    _replyDescriptors: replyDescriptors,
    _recommendedVariant: recommendedVariant,
    _remaining: data.remaining,
    _limit: data.limit,
    _raw: data,
  };
}

function normalizeToneResponse(data) {
  return {
    primary_tone: data.primary_tone || "",
    secondary_tone: data.secondary_tone || "",
    intent: data.intent || "",
    subtext: data.subtext || "",
    risk_level: data.risk_level || "",
    risk_reason: data.risk_reason || "",
    emotional_signals: data.emotional_signals || [],
    what_not_to_do: data.what_not_to_do || "",
    recommended_approach: data.recommended_approach || "",
    urgency: data.urgency || "",
    urgency_reason: data.urgency_reason || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeBoundaryResponse(data) {
  const repliesMap = {};
  const replyInsights = {};
  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant || r.label || "");
      repliesMap[key] = r.text || "";
      replyInsights[key] = r.insight || "";
    });
  } else if (data.replies && typeof data.replies === "object") {
    Object.assign(repliesMap, data.replies);
  }
  return {
    replies: repliesMap,
    _replyInsights: replyInsights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.power_note || data.tip || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeNegotiationResponse(data) {
  const repliesMap = {};
  const replyInsights = {};
  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant || r.label || "");
      repliesMap[key] = r.text || "";
      replyInsights[key] = r.insight || "";
    });
  } else if (data.replies && typeof data.replies === "object") {
    Object.assign(repliesMap, data.replies);
  }
  return {
    replies: repliesMap,
    _replyInsights: replyInsights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.strategic_insights || data.tip || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeFollowupResponse(data) {
  const repliesMap = {};
  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant || r.label || "");
      repliesMap[key] = r.text || "";
    });
  } else if (data.replies && typeof data.replies === "object") {
    Object.assign(repliesMap, data.replies);
  }
  return {
    replies: repliesMap,
    _replyInsights: {},
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.timing_note || data.tip || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeDifficultEmailResponse(data) {
  const repliesMap = {};
  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant || r.label || "");
      repliesMap[key] = r.text || "";
    });
  } else if (data.replies && typeof data.replies === "object") {
    Object.assign(repliesMap, data.replies);
  }
  return {
    replies: repliesMap,
    _replyInsights: {},
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.safety_note || data.tip || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeIntentResponse(data) {
  return {
    primary_tone: data.surface_meaning || data.primary_tone || "",
    secondary_tone: data.real_intent || data.secondary_tone || "",
    intent: data.real_intent || data.intent || "",
    subtext: data.decoded_subtext || data.subtext || "",
    risk_level: data.warning_level || data.risk_level || "",
    risk_reason: data.risk_reason || "",
    emotional_signals: data.warning_signals || data.emotional_signals || [],
    what_not_to_do: data.what_not_to_do || "",
    recommended_approach: data.recommended_approach || "",
    urgency: data.emotional_state || data.urgency || "",
    urgency_reason: data.urgency_reason || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

// ── API calls ─────────────────────────────────────────────────────────────

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
