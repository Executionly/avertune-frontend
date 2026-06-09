"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ModeId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { getCharCountStatus } from "@/lib/utils/CharLimits";

interface ChatInputProps {
  onSend: (content: string) => void;
  onSendFile?: (file: File, text?: string) => Promise<void>;
  onSendVoice?: (audio: Blob) => Promise<void>;
  activeMode: ModeId;
  onModeChange: (mode: ModeId) => void;
  modeLocked?: boolean;
  pasteValue?: string;
  onPasteConsumed?: () => void;
}

const MODES: { id: ModeId; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "sales", label: "Sales" },
  { id: "relationship", label: "Relationship" },
];

function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="3" y="2" width="14" height="16" rx="2" fill="#7c3aed" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="1.4" strokeOpacity="0.6" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="#a78bfa" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2" y="3" width="16" height="14" rx="2" fill="#0891b2" fillOpacity="0.12" stroke="#0891b2" strokeWidth="1.4" strokeOpacity="0.6" />
      <circle cx="7" cy="8" r="1.5" fill="#67e8f9" />
      <path d="M2 14l4-4 3 3 3-4 6 5" stroke="#67e8f9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="3" y="2" width="14" height="16" rx="2" fill="#0d9488" fillOpacity="0.12" stroke="#0d9488" strokeWidth="1.4" strokeOpacity="0.6" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="#5eead4" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function getFileIcon(file: File) {
  const t = file.type;
  if (t.startsWith("image/")) return <ImageIcon className="w-8 h-8" />;
  if (t === "application/pdf") return <FileIcon className="w-8 h-8" />;
  return <DocIcon className="w-8 h-8" />;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ChatInput({
  onSend,
  onSendFile,
  onSendVoice,
  activeMode,
  onModeChange,
  modeLocked = false,
  pasteValue,
  onPasteConsumed,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { charLimit } = useCredits();

  const charStatus = getCharCountStatus(value.length, charLimit);

  useEffect(() => {
    if (pasteValue) {
      setValue(pasteValue);
      onPasteConsumed?.();
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [pasteValue, onPasteConsumed]);

  const handleSend = async () => {
    if (isSending) return;
    const trimmed = value.trim();

    if (pendingFile && onSendFile) {
      // Clear the form immediately — don't wait for the response
      const fileToSend = pendingFile;
      const textToSend = trimmed || undefined;
      setPendingFile(null);
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      setIsSending(true);
      try {
        await onSendFile(fileToSend, textToSend);
      } finally {
        setIsSending(false);
      }
      return;
    }

    if (!trimmed || charStatus === "error") return;
    // Clear immediately
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSend(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  // ── File select — hold in state, don't send yet ──────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setPendingFile(file);
    // Focus textarea so user can optionally add context
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  // ── Voice recording ──────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
        if (onSendVoice) {
          await onSendVoice(audioBlob);
        }
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      // Permission denied or not supported
    }
  }, [onSendVoice]);

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

  const counterColor =
    charStatus === "error"
      ? "text-red-400"
      : charStatus === "warning"
        ? "text-amber-400"
        : "text-[var(--text-muted)]";

  const formatRecTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const canSend = !isSending && !isRecording && (pendingFile != null || (value.trim().length > 0 && charStatus !== "error"));

  return (
    <div className="flex-shrink-0 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3">
      <div className="max-w-[720px] mx-auto">

        {/* ── Claude-style file attachment pill ── */}
        {pendingFile && (
          <div className="mb-2.5 px-1">
            <div className="inline-flex items-center gap-3 px-3 py-2.5 rounded-xl
              bg-[var(--card-bg)] border border-[var(--card-border)]
              shadow-sm max-w-[280px] group relative">
              {/* File type icon */}
              <div className="flex-shrink-0">
                {getFileIcon(pendingFile)}
              </div>
              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-[var(--text-primary)] truncate leading-tight">
                  {pendingFile.name}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-tight">
                  {pendingFile.type === "application/pdf" ? "PDF" :
                   pendingFile.type.startsWith("image/") ? "Image" :
                   pendingFile.type.includes("word") ? "Word doc" : "Document"}
                  {" · "}{formatFileSize(pendingFile.size)}
                </p>
              </div>
              {/* Remove button */}
              <button
                onClick={() => setPendingFile(null)}
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                  text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)]
                  transition-all"
                title="Remove file"
              >
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-2.5 h-2.5">
                  <path d="M2 2l6 6M8 2L2 8" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div
          className={cn(
            "bg-[var(--input-bg)] border rounded-2xl px-4 pt-3.5 pb-3 transition-all",
            isRecording
              ? "border-red-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : charStatus === "error"
                ? "border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                : "border-[var(--input-border)] focus-within:border-violet-500/60 focus-within:shadow-[0_0_0_3px_rgba(124,79,232,0.1)]",
          )}
        >
          {isRecording ? (
            <div className="flex items-center gap-3 min-h-[44px] mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[13.5px] text-[var(--text-primary)]">
                Recording… {formatRecTime(recordingSeconds)}
              </span>
              <span className="text-[12px] text-[var(--text-muted)]">
                Click stop when done
              </span>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={pendingFile ? "Add context or just hit send…" : "Paste a message to analyse…"}
              rows={2}
              className="w-full border-none outline-none resize-none bg-transparent text-[14px] text-[var(--input-text)] leading-[1.6]
                max-h-[160px] min-h-[44px] placeholder:text-[var(--input-placeholder)] font-[var(--font-body)]"
            />
          )}

          {charStatus === "error" && (
            <p className="text-[11.5px] text-red-400 mb-2 flex items-center gap-1">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3 flex-shrink-0">
                <circle cx="6" cy="6" r="5" />
                <path d="M6 4v2.5" strokeLinecap="round" />
                <circle cx="6" cy="8.5" r=".5" fill="currentColor" stroke="none" />
              </svg>
              Character limit reached. Shorten your message or upgrade your plan.
            </p>
          )}

          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              {!modeLocked && (
                <>
                  <span className="text-[12px] text-[var(--text-muted)] mr-0.5 hidden sm:inline">Mode:</span>
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onModeChange(m.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all",
                        activeMode === m.id
                          ? "border-violet-500 text-violet-500 bg-violet-500/10"
                          : "border-[var(--input-border)] text-[var(--text-muted)] hover:border-violet-400/50 hover:text-[var(--text-primary)]",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </>
              )}

              <div className={cn("flex items-center gap-1", modeLocked ? "" : "ml-1 pl-1 border-l border-[var(--border-default)]")}>
                {/* File upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file or PDF"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
                >
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-3.5 h-3.5">
                    <path d="M7.5 1.5H3A1 1 0 002 2.5v9a1 1 0 001 1h8a1 1 0 001-1V5.5L7.5 1.5z" strokeLinejoin="round" />
                    <path d="M7.5 1.5V5.5H11.5" strokeLinecap="round" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Voice record */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  title={isRecording ? "Stop recording" : "Record voice message"}
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                    isRecording
                      ? "text-red-400 bg-red-400/10 hover:bg-red-400/20"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)]",
                  )}
                >
                  {isRecording ? (
                    <svg viewBox="0 0 14 14" fill="currentColor" className="w-3 h-3">
                      <rect x="1" y="1" width="12" height="12" rx="1.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-3.5 h-3.5">
                      <rect x="4.5" y="1" width="5" height="8" rx="2.5" />
                      <path d="M2 7a5 5 0 0010 0" strokeLinecap="round" />
                      <line x1="7" y1="12" x2="7" y2="10" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {!isRecording && !pendingFile && (
                <span className={cn("text-[11px] tabular-nums transition-colors", counterColor)}>
                  {value.length}/{charLimit}
                </span>
              )}
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white flex-shrink-0
                  hover:bg-[var(--accent-hover)] disabled:opacity-35 disabled:cursor-not-allowed transition-all hover:scale-[1.05]"
              >
                {isSending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" className="w-3.5 h-3.5">
                    <line x1="8" y1="13" x2="8" y2="3" />
                    <polyline points="4,7 8,3 12,7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[11px] text-[var(--text-muted)] mt-2">
          Avertune analyses communication situations. Always apply your own judgement.
        </p>
      </div>
    </div>
  );
}
