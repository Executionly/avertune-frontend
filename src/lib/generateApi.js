import { api } from './apiClient'

// ── Field mappers ─────────────────────────────────────────────────────────────

function buildRepliesRequest(fields) {
  // pack_scenario { packId, packLabel, scenarioId, scenarioLabel }
  // scenarioLabel goes into context_chips; pack stays as its own field
  const ps = fields.pack_scenario || {}
  const chips = parseChips(fields.context)
  if (ps.scenarioLabel) chips.push(ps.scenarioLabel)

  return {
    message:          fields.message                        || '',
    thread_context:   '',
    medium:           normalizeMedium(fields.medium         || 'Email'),
    preferred_length: mapLength(fields.length),
    tone:             (fields.tone_pref || 'Professional').toLowerCase(),
    goal:             fields.goal                           || '',
    audience:         fields.audience                       || '',
    context_chips:    chips,
    pack:             ps.packId                             || '',
  }
}

function buildToneRequest(fields) {
  return {
    message:       fields.message      || '',
    relationship:  mapRelationship(fields.relationship),
    prior_tension: mapTension(fields.history),
    context:       fields.context      || '',
  }
}


// ── API calls ─────────────────────────────────────────────────────────────────

export const generateApi = {
  replies: async (fields) => {
    const { data } = await api.post('/generate/replies', buildRepliesRequest(fields))
    return normalizeRepliesResponse(data)
  },
  tone: async (fields) => {
    const { data } = await api.post('/generate/tone', buildToneRequest(fields))
    return normalizeToneResponse(data)
  },
  boundary: async (fields) => {
    const { data } = await api.post('/generate/boundary', buildBoundaryRequest(fields))
    return normalizeBoundaryResponse(data)
  },
  negotiation: async (fields) => {
    const { data } = await api.post('/generate/negotiation', buildNegotiationRequest(fields))
    return normalizeNegotiationResponse(data)
  },
  followup: async (fields) => {
    const { data } = await api.post('/generate/followup', buildFollowupRequest(fields))
    return normalizeFollowupResponse(data)
  },
  difficultEmail: async (fields) => {
    const { data } = await api.post('/generate/difficult-email', buildDifficultEmailRequest(fields))
    return normalizeDifficultEmailResponse(data)
  },
  intent: async (fields) => {
    const { data } = await api.post('/generate/intent', buildIntentRequest(fields))
    return normalizeIntentResponse(data)
  },
}

// ── Response normalizers ──────────────────────────────────────────────────────

function normalizeRepliesResponse(data) {
  // Actual backend shape:
  // {
  //   generation_id, quality_score, remaining, limit,
  //   decision_briefing: { what_is_happening, risk_level, recommended_strategy },
  //   replies: [ { variant, label, descriptor, text, insight, recommended } ],
  //   tone_receipt: { respect, warmth, confidence, risk_note }
  // }

  const briefing = data.decision_briefing || {}
  const receipt  = data.tone_receipt      || {}

  // Convert replies array → keyed object for VariantPanel { Balanced: "...", Firm: "...", ... }
  const repliesMap = {}
  const replyInsights = {}
  const replyDescriptors = {}
  let recommendedVariant = null

  if (Array.isArray(data.replies)) {
    data.replies.forEach(r => {
      // Use capitalized variant as key so it matches toolConfigs outputVariants
      // e.g. "firm" → "Firm", not "Firm Boundary"
      const key = capitalize(r.variant)
      repliesMap[key] = r.text || ''
      replyInsights[key] = r.insight || ''
      replyDescriptors[key] = r.label || ''   // use label as descriptor
      if (r.recommended) recommendedVariant = key
    })
  } else if (data.replies && typeof data.replies === 'object') {
    // Already a flat object — use as-is
    Object.assign(repliesMap, data.replies)
  }

  // Map tone_receipt numeric scores into displayable strings
  const toneScores = []
  if (receipt.respect    != null) toneScores.push(`Respect ${receipt.respect}%`)
  if (receipt.warmth     != null) toneScores.push(`Warmth ${receipt.warmth}%`)
  if (receipt.confidence != null) toneScores.push(`Confidence ${receipt.confidence}%`)

  return {
    // For InsightRows (existing ToolPage rendering)
    tone:     toneScores[0] || '',
    risk:     capitalize(briefing.risk_level || ''),
    intent:   briefing.what_is_happening || '',
    strategy: briefing.recommended_strategy || '',
    tip:      receipt.risk_note || '',
    risk_detail: '',

    // For VariantPanel
    replies: repliesMap,

    // For DecisionBriefing component
    _briefing: {
      what_is_happening:    briefing.what_is_happening    || '',
      risk_level:           capitalize(briefing.risk_level || ''),
      recommended_strategy: briefing.recommended_strategy || '',
    },
    _receipt: {
      respect:    receipt.respect,
      warmth:     receipt.warmth,
      confidence: receipt.confidence,
      risk_note:  receipt.risk_note || '',
      scores:     toneScores,
    },
    _replyInsights:    replyInsights,
    _replyDescriptors: replyDescriptors,
    _recommendedVariant: recommendedVariant,
    _remaining: data.remaining,
    _limit:     data.limit,
    _raw:       data,
  }
}

