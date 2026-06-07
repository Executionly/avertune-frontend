"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { ChatMessages } from "@/components/app/ChatMessages";
import { ChatInput } from "@/components/app/ChatInput";
import { ChatError } from "@/components/app/ChatError";
import { SessionIntelligencePanel } from "@/components/app/SessionIntelligencePanel";
import { useChat } from "@/lib/hooks/useChat";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AppPage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const handlePasteToInput = (s: string) => setPasteValue(s);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pendingProcessed = useRef(false);

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
    startNewConversation,
    loadConversation,
    restoreLastConversation,
    refreshSidebar,
  } = useChat();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/signin");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (pendingProcessed.current) return;

    const pendingAnalysis = sessionStorage.getItem("pendingAnalysis");
    const pendingMode = sessionStorage.getItem("pendingMode") as any;

    if (pendingAnalysis) {
      pendingProcessed.current = true;
      // Always start fresh conversation for pending analysis from landing pages
      startNewConversation();
      if (pendingMode) setActiveMode(pendingMode);
      sessionStorage.removeItem("pendingAnalysis");
      sessionStorage.removeItem("pendingMode");
      sessionStorage.removeItem("pendingCapability");
      // Small delay to let startNewConversation flush state
      setTimeout(() => sendMessage(pendingAnalysis), 150);
    } else {
      pendingProcessed.current = true;
      restoreLastConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            streamingPhase={streamingPhase}
            detectedCapability={detectedCapability}
            loadingConversation={loadingConversation}
            onSuggestionClick={sendMessage}
            onPasteToInput={handlePasteToInput}
            activeConversationId={threadId}
            activeMode={activeMode}
            onOutcomeResponse={appendMessage}
          />

          {/* Challenge warning */}
          {pendingChallenge && (
            <div className="absolute inset-x-0 bottom-[84px] flex justify-center z-40 px-4">
              <div className="w-full max-w-[720px] bg-[var(--card-bg)] border border-amber-500/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-amber-400">
                      <path d="M8 1.5L14.5 13H1.5L8 1.5z" strokeLinejoin="round" />
                      <path d="M8 6v3.5" strokeLinecap="round" />
                      <circle cx="8" cy="11.5" r=".6" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-amber-400 mb-1">Risk detected</p>
                    <p className="text-[13px] text-[var(--text-primary)] leading-relaxed mb-3">
                      {pendingChallenge.challenge}
                    </p>
                    {pendingChallenge.risk_type && (
                      <p className="text-[11px] text-[var(--text-muted)] mb-3">
                        Risk type: <span className="text-amber-400/80">{pendingChallenge.risk_type}</span>
                      </p>
                    )}
                    {/* Use API-returned suggested_prompts if present, else fallback buttons */}
                    {pendingChallenge.suggestions && pendingChallenge.suggestions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {pendingChallenge.suggestions.map((s, i) => {
                          const isProceed = s.toLowerCase().includes("yes") || s.toLowerCase().includes("proceed") || s.toLowerCase().includes("help me write");
                          return (
                            <button
                              key={i}
                              onClick={isProceed ? proceedChallenge : dismissChallenge}
                              className={isProceed
                                ? "px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20 transition-all"
                                : "px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"}
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

          {/* Global chat error — floats above input, same max-width */}
          {chatError && (
            <div className="absolute inset-x-0 bottom-[84px] z-50 px-4 flex justify-center pointer-events-none">
              <div className="w-full max-w-[720px] pointer-events-auto">
                <ChatError
                  message={chatError}
                  errorCode={chatErrorCode}
                  onDismiss={dismissChatError}
                  onRetry={chatErrorCode && ["CREDIT_DEDUCTION_FAILED","GENERATION_FAILED","PROCESSING_ERROR"].includes(chatErrorCode)
                    ? dismissChatError
                    : undefined}
                />
              </div>
            </div>
          )}

          <ChatInput
            onSend={sendMessage}
            activeMode={activeMode}
            onModeChange={setActiveMode}
            modeLocked={modeLocked}
            pasteValue={pasteValue}
            onPasteConsumed={() => setPasteValue("")}
          />

          {/* Insufficient credits toast */}
          {insufficientCredits && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-violet-500/30 shadow-lg max-w-[360px]">
                <div className="w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 text-violet-500">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 5v3.5" strokeLinecap="round" />
                    <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[13px] text-[var(--text-primary)]">Insufficient credits</p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Top up or upgrade your plan to continue.</p>
                </div>
                <button
                  onClick={dismissCreditsAlert}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
                >
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                    <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
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
