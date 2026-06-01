"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { AccountModal } from "@/components/ui/AccountModal";
import type { User } from "@/lib/api/auth";
import {
  getConversations,
  deleteConversation,
  archiveConversation,
  type Conversation,
} from "@/lib/api/intelligence";

interface AppSidebarProps {
  user: User;
  onLogout: () => void;
  activeThreadId?: string;
  onSelectThread: (id: string) => void;
  onNewConversation: () => void;
  refreshTrigger?: number;
}

const MODE_BADGE: Record<string, { label: string; className: string }> = {
  professional: { label: "Pro", className: "bg-violet-500/20 text-violet-400" },
  sales: { label: "Sales", className: "bg-amber-400/15  text-amber-400" },
  relationship: { label: "Rel", className: "bg-green-500/15  text-green-400" },
};

const NAV_ITEMS = [
  {
    label: "Intelligence Analytics",
    href: "/app/intelligence",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-4 h-4 flex-shrink-0"
      >
        <path
          d="M2 12l3.5-4 3 3 3-5 2.5 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="1" y="1" width="14" height="14" rx="2" />
      </svg>
    ),
  },
];

function groupByDate(conversations: Conversation[]) {
  const todayStr = new Date().toDateString();
  const yestStr = new Date(Date.now() - 86_400_000).toDateString();
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const older: Conversation[] = [];

  for (const c of conversations) {
    if (c.is_archived) continue;
    const d = new Date(c.created_at).toDateString();
    if (d === todayStr) today.push(c);
    else if (d === yestStr) yesterday.push(c);
    else older.push(c);
  }
  return { today, yesterday, older };
}

