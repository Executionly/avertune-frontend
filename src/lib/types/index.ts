// ─── Navigation ───────────────────────────────────────────────
export interface NavDropdownItem {
  icon: string;
  label: string;
  description: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  items?: NavDropdownItem[];
  sections?: {
    title: string;
    links: { icon: string; label: string; href: string }[];
  }[];
}

// ─── Modes ────────────────────────────────────────────────────
export type ModeId = "professional" | "sales" | "relationship";

export interface Mode {
  id: ModeId;
  emoji: string;
  label: string;
  tagline: string;
  badge: string;
  badgeVariant: "violet" | "amber" | "green";
  description: string;
  useCases: string[];
  targetUsers: string[];
  colorClass: string;
}

// ─── Capabilities ──────────────────────────────────────────────
export type CapabilityId =
  | "reply-generator"
  | "tone-checker"
  | "intent-detector"
  | "boundary-builder"
  | "follow-up-writer"
  | "difficult-email"
  | "sales-negotiation";

export interface Capability {
  id: CapabilityId;
  emoji: string;
  label: string;
  tagline: string;
  description: string;
  usedIn: ModeId[];
  features: string[];
  example?: { input: string; output: string };
}

// ─── Chat / App ────────────────────────────────────────────────
export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  intelligenceResult?: IntelligenceResult;
  turnType?: string;
  suggestions?: string[];
  suggestionCategories?: string[];
  conversationId?: string;
  messageId?: string;
  capabilityDisplay?: string;
  modelUsed?: string;
  naturalScore?: number;
  attachedFile?: { name: string; size: number; fileType: string };
  isStreaming?: boolean;
  intelligence?: any; // ADD THIS LINE - stores the raw intelligence object from API
}

export interface ChatSession {
  id: string;
  title: string;
  mode: ModeId;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IntelligenceReply {
  text: string;
  insight: string;
  tone_profile: { warmth: number; respect: number; confidence: number };
  generated_reply?: string;
  action_steps?: string[];
  what_to_avoid?: string[];
  subject?: string;
  body?: string;
}

export interface IntelligenceResult {
  mode: ModeId;
  scenario?: string;
  riskLevel: "low" | "medium" | "high";
  analysis: string;
  strategy: string;
  recommended?: string;
  replies?: Record<string, IntelligenceReply>;
  responses?: ResponseOption[];
  scores?: CommunicationScores;
  next_best_action?: string;
  coach_note?: string;
  situation_read?: string;
  risk_assessment?: string;
  insight?: string;
  question_asked?: string;
  strategic_reasoning?: string;
  scenario_planning?: {
    if_things_go_well?: string;
    if_things_get_complicated?: string;
    worst_case?: string;
    if_they_push_back?: string;
    if_they_say_yes?: string;
    if_they_say_not_now?: string;
    if_they_say_budget_is_tight?: string;
    if_they_get_defensive?: string;
  };
  preparation?: {
    what_to_know?: string[];
    what_to_gather?: string[];
    timing_guidance?: string;
    evidence_to_gather?: string[];
    what_not_to_say?: string[];
  };
  conversation_script?: {
    opening?: string;
    contribution_statement?: string;
    the_ask?: string;
    if_they_ask_for_evidence?: string;
    closing?: string;
  };
  pushback_scripts?: Array<{
    trigger?: string;
    objection?: string;
    response: string;
  }>;
  alternative?: {
    advice?: string;
    action_steps?: string[];
    why_this_works?: string;
    generated_reply?: string;
  };
  is_degraded?: boolean;
  upgrade_message?: string;
  upgrade_required?: boolean;
  locked_features?: string[];
  available_plans?: { name: string; price: string; features: string[] }[];
  meeting_strategy?: string;
  opening_statement?: string;
  key_talking_points?: string[];
  how_to_handle_pushback?: string;
  preparation_strategy?: string;
  questions_to_ask_interviewer?: string[];
  outreach_angle?: string;
  power_dynamic?: string;
  subject_lines?: string[];

  // ── v2.0 Dynamic Sections ─────────────────────────────────────────────────

  // Sales
  objection_analysis?: {
    stated_objection: string;
    real_objection: string;
    objection_type: string;
    severity: string;
    recommended_counter: string;
  };
  deal_risk?: {
    risk_level: string;
    risk_factors: string[];
    risk_mitigation: string;
  };
  negotiation_guidance?: {
    current_position: string;
    recommended_move: string;
    what_to_avoid: string;
  };
  follow_up_strategy?: {
    timing: string;
    channel: string;
    hook: string;
  };
  revenue_opportunity?: {
    deal_stage: string;
    expansion_potential: string;
    urgency_signal: string;
  };

  // Negotiation
  leverage_assessment?: {
    user_leverage: string;
    their_leverage: string;
    balance: string;
    how_to_strengthen: string;
  };
  concession_analysis?: {
    what_to_give: string;
    what_to_protect: string;
    trade_sequence: string;
  };
  batna?: {
    user_batna: string;
    their_batna: string;
    walk_away_point: string;
  };
  negotiation_strategy?: {
    opening_position: string;
    target_position: string;
    anchoring_language: string;
  };

  // Leadership
  team_impact?: {
    immediate_impact: string;
    broader_impact: string;
    tone_signal: string;
  };
  retention_risk?: {
    risk_level: string;
    risk_indicators: string[];
    retention_action: string;
  };
  morale_impact?: {
    impact: string;
    affected_parties: string;
    recovery_path: string;
  };
  stakeholder_analysis?: {
    primary_stakeholder: string;
    secondary_stakeholders: string;
    political_considerations: string;
  };

  // Relationship
  emotional_insight?: {
    user_emotional_state: string;
    other_party_state: string;
    emotional_gap: string;
    what_they_need_to_hear: string;
  };
  relationship_health?: {
    current_state: string;
    primary_stressor: string;
    repair_path: string;
  };
  conflict_drivers?: {
    surface_issue: string;
    root_cause: string;
    escalation_triggers: string[];
    de_escalation_path: string;
  };
  trust_impact?: {
    current_trust_level: string;
    impact_of_message: string;
    trust_building_move: string;
  };

  // Recruiting / HR
  candidate_experience?: {
    current_impression: string;
    experience_risk: string;
    improvement: string;
  };
  escalation_risk?: {
    risk_level: string;
    escalation_triggers: string[];
    de_escalation_move: string;
  };
  compliance_considerations?: {
    areas_to_watch: string[];
    language_to_avoid: string;
    recommended_framing: string;
  };

  // Customer Support
  customer_sentiment?: {
    current_sentiment: string;
    sentiment_driver: string;
    shift_opportunity: string;
  };
  churn_risk?: {
    risk_level: string;
    churn_signals: string[];
    retention_move: string;
  };
  recovery_strategy?: {
    recovery_priority: string;
    message_angle: string;
    what_not_to_say: string;
  };

  // v2.0 scoring shape (adaptive — stored as raw object for dynamic rendering)
  scoring?: Record<string, string | number>;
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
export interface ResponseOption {
  type: string;
  reply: string;
  whyItWorks: string;
  likelyOutcome: string;
  confidence: number;
}

export interface CommunicationScores {
  confidence: number;
  clarity: number;
  toneMatch: string;
  escalationRisk: "low" | "medium" | "high";
  riskScore?: number;
  escalationProbability?: number;
  relationshipImpact?: string;
}

// ─── User Profile ──────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  ciScore: number;
  metrics: ProfileMetrics;
}

export interface ProfileMetrics {
  clarity: number;
  toneControl: number;
  negotiationStrength: number;
  boundaryStrength: number;
  escalationControl: number;
}
