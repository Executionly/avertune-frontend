"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { ChatMessages } from "@/components/app/ChatMessages";
import { ChatInput } from "@/components/app/ChatInput";
import { SessionIntelligencePanel } from "@/components/app/SessionIntelligencePanel";
import { useChat } from "@/lib/hooks/useChat";
import { useAuth } from "@/lib/contexts/AuthContext";
import { CreditReminder } from "@/components/app/CreditReminder";
import { useCredits } from "@/lib/contexts/CreditsContext";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { useNotification } from "@/lib/contexts/NotificationContext";

export default function AppPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const handlePasteToInput = (s: string) => setPasteValue(s);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pendingProcessed = useRef(false);
  const [outcomeSuggestions, setOutcomeSuggestions] = useState<
    Array<{ text: string; category: string; position: number }>
  >([]);
  const {
    messages,
    isTyping,
    streamingPhase,
    detectedCapability,
    activeMode,
    threadId,
    activeConversation,
    sessionStats,
    loadingConversation,
    modeLocked,
    insufficientCredits,
    chatError,
    chatErrorCode,
    pendingChallenge,
    dismissCreditsAlert,
    dismissChatError,
    silentRefreshStats,
    appendMessage,
    proceedChallenge,
    dismissChallenge,
    setActiveMode,
    sendMessage,
    sendFile,
    sendVoice,
    pendingVoice,
    isTranscribing,
    confirmVoiceSend,
    dismissPendingVoice,
    startNewConversation,
    loadConversation,
    restoreLastConversation,
    refreshSidebar,
  } = useChat();
  const { refreshCredits } = useCredits();
  const { notify, dismiss } = useNotification();

  // Track notification IDs so we can dismiss them when the underlying state clears
  const chatErrorNotifId = useRef<string | null>(null);
  const insufficientCreditsNotifId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/signin");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) refreshCredits();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshCredits]);

  // ── Restore pending analysis / file from marketing pages ───────────────────
  // Wait until auth has fully resolved AND user is authenticated before reading
  // pending data. Using localStorage (not sessionStorage) so data survives the
  // unauthenticated redirect: marketing page → /app → /auth/signin → /app.
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (pendingProcessed.current) return;

    const pendingAnalysis = localStorage.getItem("pendingAnalysis");
    const pendingMode = localStorage.getItem("pendingMode") as any;
    const pendingFileData = localStorage.getItem("pendingFile");

    pendingProcessed.current = true;

    if (pendingAnalysis || pendingFileData) {
      startNewConversation();
      if (pendingMode) setActiveMode(pendingMode);

      localStorage.removeItem("pendingAnalysis");
      localStorage.removeItem("pendingMode");
      localStorage.removeItem("pendingCapability");
      localStorage.removeItem("pendingFile");

      setTimeout(async () => {
        if (pendingFileData) {
          try {
            const { base64, name, type, text } = JSON.parse(pendingFileData);
            const byteString = atob(base64);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const file = new File([ab], name, { type });
            await sendFile(file, text || "");
          } catch {
            // If file restore fails, fall back to text analysis if present
            if (pendingAnalysis) await sendMessage(pendingAnalysis);
          }
        } else if (pendingAnalysis) {
          await sendMessage(pendingAnalysis);
        }
      }, 150);
    } else {
      restoreLastConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  // ── Chat error → central notification ──────────────────────────────────────
  useEffect(() => {
    if (chatError) {
      // Dismiss previous if still active
      if (chatErrorNotifId.current) {
        dismiss(chatErrorNotifId.current);
      }

      const isUpgrade = chatErrorCode === "CAPABILITY_LOCKED";
      const isWordLimit = chatErrorCode === "WORD_LIMIT_EXCEEDED";
      const isRetryable =
        chatErrorCode &&
        [
          "CREDIT_DEDUCTION_FAILED",
          "GENERATION_FAILED",
          "PROCESSING_ERROR",
        ].includes(chatErrorCode);

      const title = isUpgrade
        ? "Plan upgrade required"
        : isWordLimit
          ? "Message too long"
          : "Something went wrong";

      chatErrorNotifId.current = notify({
        severity: isUpgrade ? "credit" : "error",
        title,
        message: chatError,
        actionLabel: isRetryable ? "Try again" : undefined,
        actionHref: undefined,
        duration: 8000,
        onDismiss: dismissChatError,
      });
    } else {
      // chatError was cleared externally — dismiss the notification
      if (chatErrorNotifId.current) {
        dismiss(chatErrorNotifId.current);
        chatErrorNotifId.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatError, chatErrorCode]);

  // ── Insufficient credits → central notification ─────────────────────────────
  useEffect(() => {
    if (insufficientCredits) {
      if (insufficientCreditsNotifId.current) {
        dismiss(insufficientCreditsNotifId.current);
      }
      insufficientCreditsNotifId.current = notify({
        severity: "credit",
        title: "Insufficient credits",
        message: "Top up or upgrade your plan to continue.",
        actionLabel: "View Plans →",
        actionHref: "/pricing",
        duration: 0, // sticky until dismissed
        onDismiss: dismissCreditsAlert,
      });
    } else {
      if (insufficientCreditsNotifId.current) {
        dismiss(insufficientCreditsNotifId.current);
        insufficientCreditsNotifId.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insufficientCredits]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="w-8 h-8 rounded-full border-[3px] border-violet-500/30 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-page)]">
      <AppSidebar
        user={user}
        onLogout={handleLogout}
        activeThreadId={threadId}
        onSelectThread={loadConversation}
        onNewConversation={startNewConversation}
        refreshTrigger={refreshSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppTopbar
          panelOpen={panelOpen}
          onTogglePanel={() => setPanelOpen((v) => !v)}
          activeConversation={activeConversation}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          {/* Headless credit/expiry watcher — fires into NotificationContext */}
          <CreditReminder />

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            streamingPhase={streamingPhase}
            detectedCapability={detectedCapability}
            loadingConversation={loadingConversation}
            onSuggestionClick={(text) => {
              sendMessage(text);
            }}
            onPasteToInput={handlePasteToInput}
            activeConversationId={threadId}
            activeMode={activeMode}
            onOutcomeResponse={(text) => {
              if (text) sendMessage(text);
            }}
            conversationSuggestions={
              activeConversation?.last_suggested_prompts || []
            }
          />

          {/* Challenge warning — kept separate as it has interactive proceed/dismiss logic */}
          {pendingChallenge && (
            <div className="absolute inset-x-0 bottom-[84px] flex justify-center z-40 px-4">
              <div className="w-full max-w-[720px] bg-[var(--card-bg)] border border-amber-500/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4 text-amber-400"
                    >
                      <path
                        d="M8 1.5L14.5 13H1.5L8 1.5z"
                        strokeLinejoin="round"
                      />
                      <path d="M8 6v3.5" strokeLinecap="round" />
                      <circle
                        cx="8"
                        cy="11.5"
                        r=".6"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-amber-400 mb-1">
                      Risk detected
                    </p>
                    <p className="text-[13px] text-[var(--text-primary)] leading-relaxed mb-3">
                      {pendingChallenge.challenge}
                    </p>
                    {pendingChallenge.risk_type && (
                      <p className="text-[11px] text-[var(--text-muted)] mb-3">
                        Risk type:{" "}
                        <span className="text-amber-400/80">
                          {pendingChallenge.risk_type}
                        </span>
                      </p>
                    )}
                    {pendingChallenge.suggestions &&
                    pendingChallenge.suggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {pendingChallenge.suggestions.map((s, i) => {
                          const isProceed =
                            s.toLowerCase().includes("yes") ||
                            s.toLowerCase().includes("proceed") ||
                            s.toLowerCase().includes("help me write");
                          return (
                            <button
                              key={i}
                              onClick={
                                isProceed ? proceedChallenge : dismissChallenge
                              }
                              className={
                                isProceed
                                  ? "px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-all"
                                  : "px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
                              }
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={proceedChallenge}
                          className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-all"
                        >
                          Proceed anyway
                        </button>
                        <button
                          onClick={dismissChallenge}
                          className="px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
                        >
                          Revise message
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Single centralised notification display — all errors, credit alerts, info */}
          <NotificationBanner offsetBottom={84} maxWidth={720} />

          <ChatInput
            onSend={sendMessage}
            onSendFile={sendFile}
            onSendVoice={sendVoice}
            activeMode={activeMode}
            onModeChange={setActiveMode}
            modeLocked={modeLocked}
            pasteValue={pasteValue}
            onPasteConsumed={() => setPasteValue("")}
          />
        </div>
      </div>

      <SessionIntelligencePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        stats={sessionStats}
      />
    </div>
  );
}
