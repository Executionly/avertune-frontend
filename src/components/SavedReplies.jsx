import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useMySubscription } from "../lib/useSubscription.js";
import { api } from "../lib/apiClient.js";
import {
  ArrowLeft,
  Copy,
  Check,
  MessageSquare,
  Filter,
  X,
  Bookmark,
} from "lucide-react";
import { useToast } from "../lib/Toast.jsx";

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
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toolFilter, setToolFilter] = useState("");

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
      // Response structure: { saved_replies: [...], pagination: {...} }
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
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
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
          style={{ display: "flex", alignItems: "center", height: 60, gap: 12 }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "var(--ink-3)",
              fontSize: 13,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg,var(--green),var(--teal))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"
                  stroke="#000"
                  strokeWidth="2.2"
                />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Avertune</span>
          </div>
          <span style={{ fontSize: 13, color: "var(--ink-4)" }}>/</span>
          <span
            style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}
          >
            Saved Replies
          </span>
        </div>
      </header>

      <div
        className="container"
        style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 900 }}
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
            style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {replies.map((item) => {
                const resultJson = item.generations?.result_json;
                const repliesObj = resultJson?.replies || {};
                const recommended = resultJson?.recommended_reply;
                const analysis = resultJson?.analysis || {};

                // Get all reply variants
                const variants = Object.keys(repliesObj);
                // Display the first variant (or recommended if exists)
                const displayVariant =
                  recommended && repliesObj[recommended]
                    ? recommended
                    : variants[0];
                const replyText = repliesObj[displayVariant]?.text || "";
                const replyInsight = repliesObj[displayVariant]?.insight || "";

                return (
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
                          {item.pack || "General"}
                        </span>
                        {analysis.tone && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 11,
                              color: "var(--teal)",
                            }}
                          >
                            · {analysis.tone}
                          </span>
                        )}
                      </div>
                      <CopyBtn text={replyText} />
                    </div>

                    {/* Display all variants as tabs or a dropdown? For simplicity, show the main one + note */}
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--ink)",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                        marginBottom: 12,
                      }}
                    >
                      {replyText}
                    </p>

                    {replyInsight && (
                      <div
                        style={{
                          marginBottom: 12,
                          padding: 8,
                          background: "var(--surface2)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--ink-3)",
                        }}
                      >
                        💡 {replyInsight}
                      </div>
                    )}

                    {analysis.strategy && (
                      <div
                        style={{
                          marginBottom: 12,
                          padding: 8,
                          background: "rgba(34,197,94,0.05)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--ink-2)",
                        }}
                      >
                        🎯 Strategy: {analysis.strategy}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 11,
                        color: "var(--ink-4)",
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        Saved on{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      {variants.length > 0 && (
                        <span>
                          {variants.length} variant
                          {variants.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
    </div>
  );
}
