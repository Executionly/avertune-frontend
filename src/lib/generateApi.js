import { api } from './apiClient'

// ── Field mappers ─────────────────────────────────────────────────────────────
// Map ToolPage field values → backend request body for each endpoint

function buildRepliesRequest(fields) {
  return {
    message:          fields.message        || '',
    thread_context:   fields.thread_context || '',
    medium:           (fields.medium        || 'Email').toLowerCase(),
    preferred_length: mapLength(fields.length),
    tone:             (fields.tone_pref     || 'Professional').toLowerCase(),
    goal:             fields.goal           || '',
    audience:         fields.audience       || '',
    context_chips:    parseChips(fields.context),
    pack:             fields.pack           || 'workplace',
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

function buildImproveRequest(fields) {
  return {
    original_message: fields.original  || '',
    draft:            fields.draft     || '',
    goal:             mapGoal(fields.goal),
    keep_from_draft:  mapKeep(fields.keep),
    medium:           (fields.medium   || 'email').toLowerCase(),
    context:          fields.context   || '',
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

  improve: async (fields) => {
    const { data } = await api.post('/generate/improve', buildImproveRequest(fields))
    return normalizeImproveResponse(data)
  },
}

// ── Response normalizers ──────────────────────────────────────────────────────
// Map backend response shapes → what ToolPage's result rendering expects

function normalizeRepliesResponse(data) {
  // Backend: { variants: { Balanced, Firm, Warm, Delay }, briefing: {...}, tone_receipt: {...} }
  // Fallback: data may already have replies directly
  const variants = data.variants || data.replies || {}
  const briefing = data.briefing || data.decision_briefing || {}
  const receipt  = data.tone_receipt || data.tone_analysis || {}

  return {
    // existing ToolPage insightRows keys
    tone:     receipt.tone      || briefing.tone     || data.tone     || '',
    risk:     receipt.risk      || briefing.risk      || data.risk     || '',
    intent:   receipt.intent    || briefing.intent    || data.intent   || '',
    strategy: briefing.strategy || data.strategy      || '',
    tip:      briefing.tip      || data.tip           || '',
    risk_detail: briefing.risk_detail || data.risk_detail || '',
    // replies for VariantPanel
    replies: variants,
    // raw data for DecisionBriefing component
    _briefing: briefing,
    _receipt:  receipt,
    _raw:      data,
  }
}

function normalizeToneResponse(data) {
  return {
    primary_tone:      data.primary_tone      || '',
    secondary_tone:    data.secondary_tone    || '',
    intent:            data.intent            || '',
    subtext:           data.subtext           || '',
    risk_level:        data.risk_level        || '',
    risk_reason:       data.risk_reason       || '',
    emotional_signals: data.emotional_signals || [],
    what_not_to_do:    data.what_not_to_do    || '',
    recommended_approach: data.recommended_approach || '',
    urgency:           data.urgency           || '',
    urgency_reason:    data.urgency_reason    || '',
    _raw:              data,
  }
}

function normalizeImproveResponse(data) {
  const versions = data.versions || data.improved_versions || {}
  return {
    diagnosis:        data.diagnosis         || data.analysis   || '',
    key_improvements: data.key_improvements  || data.improvements || [],
    replies: {
      Improved:    versions.improved    || data.improved    || '',
      Concise:     versions.shorter     || versions.concise || data.concise    || '',
      Confident:   versions.confident   || data.confident   || '',
      'Original+': versions.original_plus || data.original_plus || '',
    },
    tip:  data.tip  || '',
    _raw: data,
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

function mapGoal(val) {
  const map = {
    'Sound more professional': 'more_professional',
    'Sound more confident':    'more_confident',
    'Sound friendlier':        'friendlier',
    'Be more concise':         'more_concise',
    'Set a boundary clearly':  'set_boundary',
    'De-escalate tension':     'de_escalate',
  }
  return map[val] || 'more_professional'
}

function mapKeep(val) {
  const map = {
    'Keep the overall message':  'keep_overall_message',
    'Keep the opening':          'keep_opening',
    'Keep specific phrases':     'keep_phrases',
    'Total rewrite is fine':     'total_rewrite',
  }
  return map[val] || 'keep_overall_message'
}

function parseChips(val) {
  if (!val) return []
  return val.split(',').map(s => s.trim()).filter(Boolean).slice(0, 2)
}
