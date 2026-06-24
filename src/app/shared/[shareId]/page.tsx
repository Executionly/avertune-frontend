"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  getSharedConversation,
  type SharedConversationResponse,
} from "@/lib/api/intelligence";

export default function SharedConversationPage() {
  const params = useParams();
  const shareId = String(params?.shareId ?? "");

  const [data, setData] = useState<SharedConversationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) return;
    (async () => {
      try {
        const res = await getSharedConversation(shareId);
        if (res.is_revoked) {
          setError("This shared link is no longer available.");
        } else {
          setData(res);
        }
      } catch {
        setError("This shared link doesn't exist or has been removed.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [shareId]);

  return (
    <div className="min-h-screen bg-[var(--page-bg,#0a0a0c)] flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--border-default)] flex-shrink-0">
        <Logo />
        <a
          href="/"
          className="h-8 px-3.5 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors flex items-center"
        >
          Try Avertune
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-[680px]">
          {isLoading && (
            <div className="flex flex-col gap-3 mt-10">
              <div className="h-5 w-1/2 rounded bg-[var(--card-muted-bg)] animate-pulse" />
              <div className="h-20 w-full rounded-2xl bg-[var(--card-muted-bg)] animate-pulse" />
              <div className="h-20 w-3/4 rounded-2xl bg-[var(--card-muted-bg)] animate-pulse ml-auto" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center text-center mt-20">
              <div className="w-12 h-12 rounded-full bg-[var(--card-muted-bg)] border border-[var(--border-default)] flex items-center justify-center mb-4">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="w-5 h-5 text-[var(--text-muted)]"
                >
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
                Link unavailable
              </h1>
              <p className="text-[13px] text-[var(--text-muted)] max-w-[320px]">
                {error}
              </p>
            </div>
          )}

          {!isLoading && !error && data && (
            <>
              {/* Conversation header */}
              <div className="mb-6 pb-4 border-b border-[var(--border-default)]">
                <h1 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1.5">
                  {data.title || "Shared conversation"}
                </h1>
                <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--card-muted-bg)] border border-[var(--card-border)] capitalize">
                    {data.mode}
                  </span>
                  <span>
                    {new Date(data.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {data.shared_by && <span>· Shared by {data.shared_by}</span>}
                </div>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-4">
                {data.messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "self-end max-w-[85%]"
                        : "self-start max-w-[90%]"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "rounded-2xl px-4 py-2.5 bg-violet-600 text-white text-[14px] leading-relaxed whitespace-pre-wrap"
                          : "rounded-2xl px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--border-default)] text-[var(--text-primary)] text-[14px] leading-relaxed whitespace-pre-wrap"
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-10 pt-6 border-t border-[var(--border-default)] flex flex-col items-center text-center gap-2">
                <p className="text-[13px] text-[var(--text-muted)]">
                  This is a read-only view. Start your own conversation with
                  Avertune.
                </p>
                <a
                  href="/"
                  className="h-9 px-4 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors inline-flex items-center"
                >
                  Get started free
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
