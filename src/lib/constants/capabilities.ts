import type { Capability } from "@/lib/types";

export const CAPABILITIES: Capability[] = [
  {
    id: "reply-generator",
    emoji: "",
    label: "Reply Generator",
    tagline: "Strategically calibrated responses for any situation",
    description:
      "Generates multiple ranked response options, each scored for confidence, clarity, and predicted outcome. Never generic — always calibrated to the specific situation and your communication goal.",
    usedIn: ["professional", "sales", "relationship"],
    features: [
      "Multiple ranked response options",
      "Confidence scoring per response",
      "Tone-matched to context",
      "Outcome prediction per option",
      "One-click copy and refinement",
    ],
    example: {
      input:
        "Your manager says: 'I don't think you're ready for this promotion yet.'",
      output:
        '"Thank you for the feedback — I\'d like to understand specifically what milestones would change that assessment. Could we set a 90-day plan with clear criteria?"',
    },
  },
  {
    id: "tone-checker",
    emoji: "",
    label: "Tone Checker",
    tagline: "Know exactly how your message will land before you send it",
    description:
      "Analyses the emotional tone of any draft before you send it. Detects unintended defensiveness, aggression, desperation, or weakness — and suggests precise corrections that preserve your intent.",
    usedIn: ["professional", "sales", "relationship"],
    features: [
      "Real-time tone analysis",
      "Defensiveness & aggression detection",
      "Warmth vs. firmness balance",
      "Suggested tone corrections",
      "Risk flag for high-stakes sends",
    ],
  },
  {
    id: "intent-detector",
    emoji: "",
    label: "Intent Detector",
    tagline: "Read what people actually mean, not just what they say",
    description:
      "Decodes the true intent behind any message — the unspoken goal, the power move, the test, or the genuine concern. Gives you situational clarity before you respond.",
    usedIn: ["professional", "sales", "relationship"],
    features: [
      "True intent classification",
      "Power dynamic analysis",
      "Hidden agenda detection",
      "Emotional subtext reading",
      "Strategic context mapping",
    ],
  },
  {
    id: "boundary-builder",
    emoji: "",
    label: "Boundary Builder",
    tagline: "Set firm, respectful limits that actually hold",
    description:
      "Helps you set clear, firm boundaries without triggering escalation or damaging relationships. Built for repeated pressure, passive aggression, and situations where previous limits haven't been respected.",
    usedIn: ["relationship", "professional"],
    features: [
      "Escalation-aware boundary language",
      "Respectful but firm framing",
      "Pressure response templates",
      "Progressive boundary reinforcement",
      "No-apology clarity tools",
    ],
  },
  {
    id: "follow-up-writer",
    emoji: "",
    label: "Follow-Up Writer",
    tagline: "Re-engage without desperation, silence, or pressure",
    description:
      "Writes follow-ups that create movement without appearing needy. Understands timing, leverage, and how to add value in each message rather than just reminding someone you exist.",
    usedIn: ["sales", "professional"],
    features: [
      "Context-aware follow-up timing",
      "Value-adding message framing",
      "Ghost re-engagement scripts",
      "Deal recovery sequences",
      "Professional persistence templates",
    ],
  },
  {
    id: "difficult-email",
    emoji: "",
    label: "Difficult Email Helper",
    tagline: "Say hard things clearly, professionally, without fallout",
    description:
      "Structures and writes difficult emails — resignations, bad news, conflict responses, corrections — with clarity, professionalism, and minimal escalation risk.",
    usedIn: ["professional"],
    features: [
      "Difficult news structuring",
      "Conflict de-escalation framing",
      "Resignation & departure templates",
      "Error acknowledgement scripts",
      "Diplomatically direct language",
    ],
  },
  {
    id: "sales-negotiation",
    emoji: "",
    label: "Sales & Negotiation",
    tagline: "Hold leverage, resist pressure, close with confidence",
    description:
      "A dedicated engine for sales conversations — trained on objection handling, pricing pressure, deal recovery, and closing. Actively blocks weak positioning, unnecessary discounting, and passive follow-ups.",
    usedIn: ["sales"],
    features: [
      "Objection classification & response",
      "Discount resistance scripts",
      "Value reinforcement language",
      "Deal recovery sequencing",
      "Closing conversation templates",
      "Urgency creation without desperation",
    ],
  },
];

export const CAPABILITY_MAP = Object.fromEntries(
  CAPABILITIES.map((c) => [c.id, c]),
) as Record<string, Capability>;
