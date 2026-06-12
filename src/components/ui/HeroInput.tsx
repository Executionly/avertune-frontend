// FILE: src/components/ui/HeroInput.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CHIPS = [
  { id: "professional", label: "Professional", dot: "" },
  { id: "sales", label: "Sales", dot: "" },
  { id: "relationship", label: "Relationship", dot: "" },
];

interface HeroInputProps {
  placeholder?: string;
  onAnalyse: (
    message: string,
    mode: string,
    filePayload?: { base64: string; name: string; type: string },
  ) => void;
  defaultMode?: string;
  showModeChips?: boolean;
  pasteValue?: string;
  onPasteConsumed?: () => void;
  charLimit?: number;
  onModeChange?: (mode: string) => void;
}

export function HeroInput({
  placeholder = "Paste any message you need to respond to...",
  onAnalyse,
  defaultMode = "professional",
  showModeChips = true,
  pasteValue,
  onPasteConsumed,
  charLimit = 500,
  onModeChange,
}: HeroInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [activeChip, setActiveChip] = useState(defaultMode);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  // For PDF/binary files we keep the base64 payload separate so the textarea
  // shows a human-readable label while the real data is still available.
  const pendingFileRef = useRef<{
    base64: string;
    name: string;
    type: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChipClick = (id: string) => {
    setActiveChip(id);
    onModeChange?.(id);
  };

  useEffect(() => {
    if (pasteValue) {
      setInputValue(pasteValue);
      onPasteConsumed?.();
    }
  }, [pasteValue, onPasteConsumed]);

  const isOverLimit = inputValue.length > charLimit;
  const isNearLimit = inputValue.length >= charLimit * 0.85;

  const counterColor = isOverLimit
    ? "text-red-500"
    : isNearLimit
      ? "text-amber-500"
      : "text-navy-400";

  const handleSubmit = () => {
    if (isOverLimit) return;
    // If a file is attached, we may have either extracted text or a binary payload
    if (pendingFileRef.current) {
      onAnalyse(inputValue, activeChip, pendingFileRef.current);
      return;
    }
    if (!inputValue.trim()) return;
    onAnalyse(inputValue, activeChip);
  };

  // File upload — reads text files fully; converts PDF/binary to base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setAttachmentName(file.name);
    pendingFileRef.current = null;

    const isPdf = file.type === "application/pdf";
    const isTextLike =
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md");

    try {
      if (isTextLike) {
        const text = await file.text();
        setInputValue(text.slice(0, charLimit));
      } else if (isPdf) {
        // Convert to base64 so it survives the sessionStorage round-trip
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        pendingFileRef.current = { base64, name: file.name, type: file.type };
        // Show a descriptive placeholder in the textarea so the user knows what's attached
        setInputValue(`Avertune, please conduct a thorough and comprehensive analysis of the contents of this document, taking into consideration its key messages, underlying concerns, intent, tone, and potential implications. Identify any important points that require attention, highlight areas that may warrant clarification, and provide actionable insights into the sender's position. Based on your assessment, help me formulate a well-structured, professional, and persuasive response that effectively addresses the issues raised while aligning with my objectives and maintaining an appropriate tone.
`);
      } else {
        // Other binary (docx etc.) — treat as base64
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        pendingFileRef.current = { base64, name: file.name, type: file.type };
        setInputValue(
          `[File attached: ${file.name}]\n\nPlease analyse the content of this document.`,
        );
      }
    } catch {
      setAttachmentName(null);
      pendingFileRef.current = null;
    }
  };

  const handleClearAttachment = () => {
    setAttachmentName(null);
    setInputValue("");
    pendingFileRef.current = null;
  };

  return (
    <div className="w-full max-w-[820px] mx-auto">
      {/* Attachment badge */}
      {attachmentName && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-[11.5px] text-violet-600 font-medium">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="w-3 h-3"
            >
              <path
                d="M6.5 1H2.5A.5.5 0 002 1.5v9a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V4L6.5 1z"
                strokeLinejoin="round"
              />
              <path d="M6.5 1v3H10" strokeLinecap="round" />
            </svg>
            <span className="max-w-[180px] truncate">{attachmentName}</span>
            <button
              onClick={handleClearAttachment}
              className="ml-0.5 text-violet-400 hover:text-violet-600"
            >
              <svg
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-2.5 h-2.5"
              >
                <path d="M2 2l6 6M8 2L2 8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          "bg-white rounded-[28px] border-[1.5px] p-5 pb-4 shadow-md transition-all",
          isOverLimit ? "border-red-400" : "border-navy-200",
        )}
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full border-none outline-none resize-none text-[15px] text-navy-800 bg-transparent h-[340px] sm:h-[340px]"
        />

        {isOverLimit && (
          <p className="text-[12px] text-red-500 mb-2 flex items-center gap-1">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-3 h-3 flex-shrink-0"
            >
              <circle cx="6" cy="6" r="5" />
              <path d="M6 4v2.5" strokeLinecap="round" />
              <circle
                cx="6"
                cy="8.5"
                r=".5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            Character limit reached. Please shorten your message or upgrade your
            plan.
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-900/[0.08] gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {showModeChips &&
              CHIPS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleChipClick(c.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition-all",
                    activeChip === c.id
                      ? "border-violet-500 text-violet-500 bg-violet-50"
                      : "border-navy-200 text-navy-500 hover:border-violet-300",
                  )}
                >
                  {c.label}
                </button>
              ))}
            {!showModeChips && <div />}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* File attach */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach file or PDF"
              className="w-9 h-9 rounded-full flex items-center justify-center text-navy-400 hover:text-navy-700 hover:bg-navy-50 border border-navy-200 transition-all"
            >
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="w-5 h-5"
              >
                <path
                  d="M7.5 1.5H3A1 1 0 002 2.5v9a1 1 0 001 1h8a1 1 0 001-1V5.5L7.5 1.5z"
                  strokeLinejoin="round"
                />
                <path d="M7.5 1.5V5.5H11.5" strokeLinecap="round" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,text/plain,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Char counter — hide when file attached without text content */}
            <span
              className={cn(
                "text-[12px] tabular-nums transition-colors",
                counterColor,
              )}
            >
              {inputValue.length}/{charLimit}
            </span>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={
                isOverLimit || (!inputValue.trim() && !pendingFileRef.current)
              }
              className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-navy-700 text-white hover:scale-[1.06] transition-all shadow-violet disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg
                viewBox="0 0 18 18"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                className="w-5 h-5 mx-auto"
              >
                <line x1="9" y1="14" x2="9" y2="4" />
                <polyline points="5,8 9,4 13,8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
