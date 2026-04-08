import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useMySubscription } from "../lib/useSubscription.js";
import { api } from "../lib/apiClient.js";
import { Copy, Check, MessageSquare, Bookmark, Lightbulb } from "lucide-react";
import { useToast } from "../lib/Toast.jsx";
import Sidebar from "./Sidebar.jsx";

// Pack ID to readable label mapping
const PACK_LABELS = {
  general: "General",
  core_professional: "Core Professional",
  personal: "Personal",
  customer_support: "Customer Support",
  work_corporate: "Work / Corporate",
  sales_negotiation: "Sales & Negotiation",
  dating: "Dating",
};

// Tool filters (for pack query param)
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

// Variant colors (same as in ToolPage)
const VARIANT_COLORS = {
  balanced: "var(--green)",
  firm: "var(--teal)",
  warm: "var(--blue)",
  delay: "#a78bfa",
  calm: "var(--blue)",
  improved: "var(--green)",
  concise: "var(--teal)",
  confident: "var(--blue)",
  "original+": "#a78bfa",
  diplomatic: "var(--green)",
  direct: "var(--teal)",
  final: "#ef4444",
  strategic: "var(--green)",
  "hold firm": "var(--teal)",
  counter: "var(--blue)",
  "walk away": "#a78bfa",
  standard: "var(--green)",
  friendly: "var(--teal)",
  urgent: "#f59e0b",
  brief: "var(--blue)",
};

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

// Variant Panel component (same as ToolPage)
function VariantPanel({
  variants,
  replies,
  activeTab,
  setActiveTab,
  recommendedVariant,
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "6px 6px 0",
          background: "var(--surface2)",
          borderBottom: "1px solid var(--border)",
          gap: 3,
          overflowX: "auto",
        }}
      >
        {variants.map((v) => {
          const c = VARIANT_COLORS[v.toLowerCase()] || "var(--green)";
          const isActive = activeTab === v;
          return (
            <button
              key={v}
              onClick={() => setActiveTab(v)}
              style={{
                padding: "9px 16px",
                borderRadius: "9px 9px 0 0",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                border: "none",
                whiteSpace: "nowrap",
                background: isActive ? "var(--surface)" : "transparent",
                color: isActive ? c : "var(--ink-3)",
                borderBottom: isActive
                  ? `2px solid ${c}`
                  : "2px solid transparent",
                transition: "all .15s",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
              {recommendedVariant === v && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: c,
                    background: `${c}18`,
                    border: `1px solid ${c}30`,
                    padding: "1px 6px",
                    borderRadius: 10,
                    lineHeight: 1.4,
                  }}
                >
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>
      {variants
        .filter((v) => v === activeTab)
        .map((v) => {
          const c = VARIANT_COLORS[v.toLowerCase()] || "var(--green)";
          const text = replies?.[v]?.text || replies?.[v] || "";
          const insight = replies?.[v]?.insight || "";
          return (
            <div
              key={v}
              style={{
                padding: "22px 24px",
                animation: "fadeIn 0.2s ease both",
              }}
            >
              {text ? (
                <>
                  <div
                    style={{
                      fontSize: 15.5,
                      color: "var(--ink)",
                      lineHeight: 1.8,
                      marginBottom: 14,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {text}
                  </div>
                  {insight && (
                    <div
                      style={{
                        padding: "10px 14px",
                        background: `${c}0D`,
                        border: `1px solid ${c}25`,
                        borderRadius: 10,
                        marginBottom: 14,
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                      }}
                    >
                      <Lightbulb
                        size={13}
                        style={{ color: c, flexShrink: 0, marginTop: 1 }}
                      />
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--ink-2)",
                          lineHeight: 1.55,
                        }}
                      >
                        {insight}
                      </p>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <CopyBtn text={text} />
                  </div>
                </>
              ) : (
                <p style={{ color: "var(--ink-3)", fontSize: 14 }}>
                  No reply for this variant.
                </p>
              )}
            </div>
          );
        })}
    </div>
  );
}

// Individual saved reply card component (so hooks are stable)
function SavedReplyCard({ item }) {
  const resultJson = item.generations?.result_json || {};
  const repliesObj = resultJson.replies || {};
  const variants = Object.keys(repliesObj);
  const recommendedVariant = resultJson.recommended_reply || variants[0];
  const analysis = resultJson.analysis || {};
  const [activeTab, setActiveTab] = useState(recommendedVariant);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Header with pack and tone */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--green)",
              background: "rgba(34,197,94,0.1)",
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            {PACK_LABELS[item.pack] || item.pack || "General"}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--ink-3)",
            }}
          >
            Tone: {analysis.tone || item.tone || "professional"}
          </span>
          {analysis.risk_level && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color:
                  analysis.risk_level === "high"
                    ? "#ef4444"
                    : analysis.risk_level === "medium"
                      ? "#f59e0b"
                      : "var(--green)",
              }}
            >
              Risk: {analysis.risk_level}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: "var(--ink-4)" }}>
          Saved on {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Variant Panel */}
      <VariantPanel
        variants={variants}
        replies={repliesObj}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recommendedVariant={recommendedVariant}
      />

      {/* Analysis section (strategy) */}
      {analysis.strategy && (
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            background: "rgba(34,197,94,0.03)",
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            Strategy
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {analysis.strategy}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SavedReplies() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: subscription } = useMySubscription();
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toolFilter, setToolFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  }, [user, page, toolFilter]);

  async function fetchReplies() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 20);
      if (toolFilter) params.append("pack", toolFilter);
      const { data } = await api.get(`/generate/replies?${params.toString()}`);
      setReplies(data.saved_replies || []);
      setTotalPages(data.pagination?.total_pages || 1);
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
  if (!canAccess) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <div
          className="container"
          style={{ paddingTop: 80, textAlign: "center" }}
        >
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>
            Upgrade to access saved replies
          </h1>
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
      </div>
    );
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
            zIndex: 50,
            background: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              height: 60,
              gap: 12,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "none",
                color: "var(--ink-2)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              className="mobile-menu-btn"
            >
              <Bookmark size={20} />
            </button>
            <style>{`@media (max-width: 900px) { .mobile-menu-btn { display: flex !important; } .main-content { margin-left: 0 !important; } }`}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg,var(--green),var(--teal))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bookmark size={14} color="#000" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>
                Saved Replies
              </span>
            </div>
          </div>
        </header>

        <div
          className="container"
          style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 1000 }}
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
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Saved Replies
            </h1>
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
          </div>

          {loading ? (
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
              <MessageSquare
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
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                {replies.map((item) => (
                  <SavedReplyCard key={item.id} item={item} />
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
    </div>
  );
}