function normalizeToneResponse(data) {
  return {
    primary_tone:         data.primary_tone         || '',
    secondary_tone:       data.secondary_tone       || '',
    intent:               data.intent               || '',
    subtext:              data.subtext              || '',
    risk_level:           data.risk_level           || '',
    risk_reason:          data.risk_reason          || '',
    emotional_signals:    data.emotional_signals    || [],
    what_not_to_do:       data.what_not_to_do       || '',
    recommended_approach: data.recommended_approach || '',
    urgency:              data.urgency              || '',
    urgency_reason:       data.urgency_reason       || '',
    _remaining: data.remaining,
    _raw:       data,
  }
}


// ── Boundary ─────────────────────────────────────────────────────────────────

function buildBoundaryRequest(fields) {
  return {
    what_is_happening:    fields.what_is_happening    || '',
    what_boundary_needed: fields.what_boundary_needed || '',
    relationship:         fields.relationship         || '',
    relationship_stakes:  fields.relationship_stakes  || '',
    said_before:          fields.said_before          || '',
    medium:               normalizeMedium(fields.medium || 'Email'),
  }
}

function normalizeBoundaryResponse(data) {
  // Backend returns 3 boundary statements: firm, gentle, final
  const repliesMap = {}
  const replyInsights = {}
  if (Array.isArray(data.replies)) {
    data.replies.forEach(r => {
      const key = capitalize(r.variant || r.label || '')
      repliesMap[key]    = r.text    || ''
      replyInsights[key] = r.insight || ''
    })
  } else if (data.replies && typeof data.replies === 'object') {
    Object.assign(repliesMap, data.replies)
  }
  return {
    replies:          repliesMap,
    _replyInsights:   replyInsights,
    _replyDescriptors:{},
    _recommendedVariant: null,
    tip:              data.power_note || data.tip || '',
    _remaining:       data.remaining,
    _raw:             data,
  }
}

// ── Negotiation ───────────────────────────────────────────────────────────────

function buildNegotiationRequest(fields) {
  return {
    their_message:        fields.their_message        || '',
    your_position:        fields.your_position        || '',
    negotiation_context:  fields.negotiation_context  || '',
    leverage:             fields.leverage             || '',
    style:                fields.style                || '',
    context:              '',
    medium:               normalizeMedium(fields.medium || 'Email'),
  }
}

function normalizeNegotiationResponse(data) {
  const repliesMap = {}
  const replyInsights = {}
  if (Array.isArray(data.replies)) {
    data.replies.forEach(r => {
      const key = capitalize(r.variant || r.label || '')
      repliesMap[key]    = r.text    || ''
      replyInsights[key] = r.insight || ''
    })
  } else if (data.replies && typeof data.replies === 'object') {
    Object.assign(repliesMap, data.replies)
  }
  return {
    replies:           repliesMap,
    _replyInsights:    replyInsights,
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip:               data.strategic_insights || data.tip || '',
    _remaining:        data.remaining,
    _raw:              data,
  }
}

// ── Follow-up ─────────────────────────────────────────────────────────────────

function buildFollowupRequest(fields) {
  return {
    context:          fields.context          || '',
    last_contact:     fields.last_contact     || '',
    follow_up_type:   fields.follow_up_type   || '',
    follow_up_number: fields.follow_up_number || '',
    preferred_tone:   fields.preferred_tone   || '',
    medium:           normalizeMedium(fields.medium || 'Email'),
    extra_detail:     '',
  }
}

