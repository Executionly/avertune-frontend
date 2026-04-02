import { api } from "./apiClient";

// ── Helpers (only needed for tone‑checker labels) ─────────────────────────
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

// No other mappings – select values already match backend enums

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

// ── Request builders (values are sent as they are) ─────────────────────────
function buildRepliesRequest(fields) {
  const ps = fields.pack_scenario || {};
  const chips = parseChips(fields.context);
  if (ps.scenarioLabel) chips.push(ps.scenarioLabel);

  return {
    message: fields.message || "",
    thread_context: "",
    medium: fields.medium || "email",
    preferred_length: fields.length || "short",
    tone: fields.tone_pref || "professional",
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

// ── Unified normaliser (unchanged, already works) ──────────────────────────
function normalizeToolResponse(raw, toolId) {
  const data = raw.data || raw;
  console.log(`🔍 Raw ${toolId} response (unwrapped):`, data);

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

  const replies = {};
  const insights = {};
  let tip = "";

  if (toolId === "replies" && Array.isArray(data.replies)) {
    data.replies.forEach((r) => {
      const key = capitalize(r.variant);
      replies[key] = r.text || "";
      insights[key] = r.insight || "";
    });
    tip = data.tone_receipt?.risk_note || "";
  } else if (toolId === "boundary") {
    const stmt = data.boundary_statement || {};
    ["firm", "gentle", "final"].forEach((v) => {
      const item = stmt[v];
      if (item) {
        const key = capitalize(v);
        replies[key] = item.text || "";
        insights[key] = item.insight || "";
      }
    });
    tip = data.power_note || data.what_to_avoid || "";
  } else if (toolId === "negotiation") {
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
  } else if (toolId === "followup" && data.messages) {
    if (data.messages.standard) {
      replies["Standard"] = data.messages.standard.text || "";
      insights["Standard"] = data.messages.standard.insight || "";
    }
    if (data.messages.shorter) {
      replies["Shorter"] = data.messages.shorter.text || "";
      insights["Shorter"] = data.messages.shorter.insight || "";
    }
    tip = data.timing_note || data.response_tip || data.what_to_avoid || "";
  } else if (toolId === "difficultEmail" && data.emails) {
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
