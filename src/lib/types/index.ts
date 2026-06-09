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
  scenario_planning?: {
    if_things_go_well?: string;
    if_things_get_complicated?: string;
    worst_case?: string;
  };
  // Degraded / preview plan fields
  is_degraded?: boolean;
  upgrade_message?: string;
  upgrade_required?: boolean;
  locked_features?: string[];
  available_plans?: { name: string; price: string; features: string[] }[];
  // meeting_preparation extra fields
  meeting_strategy?: string;
  opening_statement?: string;
  key_talking_points?: string[];
  how_to_handle_pushback?: string;
  // interview_prep extra fields
  preparation_strategy?: string;
  questions_to_ask_interviewer?: string[];
  // cold_outreach extra fields
  outreach_angle?: string;
  power_dynamic?: string;
  subject_lines?: string[];
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
