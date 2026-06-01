"use client";

import { useState } from "react";
import { reportOutcome } from "@/lib/api/intelligence";

type OutcomeResult =
  | "worked"
  | "partially"
  | "did_not_work"
  | "still_ongoing"
  | "no_response";

const OPTIONS: {
  value: OutcomeResult;
  label: string;
  emoji: string;
  color: string;
}[] = [
  {
    value: "worked",
    label: "It worked",
    emoji: "✓",
    color:
      "text-emerald-400 border-emerald-400/30 bg-emerald-400/8 hover:bg-emerald-400/15",
  },
  {
    value: "partially",
    label: "Partially",
    emoji: "◑",
    color:
      "text-amber-400 border-amber-400/30 bg-amber-400/8 hover:bg-amber-400/15",
  },
  {
    value: "did_not_work",
    label: "Didn't work",
    emoji: "✕",
    color: "text-red-400 border-red-400/30 bg-red-400/8 hover:bg-red-400/15",
  },
  {
    value: "still_ongoing",
    label: "Still ongoing",
    emoji: "⟳",
    color:
      "text-blue-400 border-blue-400/30 bg-blue-400/8 hover:bg-blue-400/15",
  },
  {
    value: "no_response",
    label: "No response",
    emoji: "—",
    color:
      "text-[var(--text-muted)] border-[var(--border-default)] bg-[var(--card-muted-bg)] hover:bg-[var(--card-bg)]",
  },
];

interface OutcomeReporterProps {
  conversationId: string;
}

export function OutcomeReporter({ conversationId }: OutcomeReporterProps) {
  const [selected, setSelected] = useState<OutcomeResult | null>(null);
  const [whatHappened, setWhatHappened] = useState("");
  const [step, setStep] = useState<"prompt" | "detail" | "done">("prompt");
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (val: OutcomeResult) => {
    setSelected(val);
    // No response / still ongoing — no detail needed
    if (val === "no_response" || val === "still_ongoing") {
      submit(val, "");
    } else {
      setStep("detail");
    }
  };

  const submit = async (result: OutcomeResult, detail: string) => {
    const token = localStorage.getItem("access_token");
    if (!token || !conversationId) {
      setStep("done");
      return;
    }
    setSubmitting(true);
    try {
      await reportOutcome(token, conversationId, {
        result,
        what_happened: detail || undefined,
      });
    } catch {}
    setSubmitting(false);
    setStep("done");
  };

  if (step === "done") {
    return (
      <div className="flex items-center gap-2 mt-3 px-1">
        <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center">
          <svg
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-2.5 h-2.5 text-emerald-400"
          >
            <path
              d="M2 5l2.5 2.5 3.5-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[12px] text-[var(--text-muted)]">
          Outcome recorded — thanks for the feedback
        </span>
      </div>
    );
  }

  if (step === "detail") {
    return (
      <div className="mt-3 p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-muted-bg)]">
        <p className="text-[12px] text-[var(--text-muted)] mb-2">
          What actually happened? <span className="opacity-50">(optional)</span>
        </p>
        <textarea
          value={whatHappened}
          onChange={(e) => setWhatHappened(e.target.value)}
          placeholder=""
          rows={2}
          className="w-full text-[13px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2
            text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] outline-none resize-none
            focus:border-violet-500/50 transition-all"
        />
        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            onClick={() => setStep("prompt")}
            className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => submit(selected!, whatHappened)}
            disabled={submitting}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <p className="text-[11.5px] text-[var(--text-muted)] mb-2 px-0.5">
        How did this go?
      </p>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12px] font-medium transition-all ${opt.color}`}
          >
            <span className="text-[11px] leading-none">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
