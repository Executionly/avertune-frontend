import type { NavItem } from "@/lib/types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Platform",
    items: [
      {
        icon: "",
        label: "Intelligence Pipeline",
        description: "14-step situational analysis engine",
        href: "/platform#intelligence-pipeline",
      },
      {
        icon: "",
        label: "Outcome Simulation",
        description: "See likely outcomes before you send",
        href: "/platform#outcome-simulation",
      },
      {
        icon: "",
        label: "Communication Score",
        description: "Real-time clarity, tone & risk metrics",
        href: "/platform#communication-score",
      },
      {
        icon: "",
        label: "Behavioural Memory",
        description: "Learns your patterns, improves over time",
        href: "/platform#behavioural-memory",
      },
      {
        icon: "",
        label: "Playbook Engine",
        description: "Communication standards at scale",
        href: "/platform#playbook-engine",
      },
      {
        icon: "",
        label: "Team Analytics",
        description: "Communication insights for modern teams",
        href: "/platform#team-analytics",
      },
    ],
  },
  {
    label: "Modes",
    sections: [
      {
        title: "Communication Modes",
        links: [
          {
            icon: "",
            label: "Professional Mode",
            href: "/modes/professional",
          },
          { icon: "", label: "Sales Mode", href: "/modes/sales" },
          {
            icon: "",
            label: "Relationship Mode",
            href: "/modes/relationship",
          },
        ],
      },
    ],
  },
  {
    label: "Capabilities",
    sections: [
      {
        title: "Tools",
        links: [
          {
            icon: "",
            label: "Reply Generator",
            href: "/capabilities/reply-generator",
          },
          {
            icon: "",
            label: "Sales & Negotiation",
            href: "/capabilities/sales-negotiation",
          },
          {
            icon: "",
            label: "Tone Checker",
            href: "/capabilities/tone-checker",
          },
          {
            icon: "",
            label: "Intent Detector",
            href: "/capabilities/intent-detector",
          },
          {
            icon: "",
            label: "Boundary Builder",
            href: "/capabilities/boundary-builder",
          },
          {
            icon: "",
            label: "Follow-Up Writer",
            href: "/capabilities/follow-up-writer",
          },
          {
            icon: "",
            label: "Difficult Email",
            href: "/capabilities/difficult-email",
          },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    sections: [
      {
        title: "By Team",
        links: [
          {
            icon: "",
            label: "Enterprise & Teams",
            href: "/solutions#enterprise",
          },
          {
            icon: "",
            label: "Sales Teams & SDRs",
            href: "/solutions#sales-teams",
          },
          { icon: "", label: "HR & Recruiting", href: "/solutions#hr" },
          {
            icon: "",
            label: "Individuals & Founders",
            href: "/solutions#individuals",
          },
        ],
      },
      {
        title: "By Use Case",
        links: [
          {
            icon: "",
            label: "Salary Negotiation",
            href: "/solutions#salary",
          },
          { icon: "", label: "Deal Closing", href: "/solutions#deals" },
          {
            icon: "",
            label: "Difficult Conversations",
            href: "/solutions#difficult",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    sections: [
      {
        title: "Learn",
        links: [
          { icon: "", label: "Blog", href: "/blog" },
          { icon: "", label: "Help Center", href: "/help" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/enterprise" },
];

export const FOOTER_LINKS = {
  Capabilities: [
    { label: "Tone Checker", href: "/capabilities/tone-checker" },
    { label: "Intent Detector", href: "/capabilities/intent-detector" },
    { label: "Sales & Negotiation", href: "/capabilities/sales-negotiation" },
    { label: "Reply Generator", href: "/capabilities/reply-generator" },
    { label: "Follow-Up Writer", href: "/capabilities/follow-up-writer" },
    { label: "Difficult Email", href: "/capabilities/difficult-email" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Avertune", href: "/about" },
    { label: "Affiliate Program", href: "/affiliate" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Responsible Use", href: "/responsible-use" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security & Trust", href: "/security" },
  ],
};
