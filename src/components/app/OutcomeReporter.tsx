"use client";

import { useState } from "react";
import { reportOutcome } from "@/lib/api/intelligence";
import { OutcomeResponseDisplay } from "./OutcomeResponseDisplay";

type OutcomeResult =
  | "worked"
  | "partially"
  | "did_not_work"
  | "still_ongoing"
  | "no_response";

const OPTIONS: { value: OutcomeResult; label: string }[] = [
  { value: "worked", label: "It worked" },
  { value: "partially", label: "Partially" },
  { value: "did_not_work", label: "Didn't work" },
  { value: "still_ongoing", label: "Still ongoing" },
  { value: "no_response", label: "No response" },
];

interface OutcomeReporterProps {
  conversationId: string;
  messageId: string;
  onResponse?: (
    text: string,
    suggestions?: Array<{ text: string; category: string; position: number }>,
  ) => void;
}

export function OutcomeReporter({
  conversationId,
  messageId,
  onResponse,
}: OutcomeReporterProps) {
  const storageKey = `outcome_done_${messageId}`;

  const [step, setStep] = useState<"prompt" | "detail" | "done" | "response">(
    () => {
      if (typeof window !== "undefined" && localStorage.getItem(storageKey))
        return "done";
      return "prompt";
    },
  );
  const [selected, setSelected] = useState<OutcomeResult | null>(null);
  const [whatHappened, setWhatHappened] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [outcomeResponse, setOutcomeResponse] = useState<any>(null);

  const handleSelect = (val: OutcomeResult) => {
    setSelected(val);
    if (val === "no_response" || val === "still_ongoing") {
      submit(val, "");
    } else {
      setStep("detail");
    }
  };

  const submit = async (result: OutcomeResult, detail: string) => {
    const token = localStorage.getItem("access_token");
    setSubmitting(true);
    if (token && conversationId) {
      try {
        const data = await reportOutcome(token, conversationId, {
          result,
          what_happened: detail || undefined,
        });

        setOutcomeResponse(data);
        setStep("response");
        // NOTE: We intentionally do NOT call onResponse here.
        // The outcome response is displayed inline in the OutcomeReporter component.
        // onResponse is only called when the user clicks a suggested follow-up pill.
      } catch (err) {
        console.error("Failed to report outcome:", err);
      }
    }
    setSubmitting(false);
  };

  if (step === "done") return null;

  if (step === "response" && outcomeResponse) {
    const resp = outcomeResponse.response;
    return (
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <OutcomeResponseDisplay
          acknowledgment={resp?.acknowledgment}
          analysis={resp?.analysis}
          next_steps={resp?.next_steps}
          what_to_watch_for={resp?.what_to_watch_for}
          alternative_path={resp?.alternative_path}
          encouragement={resp?.encouragement}
          suggested_prompts={outcomeResponse.suggested_prompt}
          onSuggestionClick={(text) => onResponse?.(text)}
          outcome_recorded={outcomeResponse.outcome_recorded}
        />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="mt-3 flex items-center gap-2.5">
        <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--card-muted-bg)] border border-[var(--card-border)]">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
        </div>
        <span className="text-[11.5px] text-[var(--text-muted)]">
          Avertune is thinking…
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
          rows={2}
          className="w-full text-[13px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2
            text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] outline-none resize-none
            focus:border-gray-400 transition-all"
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
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-800 hover:bg-gray-700 text-white transition-all disabled:opacity-50"
          >
            Submit
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
            className="px-2.5 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-[12px] font-medium text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
