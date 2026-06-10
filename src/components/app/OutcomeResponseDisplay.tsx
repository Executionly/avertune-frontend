"use client";

import { cn } from "@/lib/utils";

interface OutcomeResponseDisplayProps {
  acknowledgment?: string;
  analysis?: string;
  next_steps?: Array<{
    action: string;
    timeline: string;
    why: string;
  }>;
  what_to_watch_for?: string;
  alternative_path?: string;
  encouragement?: string;
  suggested_prompts?: Array<{
    text: string;
    category: string;
    position: number;
  }>;
  onSuggestionClick?: (text: string) => void;
  outcome_recorded?: string;
}

export function OutcomeResponseDisplay({
  acknowledgment,
  analysis,
  next_steps,
  what_to_watch_for,
  alternative_path,
  encouragement,
  suggested_prompts,
  onSuggestionClick,
  outcome_recorded,
}: OutcomeResponseDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Acknowledgment */}
      {acknowledgment && (
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl px-4 py-3">
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
            {acknowledgment}
          </p>
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
            {analysis}
          </p>
        </div>
      )}

      {/* Next Steps */}
      {next_steps && next_steps.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
            Here's what to do next
          </p>
          <div className="space-y-3">
            {next_steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="font-semibold text-[var(--text-primary)] min-w-[20px]">
                  {i + 1}.
                </span>
                <div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">
                    {step.action}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {step.timeline}
                  </p>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                    {step.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What to watch for */}
      {what_to_watch_for && (
        <div className="border-l-2 border-amber-400/60 pl-3">
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-1">
            Watch for
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
            {what_to_watch_for}
          </p>
        </div>
      )}

      {/* Alternative path */}
      {alternative_path && (
        <div className="border-l-2 border-blue-400/60 pl-3">
          <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
            Backup plan
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
            {alternative_path}
          </p>
        </div>
      )}

      {/* Encouragement */}
      {encouragement && (
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl px-4 py-3">
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.65]">
            {encouragement}
          </p>
        </div>
      )}

      {/* Suggested prompts */}
      {suggested_prompts && suggested_prompts.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] text-[var(--text-muted)] mb-2">
            Suggested follow-ups
          </p>
          <div className="flex flex-wrap gap-2">
            {suggested_prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(prompt.text)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12.5px] border transition-all text-left",
                  prompt.category === "action"
                    ? "border-gray-500 bg-gray-100 dark:bg-gray-800 text-[var(--text-primary)] hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
                    : "border-gray-200 dark:border-gray-700 text-[var(--text-muted)] hover:border-gray-400 hover:text-[var(--text-primary)]",
                )}
              >
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Outcome recorded badge */}
      {outcome_recorded && (
        <div className="flex justify-end">
          <span className="text-[10px] text-[var(--text-muted)] capitalize">
            Recorded: {outcome_recorded.replace("_", " ")}
          </span>
        </div>
      )}
    </div>
  );
}
