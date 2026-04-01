import { api } from "./apiClient";

// ── Field mappers (convert frontend values to backend enums) ─────────────────
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

function mapLength(val) {
  const map = {
    "Very short (1-2 sentences)": "very_short",
    "Short (3-4 sentences)": "short",
    "Medium (1 paragraph)": "medium",
    "Long (detailed)": "long",
  };
  return map[val] || "short";
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
  return map[val] || val?.toLowerCase() || "email";
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

// ── Request builders ────────────────────────────────────────────────────────
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
    context_chips: chips,
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
    relationship: mapRelationship(fields.relationship),
    relationship_stakes: fields.relationship_stakes || "medium",
    said_before: fields.said_before || "first_time",
    medium: normalizeMedium(fields.medium || "Email"),
  };
}

function buildNegotiationRequest(fields) {
  return {
    their_message: fields.their_message || "",
    your_position: fields.your_position || "",
    negotiation_context: fields.negotiation_context || "",
    leverage: fields.leverage || "moderate",
    style: fields.style || "collaborative",
    context: "",
    medium: normalizeMedium(fields.medium || "Email"),
  };
}

function buildFollowupRequest(fields) {
  return {
    context: fields.context || "",
    last_contact: fields.last_contact || "",
    follow_up_type: fields.follow_up_type || "",
    follow_up_number: fields.follow_up_number || "",
    preferred_tone: fields.preferred_tone || "",
    medium: normalizeMedium(fields.medium || "Email"),
    extra_detail: "",
  };
}

function buildDifficultEmailRequest(fields) {
  return {
    what_to_communicate: fields.what_to_communicate || "",
    draft: fields.draft || "",
    situation: fields.situation || "",
    relationship: mapRelationship(fields.relationship),
    sensitivity: fields.sensitivity || "medium",
    context: "",
  };
}

function buildIntentRequest(fields) {
  return {
    message: fields.message || "",
    relationship: mapRelationship(fields.relationship),
    channel: (fields.channel || "email").toLowerCase(),
    background: fields.background || "",
  };
}

// ── Response normalizers (convert backend shape to frontend expected shape) ─
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
  if (receipt.respect) toneScores.push(`Respect ${receipt.respect}%`);
  if (receipt.warmth) toneScores.push(`Warmth ${receipt.warmth}%`);
  if (receipt.confidence) toneScores.push(`Confidence ${receipt.confidence}%`);

  return {
    tone: toneScores[0] || "",
    risk: capitalize(briefing.risk_level || ""),
    intent: briefing.what_is_happening || "",
    strategy: briefing.recommended_strategy || "",
    tip: receipt.risk_note || "",
    risk_detail: "",
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
  // data: { tone, emotional_temperature, intent, power_dynamic, risk_level, ... }
  return {
    primary_tone: data.tone || "",
    secondary_tone: data.emotional_temperature || "",
    intent: data.intent || "",
    subtext: data.subtext || "",
    risk_level: data.risk_level || "",
    risk_reason: data.power_dynamic || "",
    emotional_signals: data.awareness_points || [],
    what_not_to_do: "",
    recommended_approach: data.recommended_action || "",
    urgency: data.emotional_charge || "",
    urgency_reason: "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeBoundaryResponse(data) {
  // Backend returns { situation_read, boundary_statement: { firm, gentle, final }, what_to_avoid, power_note, ... }
  const repliesMap = {};
  const replyInsights = {};
  const statement = data.boundary_statement || {};
  const variants = ["firm", "gentle", "final"];
  variants.forEach((v) => {
    const item = statement[v];
    if (item) {
      const key = capitalize(v); // 'Firm', 'Gentle', 'Final'
      repliesMap[key] = item.text || "";
      replyInsights[key] = item.insight || "";
    }
  });
  return {
    replies: repliesMap,
    _replyInsights: replyInsights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.power_note || data.what_to_avoid || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeNegotiationResponse(data) {
  // Assuming backend returns { replies: [{ variant, text, insight }] } or similar
  const repliesMap = {};
  const replyInsights = {};
  if (Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant);
      repliesMap[key] = r.text || "";
      replyInsights[key] = r.insight || "";
    });
  } else if (data.replies && typeof data.replies === "object") {
    Object.assign(repliesMap, data.replies);
  } else {
    // Fallback: maybe returns { hold_firm: { text, insight }, ... }
    const possible = ["hold_firm", "counter", "collaborative"];
    possible.forEach((v) => {
      const item = data[v];
      if (item) {
        const key = capitalize(v);
        repliesMap[key] = item.text || "";
        replyInsights[key] = item.insight || "";
      }
    });
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
  // Backend returns data.messages.standard and data.messages.shorter
  const repliesMap = {};
  const replyInsights = {};
  if (data.messages) {
    if (data.messages.standard) {
      repliesMap["Standard"] = data.messages.standard.text || "";
      replyInsights["Standard"] = data.messages.standard.insight || "";
    }
    if (data.messages.shorter) {
      repliesMap["Shorter"] = data.messages.shorter.text || "";
      replyInsights["Shorter"] = data.messages.shorter.insight || "";
    }
  }
  return {
    replies: repliesMap,
    _replyInsights: replyInsights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.timing_note || data.response_tip || data.what_to_avoid || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeDifficultEmailResponse(data) {
  // Backend returns data.emails.safe and data.emails.direct
  const repliesMap = {};
  const replyInsights = {};
  if (data.emails) {
    if (data.emails.safe) {
      repliesMap["Safe"] = data.emails.safe.body || "";
      replyInsights["Safe"] = data.emails.safe.insight || "";
    }
    if (data.emails.direct) {
      repliesMap["Direct"] = data.emails.direct.body || "";
      replyInsights["Direct"] = data.emails.direct.insight || "";
    }
  }
  return {
    replies: repliesMap,
    _replyInsights: replyInsights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip: data.safety_note || data.what_to_avoid || "",
    _remaining: data.remaining,
    _raw: data,
  };
}

function normalizeIntentResponse(data) {
  // Similar to tone checker
  return {
    primary_tone: data.tone || "",
    secondary_tone: data.emotional_temperature || "",
    intent: data.intent || "",
    subtext: data.subtext || "",
    risk_level: data.risk_level || "",
    risk_reason: data.power_dynamic || "",
    emotional_signals: data.awareness_points || [],
    what_not_to_do: "",
    recommended_approach: data.recommended_action || "",
    urgency: data.emotional_charge || "",
    urgency_reason: "",
    _remaining: data.remaining,
    _raw: data,
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