// ── Delete confirmation modal ──────────────────────────────────────────────────
function DeleteModal({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-6 max-w-[360px] w-full shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4.5 h-4.5 text-red-400"
          >
            <path
              d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M6 7v4M10 7v4M3 4l1 9.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5L13 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] text-center mb-1">
          Delete conversation?
        </h3>
        <p className="text-[13px] text-[var(--text-muted)] text-center leading-relaxed mb-5">
          "{title}" will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-9 rounded-xl text-[13px] font-medium border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-9 rounded-xl text-[13px] font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({
  user,
  onLogout,
  activeThreadId,
  onSelectThread,
  onNewConversation,
  refreshTrigger = 0,
}: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  const userInitial = user.full_name?.charAt(0).toUpperCase() || "U";

  // ── Fetch conversations ────────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getConversations(token);
      setConversations(data.conversations ?? []);
    } catch (e) {
      console.error("Failed to load conversations:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  useEffect(() => {
    if (activeThreadId || refreshTrigger) fetchConversations();
  }, [activeThreadId, refreshTrigger, fetchConversations]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (conv: Conversation) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteConversation(token, conv.id);
      setConversations((prev) => prev.filter((c) => c.id !== conv.id));
      if (activeThreadId === conv.id) onNewConversation();
    } catch (e) {
      console.error("Failed to delete:", e);
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Archive ────────────────────────────────────────────────────────────────
  const handleArchive = async (conv: Conversation) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await archiveConversation(token, conv.id);
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, is_archived: true } : c)),
      );
      if (activeThreadId === conv.id) onNewConversation();
    } catch (e) {
      console.error("Failed to archive:", e);
    }
  };

  const { today, yesterday, older } = groupByDate(conversations);

  const handleNewConversation = () => {
    onNewConversation();
    setIsMobileOpen(false);
  };

  // ── Sidebar inner content ──────────────────────────────────────────────────
  const sidebarContent = (
    <>
      {/* ── HEADER ── */}
      <div
        className={cn(
          "p-4 pb-3 border-b border-[var(--border-default)] flex-shrink-0",
          isCollapsed && "px-3",
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-2.5",
              isCollapsed && "justify-center",
            )}
          >
            {isCollapsed ? (
              <div className="relative w-8 h-8">
                <div
                  className={cn(
                    "absolute inset-0 transition-all",
                    isSidebarHovered
                      ? "opacity-0 scale-75 pointer-events-none"
                      : "opacity-100",
                  )}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src="/logo-icon.png"
                      alt="Avertune"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCollapsed(false);
                  }}
                  className={cn(
                    "absolute inset-0 w-8 h-8 rounded-lg bg-[var(--card-muted-bg)] flex items-center justify-center transition-all",
                    isSidebarHovered
                      ? "opacity-100"
                      : "opacity-0 scale-75 pointer-events-none",
                  )}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="w-3.5 h-3.5 text-[var(--text-muted)]"
                  >
                    <rect x="1" y="1" width="14" height="14" rx="2" />
                    <line x1="6" y1="1" x2="6" y2="15" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src="./logo-icon.png"
                    alt="Avertune"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">
                  Avertune
                </span>
              </>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex w-7 h-7 rounded-md hover:bg-[var(--card-muted-bg)] items-center justify-center transition-all"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-3.5 h-3.5 text-[var(--text-muted)]"
              >
                <rect x="1" y="1" width="14" height="14" rx="2" />
                <line x1="10" y1="1" x2="10" y2="15" />
              </svg>
            </button>
          )}

          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden w-7 h-7 rounded-md hover:bg-[var(--card-muted-bg)] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-3.5 h-3.5 text-[var(--text-muted)]"
              >
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={handleNewConversation}
          className={cn(
            "flex items-center justify-center gap-1.5 w-full mt-3 h-8 rounded-lg border text-[13px] font-medium transition-all",
            "bg-[var(--accent-bg)] border-[var(--accent-border)] text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
            isCollapsed && "gap-0 px-0",
          )}
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-3.5 h-3.5 flex-shrink-0"
          >
            <path d="M7 2v10M2 7h10" />
          </svg>
          {!isCollapsed && <span>New conversation</span>}
        </button>
      </div>

      {/* ── NAV LINKS ── */}
      <div className="px-2 pb-1 mt-1 flex-shrink-0">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[var(--text-muted)] text-[13px]",
              "hover:bg-[var(--card-muted-bg)] hover:text-[var(--text-primary)] transition-all mb-0.5",
              isCollapsed && "justify-center px-2",
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!isCollapsed && item.label}
          </Link>
        ))}
      </div>

      <div className="mx-3 h-px bg-[var(--border-default)] flex-shrink-0" />

      {/* ── CONVERSATION LIST ── */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto sidebar-scroll px-2 py-2 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
          ) : conversations.filter((c) => !c.is_archived).length === 0 ? (
            <p className="px-2.5 py-6 text-[12px] text-[var(--text-muted)] text-center leading-relaxed">
              No conversations yet.
              <br />
              Start by pasting a message below.
            </p>
          ) : (
            <>
              {today.length > 0 && (
                <ConversationGroup
                  label="Today"
                  conversations={today}
                  activeId={activeThreadId}
                  onSelect={(id) => {
                    onSelectThread(id);
                    setIsMobileOpen(false);
                  }}
                  onDelete={setDeleteTarget}
                  onArchive={handleArchive}
                />
              )}
              {yesterday.length > 0 && (
                <ConversationGroup
                  label="Yesterday"
                  conversations={yesterday}
                  activeId={activeThreadId}
                  onSelect={(id) => {
                    onSelectThread(id);
                    setIsMobileOpen(false);
                  }}
                  onDelete={setDeleteTarget}
                  onArchive={handleArchive}
                />
              )}
              {older.length > 0 && (
                <ConversationGroup
                  label="Older"
                  conversations={older}
                  activeId={activeThreadId}
                  onSelect={(id) => {
                    onSelectThread(id);
                    setIsMobileOpen(false);
                  }}
                  onDelete={setDeleteTarget}
                  onArchive={handleArchive}
                />
              )}
            </>
          )}
        </div>
      )}
      {isCollapsed && <div className="flex-1" />}

      {/* ── FOOTER / USER ── */}
      <div
        onClick={() => setIsAccountModalOpen(true)}
        className={cn(
          "p-3 border-t border-[var(--border-default)] cursor-pointer hover:bg-[var(--card-muted-bg)] transition-all flex-shrink-0",
          isCollapsed && "flex justify-center",
        )}
      >
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                {user.full_name}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] capitalize">
                {user.plan_name} plan
              </p>
            </div>
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0"
            >
              <circle cx="8" cy="3" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="8" cy="13" r="1.2" />
            </svg>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-semibold text-white">
            {userInitial}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-3.5 left-4 z-50 md:hidden w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-muted)] flex items-center justify-center shadow-sm"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="w-4 h-4"
        >
          <path d="M2 4h12M2 8h12M2 12h12" />
        </svg>
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        onMouseEnter={() => isCollapsed && setIsSidebarHovered(true)}
        onMouseLeave={() => isCollapsed && setIsSidebarHovered(false)}
        className={cn(
          "hidden md:flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
          "overflow-hidden transition-all duration-300 z-50 flex-shrink-0 h-screen",
          isCollapsed ? "w-[60px]" : "w-[248px]",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-50 w-[280px] flex flex-col md:hidden",
          "bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
          "overflow-hidden transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {isAccountModalOpen && (
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          user={user}
          onLogout={onLogout}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title || "Untitled"}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ConversationGroup({
  label,
  conversations,
  activeId,
  onSelect,
  onDelete,
  onArchive,
}: {
  label: string;
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (c: Conversation) => void;
  onArchive: (c: Conversation) => void;
}) {
  return (
    <div className="mb-2">
      <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </p>
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          conversation={c}
          active={c.id === activeId}
          onSelect={onSelect}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}

function ConversationItem({
  conversation,
  active,
  onSelect,
  onDelete,
  onArchive,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
  onDelete: (c: Conversation) => void;
  onArchive: (c: Conversation) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all mb-px",
        active
          ? "bg-[var(--card-muted-bg)]"
          : "hover:bg-[var(--card-muted-bg)]",
      )}
    >
      <span
        onClick={() => onSelect(conversation.id)}
        className={cn(
          "flex-1 text-[13px] truncate min-w-0 leading-[1.4]",
          active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]",
        )}
      >
        {conversation.title || "Untitled"}
      </span>

      {/* Context menu button */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className={cn(
            "w-5 h-5 rounded flex items-center justify-center transition-all",
            "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-default)]",
            menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
            <circle cx="2.5" cy="6" r="1.1" />
            <circle cx="6" cy="6" r="1.1" />
            <circle cx="9.5" cy="6" r="1.1" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-6 z-50 w-40 bg-[var(--card-bg)] border border-[var(--border-default)] rounded-xl shadow-lg overflow-hidden py-1">
            {/*<button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onArchive(conversation);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
            >
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="w-3.5 h-3.5"
              >
                <rect x="1" y="4" width="12" height="8" rx="1.5" />
                <path d="M1 4l2-3h8l2 3" strokeLinejoin="round" />
                <path d="M5 8h4" strokeLinecap="round" />
              </svg>
              Archive
            </button>*/}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onDelete(conversation);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-all"
            >
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="w-3.5 h-3.5"
              >
                <path
                  d="M2 4h10M5 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M3 4l.9 7.5a.5.5 0 00.5.5h5.2a.5.5 0 00.5-.5L11 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
