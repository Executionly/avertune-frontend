import { api } from "./apiClient";

// ── Helpers (unchanged) ─────────────────────────────────────────────────────
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

// ── Request builders (unchanged) ───────────────────────────────────────────
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

function mapSaidBefore(val) {
  const map = {
    first_time: "first_time",
    said_once: "said_once_before",
    said_multiple_times: "said_multiple_times",
  };
  return map[val] || "first_time";
}

function buildBoundaryRequest(fields) {
  return {
    what_is_happening: fields.what_is_happening || "",
    what_boundary_needed: fields.what_boundary_needed || "",
    relationship: mapRelationship(fields.relationship),
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

// ── Unified normaliser (now unwraps the `data` property) ──────────────────
function normalizeToolResponse(raw, toolId) {
  // The backend wraps the actual content inside a `data` property
  const data = raw.data || raw;
  console.log(`🔍 Raw ${toolId} response (unwrapped):`, data);

  // Special case: tone and intent use a different result shape (no variants)
  if (toolId === "tone") {
    return {
      primary_tone: data.tone || "",
      secondary_tone: data.emotional_temperature || "",
      intent: data.intent || "",
      subtext: data.subtext || "",
      risk_level: data.risk_level || "",
      emotional_signals: data.awareness_points || [],
      recommended_approach: data.recommended_action || "",
      urgency: data.emotional_charge || "",
      _remaining: raw.remaining,
      _raw: raw,
    };
  }

  if (toolId === "intent") {
    return {
      primary_tone:
        data.primary_intent || data.intent || data.surface_meaning || "",
      secondary_tone: "",
      intent: data.primary_intent || "",
      subtext: data.decoded_subtext || "",
      risk_level: "",
      emotional_signals: data.warning_signals || [],
      recommended_approach: data.recommended_awareness?.[0] || "",
      urgency: data.emotional_state || "",
      _remaining: raw.remaining,
      _raw: raw,
    };
  }

  // For all other tools, build a `replies` object
  const replies = {};
  const insights = {};
  let tip = "";

  // ---- REPLY GENERATOR ----
  if (toolId === "replies" && Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant);
      replies[key] = r.text || "";
      insights[key] = r.insight || "";
    });
    tip = data.tone_receipt?.risk_note || "";
  }

  // ---- BOUNDARY BUILDER ----
  else if (toolId === "boundary") {
    const stmt = data.boundary_statement || {};
    ["firm", "gentle", "final"].forEach((v) => {
      const item = stmt[v];
      if (item) {
        const key = capitalize(v); // "Firm", "Gentle", "Final"
        replies[key] = item.text || "";
        insights[key] = item.insight || "";
      }
    });
    tip = data.power_note || data.what_to_avoid || "";
  }

  // ---- NEGOTIATION ----
  else if (toolId === "negotiation") {
    const repliesObj = data.replies || {};
    if (Object.keys(repliesObj).length) {
      Object.entries(repliesObj).forEach(([k, v]) => {
        const key = capitalize(k);
        replies[key] = v.text || v || "";
        insights[key] = v.insight || "";
      });
    } else {
      ["hold_firm", "counter", "collaborative"].forEach((v) => {
        const item = data[v];
        if (item) {
          const key = capitalize(v);
          replies[key] = item.text || "";
          insights[key] = item.insight || "";
        }
      });
    }
    tip = data.negotiation_insight || data.strategic_insights || data.tip || "";
  }

  // ---- FOLLOW‑UP ----
  else if (toolId === "followup" && data.messages) {
    if (data.messages.standard) {
      replies["Standard"] = data.messages.standard.text || "";
      insights["Standard"] = data.messages.standard.insight || "";
    }
    if (data.messages.shorter) {
      replies["Shorter"] = data.messages.shorter.text || "";
      insights["Shorter"] = data.messages.shorter.insight || "";
    }
    tip = data.timing_note || data.response_tip || data.what_to_avoid || "";
  }

  // ---- DIFFICULT EMAIL ----
  else if (toolId === "difficultEmail" && data.emails) {
    if (data.emails.safe) {
      replies["Safe"] = data.emails.safe.body || "";
      insights["Safe"] = data.emails.safe.insight || "";
    }
    if (data.emails.direct) {
      replies["Direct"] = data.emails.direct.body || "";
      insights["Direct"] = data.emails.direct.insight || "";
    }
    tip = data.safety_note || data.what_to_avoid || "";
  }

  // Fallback: if we still have no replies, try to extract any object with .text
  if (
    Object.keys(replies).length === 0 &&
    data.replies &&
    typeof data.replies === "object"
  ) {
    Object.entries(data.replies).forEach(([k, v]) => {
      const key = capitalize(k);
      replies[key] = v.text || v || "";
      insights[key] = v.insight || "";
    });
  }

  return {
    replies,
    _replyInsights: insights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip,
    _remaining: raw.remaining,
    _limit: raw.limit,
    _raw: raw,
  };
}

// ── API calls ───────────────────────────────────────────────────────────────
export const generateApi = {
  replies: async (fields) => {
    const { data } = await api.post(
      "/generate/replies",
      buildRepliesRequest(fields),
    );
    return normalizeToolResponse(data, "replies");
  },

  tone: async (fields) => {
    const { data } = await api.post("/generate/tone", buildToneRequest(fields));
    return normalizeToolResponse(data, "tone");
  },

  boundary: async (fields) => {
    const { data } = await api.post(
      "/generate/boundary",
      buildBoundaryRequest(fields),
    );
    return normalizeToolResponse(data, "boundary");
  },

  negotiation: async (fields) => {
    const { data } = await api.post(
      "/generate/negotiation",
      buildNegotiationRequest(fields),
    );
    return normalizeToolResponse(data, "negotiation");
  },

  followup: async (fields) => {
    const { data } = await api.post(
      "/generate/followup",
      buildFollowupRequest(fields),
    );
    return normalizeToolResponse(data, "followup");
  },

  difficultEmail: async (fields) => {
    const { data } = await api.post(
      "/generate/difficult-email",
      buildDifficultEmailRequest(fields),
    );
    return normalizeToolResponse(data, "difficultEmail");
  },

  intent: async (fields) => {
    const { data } = await api.post(
      "/generate/intent",
      buildIntentRequest(fields),
    );
    return normalizeToolResponse(data, "intent");
  },
};
