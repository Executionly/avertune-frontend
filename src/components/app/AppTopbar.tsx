"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/api/intelligence";
import { ShareModal } from "@/components/ui/ShareModal";

interface AppTopbarProps {
  panelOpen: boolean;
  onTogglePanel: () => void;
  activeConversation?: Conversation | null;
  activeThreadId?: string;
}

export function AppTopbar({
  panelOpen,
  onTogglePanel,
  activeConversation,
  activeThreadId,
}: AppTopbarProps) {
  const title = activeConversation?.title || "New conversation";
  const [isShareOpen, setIsShareOpen] = useState(false);

  // `activeConversation` is only populated once a conversation is loaded
  // from history (loadConversation). For a brand-new chat, the backend
  // assigns a thread/conversation id before the full object is fetched,
  // so fall back to a minimal shareable conversation built from that id
  // rather than waiting for a refresh/reselect to populate the full object.
  const shareableConversation: Conversation | null =
    activeConversation ??
    (activeThreadId
      ? ({ id: activeThreadId, title: "" } as Conversation)
      : null);

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--topbar-border)] bg-[var(--topbar-bg)] flex-shrink-0 md:pl-5">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile spacer for hamburger */}
        <div className="w-10 md:hidden flex-shrink-0" />
        <span className="text-[14px] font-medium text-[var(--text-primary)] truncate max-w-[200px] sm:max-w-xs">
          {title}
        </span>
        {activeConversation && (
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--card-muted-bg)] border border-[var(--card-border)] text-[var(--text-muted)] capitalize flex-shrink-0">
            {activeConversation.mode}
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Share */}
        {shareableConversation && (
          <button
            onClick={() => setIsShareOpen(true)}
            title="Share chat"
            className="w-8 h-8 rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--text-muted)] hover:border-violet-400/50 hover:text-[var(--text-primary)] transition-all"
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="w-3.5 h-3.5"
            >
              <circle cx="11" cy="3" r="1.8" />
              <circle cx="3" cy="7" r="1.8" />
              <circle cx="11" cy="11" r="1.8" />
              <path d="M4.6 6.2l4.8-2.4M4.6 7.8l4.8 2.4" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Upgrade */}
        <Link
          href="/pricing"
          className="hidden sm:inline-flex h-8 px-3 text-[13px] font-medium bg-violet-600 text-white rounded-lg items-center gap-1.5 hover:bg-violet-500 transition-colors"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-3.5 h-3.5"
          >
            <path
              d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"
              strokeLinejoin="round"
            />
          </svg>
          Upgrade
        </Link>

        {/* Intelligence Panel Toggle */}
        <button
          onClick={onTogglePanel}
          title={panelOpen ? "Close panel" : "Session Intelligence"}
          className={cn(
            "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
            panelOpen
              ? "bg-violet-500/10 border-violet-500/30 text-violet-500"
              : "bg-[var(--card-bg)] border-[var(--border-default)] text-[var(--text-muted)] hover:border-violet-400/50 hover:text-[var(--text-primary)]",
          )}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="w-3.5 h-3.5"
          >
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <line x1="9" y1="1" x2="9" y2="15" />
          </svg>
        </button>
      </div>
      {isShareOpen && shareableConversation && (
        <ShareModal
          conversation={shareableConversation}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
}
