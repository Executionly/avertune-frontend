// Each tool definition: id, label, icon name, tagline, color, fields, and system prompt builder

export const TOOL_CONFIGS = {
  'reply-generator': {
    id: 'reply-generator',
    label: 'Reply Generator',
    tagline: 'Generate calm, strategic replies in seconds.',
    description: 'Paste any message and get 4 tailored reply options — Balanced, Firm, Warm, and Delay — each crafted for your specific context.',
    color: 'var(--green)',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    fields: [
      { id: 'message',  label: 'Message received',    type: 'textarea', placeholder: 'Paste the message you received…', required: true, rows: 5 },
      { id: 'context',  label: 'Context',             type: 'chips',    placeholder: 'Add more context…',
        chips: [
          'This is my boss',
          'We\'ve had tension before',
          'This is a client',
          'We\'re in a negotiation',
          'This is a close friend',
          'First time this happened',
          'They\'ve said this before',
          'High-stakes relationship',
          'I need to stay calm',
          'I want to end the conversation',
        ]
      },
      { id: 'medium',   label: 'Reply medium',        type: 'select',   options: ['Email', 'SMS / Text', 'WhatsApp', 'LinkedIn', 'Slack', 'In person'], default: 'Email' },
      { id: 'length',   label: 'Preferred length',    type: 'select',   options: ['Very short (1-2 sentences)', 'Short (3-4 sentences)', 'Medium (1 paragraph)', 'Long (detailed)'], default: 'Short (3-4 sentences)' },
      { id: 'tone_pref',label: 'Your tone preference',type: 'select',   options: ['Professional', 'Friendly', 'Direct', 'Empathetic', 'Formal'], default: 'Professional' },
    ],
    outputVariants: ['Balanced', 'Firm', 'Warm', 'Delay'],
    buildPrompt: (f) => `You are an expert communication coach. Analyze this message and generate 4 reply options.

Message received: "${f.message}"
${f.context ? `Context: ${f.context}` : ''}
Reply medium: ${f.medium || 'Email'}
Preferred length: ${f.length || 'Short (3-4 sentences)'}
Tone preference: ${f.tone_pref || 'Professional'}

Return ONLY valid JSON:
{
  "tone": "<detected tone in 2 words>",
  "risk": "<risk label>",
  "intent": "<sender intent>",
  "strategy": "<one sentence recommended strategy>",
  "risk_detail": "<2 sentence explanation of the risk if not handled well>",
  "replies": {
    "Balanced": "<reply>",
    "Firm": "<reply>",
    "Warm": "<reply>",
    "Delay": "<reply>"
  },
  "tip": "<one practical communication tip for this situation>"
}`,
  },

  'tone-checker': {
    id: 'tone-checker',
    label: 'Tone Checker',
    tagline: 'Understand the emotional charge of any message.',
    description: 'Get a deep breakdown of tone, subtext, emotional intent, and hidden signals in any message before you respond.',
    color: 'var(--teal)',
    bg: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.2)',
    fields: [
      { id: 'message',      label: 'Message to analyze',     type: 'textarea', placeholder: 'Paste any message here…', required: true, rows: 5 },
      { id: 'relationship', label: 'Your relationship',      type: 'select',   options: ['Colleague', 'Boss / Manager', 'Direct report', 'Client', 'Partner / Spouse', 'Friend', 'Stranger'], default: 'Colleague' },
      { id: 'history',      label: 'Any prior tension?',     type: 'select',   options: ['No history', 'Minor tension', 'Ongoing conflict', 'Recent argument', 'Reconciling'], default: 'No history' },
    ],
    outputVariants: null,
    buildPrompt: (f) => `You are an expert in emotional communication and subtext analysis. Deeply analyze this message.

Message: "${f.message}"
Relationship to sender: ${f.relationship || 'Colleague'}
Prior tension: ${f.history || 'No history'}

Return ONLY valid JSON:
{
  "primary_tone": "<main tone in 2-3 words>",
  "secondary_tone": "<underlying tone in 2-3 words>",
  "intent": "<what the sender actually wants>",
  "subtext": "<what they are NOT saying but implying>",
  "risk_level": "<Low / Medium / High>",
  "risk_reason": "<why this risk level>",
  "emotional_signals": ["<signal 1>", "<signal 2>", "<signal 3>"],
  "what_not_to_do": "<biggest mistake to avoid when replying>",
  "recommended_approach": "<how to approach the reply>",
  "urgency": "<Low / Medium / High>",
  "urgency_reason": "<why>"
}`,
  },

  'improve-reply': {
    id: 'improve-reply',
    label: 'Improve My Reply',
    tagline: 'Strengthen a draft you already wrote.',
    description: "Paste a reply you've already drafted and get improved versions — clearer, more confident, and better calibrated for the situation.",
    color: 'var(--blue)',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    fields: [
      { id: 'original',    label: 'Original message received', type: 'textarea', placeholder: 'Paste the message you received…', required: true, rows: 4 },
      { id: 'draft',       label: 'Your draft reply',          type: 'textarea', placeholder: 'Paste the reply you\'ve written…', required: true, rows: 4 },
      { id: 'goal',        label: 'What do you want to achieve?', type: 'select', options: ['Sound more professional', 'Sound more confident', 'Sound friendlier', 'Be more concise', 'Set a boundary clearly', 'De-escalate tension'], default: 'Sound more professional' },
      { id: 'keep',        label: 'What to keep from your draft', type: 'select', options: ['Keep the overall message', 'Keep the opening', 'Keep specific phrases', 'Total rewrite is fine'], default: 'Keep the overall message' },
    ],
    outputVariants: ['Improved', 'Concise', 'Confident', 'Original+'],
    buildPrompt: (f) => `You are an expert communication editor. Improve the user's draft reply.

Original message they received: "${f.original}"
Their draft reply: "${f.draft}"
Goal: ${f.goal || 'Sound more professional'}
What to keep: ${f.keep || 'Keep the overall message'}

Return ONLY valid JSON:
{
  "diagnosis": "<what's weak or off about the draft in 2 sentences>",
  "key_improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "replies": {
    "Improved": "<best improved version>",
    "Concise": "<shorter, punchy version>",
    "Confident": "<more assertive, confident version>",
    "Original+": "<their original with minimal but important edits>"
  },
  "tip": "<one sentence on what made this draft weak and how to avoid it next time>"
}`,
  },

  'boundary-builder': {
    id: 'boundary-builder',
    label: 'Boundary Builder',
    tagline: 'Set firm, respectful limits without conflict.',
    description: 'Turn pushback, overreach, or pressure into calm, clear boundaries — without burning the relationship.',
    color: 'var(--green)',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
    fields: [
      { id: 'situation',   label: 'What is happening?',        type: 'textarea', placeholder: 'Describe the situation or paste the message…', required: true, rows: 4 },
      { id: 'boundary',    label: 'What boundary do you need?', type: 'textarea', placeholder: 'e.g. I need them to stop contacting me after hours…', required: true, rows: 3 },
      { id: 'relationship',label: 'Your relationship',          type: 'select',   options: ['Boss', 'Colleague', 'Client', 'Family', 'Friend', 'Partner', 'Acquaintance'], default: 'Colleague' },
      { id: 'stakes',      label: 'Relationship stakes',        type: 'select',   options: ['High — I need to preserve this relationship', 'Medium — I prefer to keep it civil', 'Low — I just need to be clear'], default: 'Medium — I prefer to keep it civil' },
      { id: 'history',     label: 'Have you said this before?', type: 'select',   options: ['First time', 'Said it once before', 'Said it multiple times'], default: 'First time' },
    ],
    outputVariants: ['Diplomatic', 'Direct', 'Firm', 'Final'],
    buildPrompt: (f) => `You are an expert in assertive communication and boundary setting.

Situation: "${f.situation}"
Boundary needed: "${f.boundary}"
Relationship: ${f.relationship || 'Colleague'}
Relationship stakes: ${f.stakes || 'Medium'}
History: ${f.history || 'First time'}

Return ONLY valid JSON:
{
  "boundary_assessment": "<why this boundary is valid and important in 2 sentences>",
  "risk_of_not_setting": "<what happens if this boundary isn't set>",
  "replies": {
    "Diplomatic": "<gentle but clear boundary>",
    "Direct": "<clear and matter-of-fact>",
    "Firm": "<strong, unambiguous>",
    "Final": "<used when previous attempts failed — clear consequence>"
  },
  "do": "<one thing to do when delivering this boundary>",
  "dont": "<one thing to avoid>",
  "follow_up": "<suggested follow-up if they push back>"
}`,
  },

  'negotiation-reply': {
    id: 'negotiation-reply',
    label: 'Negotiation Reply',
    tagline: 'Hold your position under pressure.',
    description: 'Get strategically crafted replies for salary negotiations, pricing pushback, contract terms, and high-stakes deals.',
    color: 'var(--teal)',
    bg: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.2)',
    fields: [
      { id: 'message',      label: 'Their message / offer',       type: 'textarea', placeholder: 'Paste what they said or offered…', required: true, rows: 4 },
      { id: 'context',      label: 'Negotiation context',          type: 'select',   options: ['Salary negotiation', 'Pricing / vendor deal', 'Contract terms', 'Raise request', 'Partnership deal', 'Freelance rate', 'Other'], default: 'Pricing / vendor deal' },
      { id: 'your_position',label: 'Your position / counter-offer',type: 'textarea', placeholder: 'What do you actually want? e.g. $85k, not $75k…', rows: 2 },
      { id: 'leverage',     label: 'Your leverage',                type: 'select',   options: ['Strong — I have alternatives', 'Moderate — I can walk away if needed', 'Weak — I really need this deal', 'Unknown'], default: 'Moderate — I can walk away if needed' },
      { id: 'style',        label: 'Negotiation style',            type: 'select',   options: ['Collaborative win-win', 'Competitive — protect my position', 'Principled — logic and fairness', 'Relationship-first'], default: 'Collaborative win-win' },
    ],
    outputVariants: ['Strategic', 'Hold Firm', 'Counter', 'Walk Away'],
    buildPrompt: (f) => `You are a master negotiator and communication strategist.

Their message/offer: "${f.message}"
Negotiation type: ${f.context || 'Pricing deal'}
Your position: "${f.your_position || 'Not specified'}"
Your leverage: ${f.leverage || 'Moderate'}
Negotiation style: ${f.style || 'Collaborative'}

Return ONLY valid JSON:
{
  "power_analysis": "<who has more leverage and why in 2 sentences>",
  "their_tactic": "<negotiation tactic they are using>",
  "your_best_move": "<recommended strategic approach>",
  "replies": {
    "Strategic": "<smart, well-positioned reply>",
    "Hold Firm": "<maintaining your position without conceding>",
    "Counter": "<clear counter-offer or counter-proposal>",
    "Walk Away": "<graceful exit that keeps the door open>"
  },
  "anchoring_tip": "<one sentence on how to anchor the negotiation in your favor>",
  "red_flags": "<any red flags in their approach to watch out for>"
}`,
  },

  'follow-up-writer': {
    id: 'follow-up-writer',
    label: 'Follow-Up Writer',
    tagline: 'Follow-ups that actually get responses.',
    description: 'Write follow-up messages that are persistent without being pushy — for job applications, sales, invoices, and more.',
    color: 'var(--blue)',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.2)',
    fields: [
      { id: 'situation',    label: 'What are you following up on?', type: 'textarea', placeholder: 'e.g. I sent a proposal 1 week ago and haven\'t heard back…', required: true, rows: 3 },
      { id: 'last_contact', label: 'Last contact',                  type: 'select',   options: ['1-2 days ago', '3-5 days ago', '1 week ago', '2 weeks ago', '1 month ago', 'Longer than a month'], default: '1 week ago' },
      { id: 'type',         label: 'Follow-up type',                type: 'select',   options: ['Job application', 'Sales / proposal', 'Invoice / payment', 'Meeting request', 'Project update', 'Personal / relationship', 'Other'], default: 'Sales / proposal' },
      { id: 'attempt',      label: 'Which follow-up is this?',      type: 'select',   options: ['First follow-up', 'Second follow-up', 'Third (final) follow-up', 'Checking in after a meeting'], default: 'First follow-up' },
      { id: 'tone_pref',    label: 'Preferred tone',                type: 'select',   options: ['Friendly & casual', 'Professional', 'Urgent but respectful', 'Brief & direct'], default: 'Professional' },
    ],
    outputVariants: ['Standard', 'Friendly', 'Urgent', 'Brief'],
    buildPrompt: (f) => `You are an expert at writing follow-up messages that get responses.

Situation: "${f.situation}"
Time since last contact: ${f.last_contact || '1 week ago'}
Follow-up type: ${f.type || 'Sales / proposal'}
Which follow-up: ${f.attempt || 'First follow-up'}
Preferred tone: ${f.tone_pref || 'Professional'}

Return ONLY valid JSON:
{
  "why_no_response": "<likely reason they haven't responded — 1 sentence>",
  "subject_line": "<suggested email subject line>",
  "opening_hook": "<a compelling opening line to grab attention>",
  "replies": {
    "Standard": "<balanced, professional follow-up>",
    "Friendly": "<warm, low-pressure version>",
    "Urgent": "<creates appropriate urgency without desperation>",
    "Brief": "<very short, easy to respond to>"
  },
  "timing_tip": "<when to send this and when to give up>",
  "call_to_action": "<the best CTA to include>"
}`,
  },
}

export const TOOL_SLUGS = Object.keys(TOOL_CONFIGS)
