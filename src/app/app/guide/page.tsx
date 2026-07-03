// FILE: src/app/app/guide/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SectionId =
  | "getting-started"
  | "modes"
  | "capabilities"
  | "intelligence"
  | "sharing"
  | "tips";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "getting-started", label: "Getting started" },
  { id: "modes", label: "Choosing a mode" },
  { id: "capabilities", label: "Capabilities" },
  { id: "intelligence", label: "Session Intelligence" },
  { id: "sharing", label: "Sharing a conversation" },
  { id: "tips", label: "Tips for better results" },
];

function StepIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0 text-violet-400">
      {children}
    </div>
  );
}

export default function GuidePage() {
  const router = useRouter();
  const [active, setActive] = useState<SectionId>("getting-started");

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-page)] p-6 md:p-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <path d="M10 3L5 8l5 5" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-1">
          Guide
        </h1>
        <p className="text-[13px] text-[var(--text-muted)] max-w-[560px]">
          A quick walkthrough of how to get the most out of Avertune — choosing
          the right mode, using capabilities, reading your session intelligence,
          and sharing conversations.
        </p>
      </div>

      {/* Section switcher — mobile/tablet only, since the side nav is lg+ */}
      <div className="lg:hidden -mx-6 md:-mx-8 px-6 md:px-8 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "flex-shrink-0 px-3.5 py-2 rounded-full text-[12.5px] whitespace-nowrap transition-all border",
                active === s.id
                  ? "bg-violet-500/10 text-violet-400 font-medium border-violet-500/30"
                  : "text-[var(--text-muted)] border-[var(--border-default)] hover:text-[var(--text-primary)]",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 max-w-[920px]">
        {/* Section nav */}
        <nav className="hidden lg:block self-start">
          <div className="sticky top-6 space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-[12.5px] transition-all",
                  active === s.id
                    ? "bg-violet-500/10 text-violet-400 font-medium"
                    : "text-[var(--text-muted)] hover:bg-[var(--card-muted-bg)] hover:text-[var(--text-primary)]",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="space-y-10 min-w-0">
          {/* Getting started */}
          {active === "getting-started" && (
            <section id="getting-started">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">
                Getting started
              </h2>
              <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.7] mb-4">
                Avertune helps you communicate more effectively by analyzing
                what you're trying to say and giving you better, calibrated ways
                to say it. Paste in a message you've received, describe a
                situation, or just start typing what you want to respond to —
                the app takes it from there.
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Start a conversation",
                    body: "Use the input box to describe your situation or paste a message you need to respond to.",
                  },
                  {
                    title: "Pick a mode",
                    body: "Select Professional, Sales, or Relationship mode depending on the context — this shapes the tone and strategy of every response.",
                  },
                  {
                    title: "Review your options",
                    body: "Avertune returns ranked response options, each scored for clarity, confidence, and predicted outcome.",
                  },
                ].map((step, i) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <StepIcon>
                      <span className="text-[11px] font-bold">{i + 1}</span>
                    </StepIcon>
                    <div>
                      <p className="text-[13px] font-medium text-[var(--text-primary)]">
                        {step.title}
                      </p>
                      <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5 leading-[1.6]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Modes */}
          {active === "modes" && (
            <section id="modes">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">
                Choosing a mode
              </h2>
              <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.7] mb-4">
                The mode you pick changes how Avertune reads the situation.
                Switch modes any time from the chat input — the right mode makes
                a noticeable difference in response quality.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--card-bg)] p-4">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-400 text-[10.5px] font-semibold mb-2">
                    Professional
                  </span>
                  <p className="text-[12.5px] text-[var(--text-muted)] leading-[1.6]">
                    Workplace dynamics, manager conversations, negotiations, and
                    difficult professional messages.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--card-bg)] p-4">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-400 text-[10.5px] font-semibold mb-2">
                    Sales
                  </span>
                  <p className="text-[12.5px] text-[var(--text-muted)] leading-[1.6]">
                    Objection handling, pricing pressure, deal recovery, and
                    closing conversations.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--card-bg)] p-4">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 text-[10.5px] font-semibold mb-2">
                    Relationship
                  </span>
                  <p className="text-[12.5px] text-[var(--text-muted)] leading-[1.6]">
                    Personal conversations that call for emotional intelligence
                    and care.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Capabilities */}
          {active === "capabilities" && (
            <section id="capabilities">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">
                Capabilities
              </h2>
              <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.7] mb-4">
                Beyond general replies, Avertune has focused tools for specific
                jobs. You can call on these directly when you know exactly what
                you need:
              </p>
              <ul className="space-y-2.5">
                {[
                  [
                    "Reply Generator",
                    "Ranked response options for any message.",
                  ],
                  [
                    "Tone Checker",
                    "Checks how a draft message will likely come across before you send it.",
                  ],
                  [
                    "Intent Detector",
                    "Surfaces what's really being asked or implied in a message.",
                  ],
                  [
                    "Boundary Builder",
                    "Helps you say no or hold a line without damaging the relationship.",
                  ],
                  [
                    "Follow-Up Writer",
                    "Drafts a follow-up when a conversation has gone quiet.",
                  ],
                  [
                    "Difficult Email Helper",
                    "Structures hard professional emails clearly and calmly.",
                  ],
                ].map(([title, body]) => (
                  <li key={title} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-[7px]" />
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                      <span className="font-medium text-[var(--text-primary)]">
                        {title}
                      </span>{" "}
                      — {body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Session Intelligence */}
          {active === "intelligence" && (
            <section id="intelligence">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">
                Session Intelligence
              </h2>
              <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.7] mb-3">
                The panel on the right of your chat tracks how a conversation is
                going in real time — it's open by default so you can keep an eye
                on it as you work. It includes:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "CI Score — an overall read on how the conversation is trending.",
                  "Skill scores — clarity, tone control, negotiation, boundaries, and relationships.",
                  "Relationship impact — whether your messages are landing positively, neutrally, or negatively.",
                  "Insights — short, specific observations about the conversation as it develops.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-[7px]" />
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="text-[12.5px] text-[var(--text-muted)] leading-[1.6]">
                You can collapse it any time using the close icon in its header,
                and reopen it again from the chat toolbar.
              </p>
            </section>
          )}

          {/* Sharing */}
          {active === "sharing" && (
            <section id="sharing">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">
                Sharing a conversation
              </h2>
              <p className="text-[13.5px] text-[var(--text-secondary)] leading-[1.7]">
                Use the share icon in the top bar of any conversation to
                generate a read-only link. You can toggle it between private and
                public at any time, and revoke access by turning sharing off
                again — the link stops working immediately once revoked.
              </p>
            </section>
          )}

          {/* Tips */}
          {active === "tips" && (
            <section id="tips" className="pb-4">
              <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-3">
                Tips for better results
              </h2>
              <ul className="space-y-2.5">
                {[
                  "Give context, not just the message — who you're talking to and what you want to happen matters as much as the words themselves.",
                  "Switch modes if a response feels off — the wrong mode is the most common reason a reply doesn't land right.",
                  "Check the Skill scores panel after a few exchanges to see what's actually moving the conversation forward.",
                  "Use Boundary Builder before a conversation turns confrontational, not after.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-[7px]" />
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
