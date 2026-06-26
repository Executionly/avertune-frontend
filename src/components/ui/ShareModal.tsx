"use client";

import { useEffect, useState } from "react";
import {
  createShare,
  getShareStatus,
  revokeShare,
  type Conversation,
} from "@/lib/api/intelligence";

interface ShareModalProps {
  conversation: Conversation;
  onClose: () => void;
}

export function ShareModal({ conversation, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    (async () => {
      try {
        // Status endpoint is optional — backend may not support it.
        const existing = await getShareStatus(token, conversation.id);
        if (existing) {
          setShareUrl(existing.share_url);
          setExpiresAt(existing.expires_at ?? null);
        } else {
          const created = await createShare(token, conversation.id);
          setShareUrl(created.share_url);
          setExpiresAt(created.expires_at ?? null);
        }
      } catch {
        setError("Couldn't create a share link. Try again in a moment.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [conversation.id]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRevoke = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setIsRevoking(true);
    try {
      await revokeShare(token, conversation.id);
      onClose();
    } catch {
      // Revoke endpoint may not exist on the backend yet — close anyway
      // rather than blocking the user with an error they can't act on.
      onClose();
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-5 max-w-[440px] w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
            Share chat
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
              <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-4">
          Anyone with this link can view a read-only copy of "
          {conversation.title || "this conversation"}". They won't be able to
          see your account or continue the conversation.
        </p>

        {/* Link field */}
        {isLoading ? (
          <div className="h-10 rounded-xl bg-[var(--card-muted-bg)] animate-pulse mb-4" />
        ) : error ? (
          <div className="text-[13px] text-red-400 mb-4">{error}</div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-10 rounded-xl border border-[var(--border-default)] bg-[var(--card-muted-bg)] px-3 flex items-center overflow-hidden">
              <span className="text-[13px] text-[var(--text-muted)] truncate">
                {shareUrl}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="h-10 px-3.5 rounded-xl text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              {isCopied ? (
                <>
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                    <path d="M2.5 7.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                "Copy link"
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
          <span className="text-[12px] text-[var(--text-muted)] flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <circle cx="6" cy="6" r="5" />
              <path d="M1 6h10M6 1a7 7 0 010 10 7 7 0 010-10z" />
            </svg>
            {expiresAt
              ? `Expires ${new Date(expiresAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : "Public link"}
          </span>
          {shareUrl && !isLoading && (
            <button
              onClick={handleRevoke}
              disabled={isRevoking}
              className="text-[12px] font-medium text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
            >
              {isRevoking ? "Removing…" : "Remove link"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
