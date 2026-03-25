import { api } from './apiClient'

// ── Field mappers ─────────────────────────────────────────────────────────────

function buildRepliesRequest(fields) {
  // pack_scenario is { packId, packLabel, scenarioId, scenarioLabel }
  const ps = fields.pack_scenario || {}
  return {
    message:          fields.message                     || '',
    thread_context:   '',
    medium:           normalizeMedium(fields.medium      || 'Email'),
    preferred_length: mapLength(fields.length),
    tone:             (fields.tone_pref || 'Professional').toLowerCase(),
    goal:             ps.scenarioId                      || '',
    audience:         fields.audience                    || '',
    context_chips:    parseChips(fields.context),
    pack:             ps.packId                          || 'work',
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
    medium:           (fields.medium   || 'Email').toLowerCase(),
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

function normalizeImproveResponse(data) {
  // Try both array and object shapes for versions
  const versions = data.versions || data.improved_versions || {}
  const repliesMap = {}

  if (Array.isArray(data.versions)) {
    data.versions.forEach(v => {
      repliesMap[v.label || capitalize(v.variant)] = v.text || ''
    })
  } else {
    repliesMap['Improved']    = versions.improved     || data.improved    || ''
    repliesMap['Concise']     = versions.shorter      || versions.concise || data.concise    || ''
    repliesMap['Confident']   = versions.confident    || data.confident   || ''
    repliesMap['Original+']   = versions.original_plus || data.original_plus || ''
  }

  return {
    diagnosis:        data.diagnosis        || data.analysis     || '',
    key_improvements: data.key_improvements || data.improvements || [],
    replies:          repliesMap,
    tip:              data.tip              || '',
    _remaining: data.remaining,
    _raw:       data,
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
    'Keep the overall message': 'keep_overall_message',
    'Keep the opening':         'keep_opening',
    'Keep specific phrases':    'keep_phrases',
    'Total rewrite is fine':    'total_rewrite',
  }
  return map[val] || 'keep_overall_message'
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
