import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useMySubscription } from "../lib/useSubscription.js";
import { api } from "../lib/apiClient.js";
import { Copy, Check, Filter, X, Menu, Bookmark } from "lucide-react";
import { useToast } from "../lib/Toast.jsx";
import Sidebar from "./Sidebar.jsx";

const TOOL_FILTERS = [
  { value: "", label: "All tools" },
  { value: "reply_generator", label: "Reply Generator" },
  { value: "tone_checker", label: "Tone Checker" },
  { value: "boundary_builder", label: "Boundary Builder" },
  { value: "negotiation", label: "Sales & Negotiation" },
  { value: "follow_up", label: "Follow-Up" },
  { value: "difficult_email", label: "Difficult Email" },
  { value: "intent_detector", label: "Intent Detector" },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 7,
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border2)"}`,
        background: copied ? "rgba(34,197,94,0.08)" : "transparent",
        color: copied ? "var(--green)" : "var(--ink-3)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all .18s",
        fontFamily: "inherit",
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function SavedReplies() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: subscription } = useMySubscription();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toolFilter, setToolFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");

  const canAccess =
    user &&
    (subscription?.plan_tier === "daily" || subscription?.plan_tier === "pro");

  useEffect(() => {
    if (!user) return;
    if (!canAccess) {
      setLoading(false);
      return;
    }
    fetchReplies();
  }, [user, page, toolFilter, toneFilter]);

  async function fetchReplies() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 20);
      if (toolFilter) params.append("pack", toolFilter);
      if (toneFilter) params.append("tone", toneFilter);
      const { data } = await api.get(`/generate/replies?${params.toString()}`);
      setReplies(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Saved replies are not available on your current plan.");
      } else {
        toast.error("Failed to load saved replies.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className="main-content"
        style={{ flex: 1, marginLeft: 240, minWidth: 0 }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              padding: "0 clamp(16px,3vw,32px)",
              display: "flex",
              alignItems: "center",
              height: 58,
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  color: "var(--ink-2)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "none",
                }}
                className="saved-hamburger"
              >
                <Menu size={21} />
              </button>
              <style>{`@media (max-width: 900px) { .saved-hamburger { display: flex !important; } }`}</style>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--green)",
                  }}
                />
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Saved Replies
                </span>
              </div>
            </div>
          </div>
        </header>

        <div
          style={{
            padding: "clamp(24px,4vw,48px) clamp(16px,4vw,48px)",
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(24px,4vw,32px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Saved Replies
            </h1>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={toolFilter}
                onChange={(e) => {
                  setToolFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border2)",
                  background: "var(--surface2)",
                  color: "var(--ink)",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              >
                {TOOL_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              {toneFilter && (
                <button
                  onClick={() => {
                    setToneFilter("");
                    setPage(1);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--border2)",
                    background: "var(--surface2)",
                    fontSize: 12,
                    color: "var(--ink-3)",
                    cursor: "pointer",
                  }}
                >
                  Clear tone <X size={12} />
                </button>
              )}
            </div>
          </div>

          {!canAccess ? (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                background: "var(--surface)",
                borderRadius: 20,
              }}
            >
              <Bookmark
                size={40}
                color="var(--ink-4)"
                style={{ marginBottom: 16 }}
              />
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>
                Upgrade to access saved replies
              </h3>
              <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>
                Saved replies are available on Daily and Pro plans.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="btn-green"
                style={{ padding: "12px 28px", borderRadius: 12 }}
              >
                View plans
              </button>
            </div>
          ) : loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div className="dot-loader" style={{ justifyContent: "center" }}>
                <span />
                <span />
                <span />
              </div>
              <p style={{ marginTop: 16, color: "var(--ink-3)" }}>
                Loading saved replies...
              </p>
            </div>
          ) : replies.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                background: "var(--surface)",
                borderRadius: 20,
              }}
            >
              <Bookmark
                size={40}
                color="var(--ink-4)"
                style={{ marginBottom: 16 }}
              />
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>
                No saved replies yet
              </h3>
              <p style={{ color: "var(--ink-3)", marginBottom: 24 }}>
                Generate a reply and click "Save" to keep it here.
              </p>
              <button
                onClick={() => navigate("/tool/reply-generator")}
                className="btn-green"
                style={{ padding: "10px 20px", borderRadius: 10 }}
              >
                Generate a reply
              </button>
            </div>
          ) : (
            <>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {replies.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border2)",
                      borderRadius: 16,
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-4)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {item.tool_label || item.tool}
                        </span>
                        {item.variant && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 11,
                              color: "var(--green)",
                            }}
                          >
                            · {item.variant}
                          </span>
                        )}
                      </div>
                      <CopyBtn text={item.reply_text} />
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--ink)",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.reply_text}
                    </p>
                    {item.insight && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: 8,
                          background: "var(--surface2)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--ink-3)",
                        }}
                      >
                        💡 {item.insight}
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 11,
                        color: "var(--ink-4)",
                      }}
                    >
                      Saved on {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 32,
                  }}
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--border2)",
                      background: "transparent",
                      color: "var(--ink-3)",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      opacity: page === 1 ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: "8px 16px", color: "var(--ink)" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--border2)",
                      background: "transparent",
                      color: "var(--ink-3)",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      opacity: page === totalPages ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <style>{`
        @media (max-width: 900px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