function normalizeFollowupResponse(data) {
  const repliesMap = {}
  if (Array.isArray(data.replies)) {
    data.replies.forEach(r => {
      const key = capitalize(r.variant || r.label || '')
      repliesMap[key] = r.text || ''
    })
  } else if (data.replies && typeof data.replies === 'object') {
    Object.assign(repliesMap, data.replies)
  }
  return {
    replies:           repliesMap,
    _replyInsights:    {},
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip:               data.timing_note || data.tip || '',
    _remaining:        data.remaining,
    _raw:              data,
  }
}

// ── Difficult Email ───────────────────────────────────────────────────────────

function buildDifficultEmailRequest(fields) {
  return {
    what_to_communicate: fields.what_to_communicate || '',
    draft:               fields.draft               || '',
    situation:           fields.situation           || '',
    relationship:        fields.relationship        || '',
    sensitivity:         fields.sensitivity         || '',
    context:             '',
  }
}

function normalizeDifficultEmailResponse(data) {
  const repliesMap = {}
  if (Array.isArray(data.replies)) {
    data.replies.forEach(r => {
      const key = capitalize(r.variant || r.label || '')
      repliesMap[key] = r.text || ''
    })
  } else if (data.replies && typeof data.replies === 'object') {
    Object.assign(repliesMap, data.replies)
  }
  return {
    replies:           repliesMap,
    _replyInsights:    {},
    _replyDescriptors: {},
    _recommendedVariant: null,
    tip:               data.safety_note || data.tip || '',
    _remaining:        data.remaining,
    _raw:              data,
  }
}

// ── Intent Detector ───────────────────────────────────────────────────────────

function buildIntentRequest(fields) {
  return {
    message:      fields.message      || '',
    relationship: fields.relationship || '',
    channel:      (fields.channel || 'email').toLowerCase(),
    background:   fields.background   || '',
  }
}

function normalizeIntentResponse(data) {
  return {
    // Map to existing tone-checker style display
    primary_tone:         data.surface_meaning        || data.primary_tone         || '',
    secondary_tone:       data.real_intent            || data.secondary_tone       || '',
    intent:               data.real_intent            || data.intent               || '',
    subtext:              data.decoded_subtext        || data.subtext              || '',
    risk_level:           data.warning_level          || data.risk_level           || '',
    risk_reason:          data.risk_reason            || '',
    emotional_signals:    data.warning_signals        || data.emotional_signals    || [],
    what_not_to_do:       data.what_not_to_do         || '',
    recommended_approach: data.recommended_approach   || '',
    urgency:              data.emotional_state        || data.urgency              || '',
    urgency_reason:       data.urgency_reason         || '',
    _remaining:           data.remaining,
    _raw:                 data,
  }
}

// ── Value mappers ─────────────────────────────────────────────────────────────

function mapLength(val) {
  const map = {
    'Very short (1-2 sentences)': 'very_short',
    'Short (3-4 sentences)':      'short',
    'Medium (1 paragraph)':       'medium',
    'Long (detailed)':            'long',
  }
  return map[val] || 'short'
}

function mapRelationship(val) {
  const map = {
    'Colleague':        'colleague',
    'Boss / Manager':   'boss_manager',
    'Direct report':    'direct_report',
    'Client':           'client',
    'Partner / Spouse': 'partner_spouse',
    'Friend':           'friend',
    'Stranger':         'stranger',
  }
  return map[val] || 'colleague'
}

function mapTension(val) {
  const map = {
    'No history':       'no_history',
    'Minor tension':    'minor_tension',
    'Ongoing conflict': 'ongoing_conflict',
    'Recent argument':  'recent_argument',
    'Reconciling':      'reconciling',
  }
  return map[val] || 'no_history'
}



function parseChips(val) {
  if (!val) return []
  return val.split(',').map(s => s.trim()).filter(Boolean).slice(0, 2)
}

function normalizeMedium(val) {
  const map = {
    'Email':       'email',
    'SMS / Text':  'sms',
    'WhatsApp':    'whatsapp',
    'LinkedIn':    'linkedin',
    'Slack':       'slack',
    'In person':   'in_person',
  }
  return map[val] || val.toLowerCase()
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
