// FILE: src/components/ui/HeroInput.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const CHIPS = [
  { id: "professional", label: "Professional", dot: "" },
  { id: "sales", label: "Sales", dot: "" },
  { id: "relationship", label: "Relationship", dot: "" },
];

interface HeroInputProps {
  placeholder?: string;
  onAnalyse: (message: string, mode: string) => void;
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (!inputValue.trim() || isOverLimit) return;
    onAnalyse(inputValue, activeChip);
  };

  // File upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setAttachmentName(file.name);
    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = `[PDF attached: ${file.name}]\n\nPlease analyse the content of this PDF document.`;
      } else {
        text = await file.text();
      }
      setInputValue(text.slice(0, charLimit));
    } catch {
      setAttachmentName(null);
    }
  };

  // Voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setInputValue((prev) =>
          prev
            ? prev + "\n[Voice recording transcription pending]"
            : "[Voice recording transcription pending]",
        );
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(
        () => setRecordingSeconds((s) => s + 1),
        1000,
      );
    } catch {}
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingSeconds(0);
  }, []);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

  const formatRecTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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
              onClick={() => {
                setAttachmentName(null);
                setInputValue("");
              }}
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
          isRecording
            ? "border-red-400"
            : isOverLimit
              ? "border-red-400"
              : "border-navy-200",
        )}
      >
        {isRecording ? (
          <div className="flex items-center gap-3 h-[120px]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[15px] text-navy-800">
              Recording… {formatRecTime(recordingSeconds)}
            </span>
            <span className="text-[13px] text-navy-400">
              Click stop when done
            </span>
          </div>
        ) : (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className="w-full border-none outline-none resize-none text-[15px] text-navy-800 bg-transparent h-[340px]"
          />
        )}

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
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium border-[1.5px]",
                    activeChip === c.id
                      ? "border-violet-500 text-violet-500 bg-violet-50"
                      : "border-navy-200 text-navy-500 hover:border-violet-300",
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
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
              accept=".txt,.pdf,text/plain,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Voice */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? "Stop recording" : "Record voice message"}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
                isRecording
                  ? "text-red-500 bg-red-50 border-red-300"
                  : "text-navy-400 hover:text-navy-700 hover:bg-navy-50 border-navy-200",
              )}
            >
              {isRecording ? (
                <svg
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <rect x="1" y="1" width="12" height="12" rx="1.5" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="w-5 h-5"
                >
                  <rect x="4.5" y="1" width="5" height="8" rx="2.5" />
                  <path d="M2 7a5 5 0 0010 0" strokeLinecap="round" />
                  <line x1="7" y1="12" x2="7" y2="10" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {/* Char counter */}
            {!isRecording && (
              <span
                className={cn(
                  "text-[12px] tabular-nums transition-colors",
                  counterColor,
                )}
              >
                {inputValue.length}/{charLimit}
              </span>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isOverLimit}
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
