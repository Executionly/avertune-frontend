import type { Mode } from "@/lib/types";

export const MODES: Mode[] = [
  {
    id: "professional",
    emoji: "",
    label: "Professional Mode",
    tagline: "Navigate workplace dynamics with precision",
    badge: "Default Mode",
    badgeVariant: "violet",
    description:
      "For executives, managers, founders, HR teams, recruiters, and anyone navigating workplace dynamics. Understands hierarchy, diplomacy, reputation risk, and professional tone.",
    colorClass: "mode-em-pro",
    targetUsers: [
      "Executives & managers",
      "Founders & consultants",
      "HR teams & recruiters",
      "Job seekers & candidates",
      "Customer-facing professionals",
    ],
    useCases: [
      "Responding to managers without sounding defensive",
      "Salary negotiation & performance discussions",
      "Recruiting communication & candidate messaging",
      "Difficult workplace conversations & conflict",
      "Client escalation & executive communication",
      "Resignation & difficult update messaging",
    ],
  },
  {
    id: "sales",
    emoji: "",
    label: "Sales Mode",
    tagline: "Close deals, handle objections, hold leverage",
    badge: "Highest Revenue Mode",
    badgeVariant: "amber",
    description:
      "For sales professionals, founders, closers, SDRs, and account managers. Understands leverage, buyer psychology, urgency, confidence, and deal progression.",
    colorClass: "mode-em-sales",
    targetUsers: [
      "Sales professionals & SDRs",
      "Founders & business development",
      "Account managers & closers",
      "Consultants & agencies",
    ],
    useCases: [
      "Handling objections with leverage intact",
      "Pricing pressure & discount resistance",
      "Deal recovery & ghosted follow-ups",
      "Closing conversations & proposal messaging",
      "Discovery responses & buyer engagement",
      "Negotiation with value reinforcement",
    ],
  },
  {
    id: "relationship",
    emoji: "",
    label: "Relationship Mode",
    tagline: "Navigate personal conversations with emotional intelligence",
    badge: "Emotional Intelligence",
    badgeVariant: "green",
    description:
      "For dating, family, friendships, and any emotionally loaded conversation. Understands passive aggression, attachment pressure, escalation patterns, and conflict cycles.",
    colorClass: "mode-em-rel",
    targetUsers: [
      "Anyone in dating conversations",
      "Family & friendship dynamics",
      "Personal conflict resolution",
      "Boundary-setting situations",
    ],
    useCases: [
      "Dating conversations & tension management",
      "Boundary setting with clarity and respect",
      "Family conflict & difficult personal conversations",
      "Emotional misunderstandings & reconciliation",
      "De-escalation & passive aggression response",
      "Reconnecting without losing ground",
    ],
  },
];

export const MODE_MAP = Object.fromEntries(
  MODES.map((m) => [m.id, m]),
) as Record<string, Mode>;
