import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useMySubscription } from "../lib/useSubscription.js";
import { api } from "../lib/apiClient.js";
import {
  Copy,
  Check,
  MessageSquare,
  Bookmark,
  Lightbulb,
  Menu,
} from "lucide-react";
import { useToast } from "../lib/Toast.jsx";
import Sidebar from "./Sidebar.jsx";

// Helper to convert snake_case or kebab-case to Title Case
function formatPackName(str) {
  if (!str) return "General";
  // Replace underscores and hyphens with spaces
  const withSpaces = str.replace(/[_-]/g, " ");
  // Capitalize each word
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Explicit mapping for special cases (overrides the formatter)
const PACK_LABELS = {
  general: "General",
  core_professional: "Core Professional",
  personal: "Personal",
  customer_support: "Customer Support",
  work_corporate: "Work / Corporate",
  sales_negotiation: "Sales & Negotiation",
  dating: "Dating",
  reply_generator: "Reply Generator",
  tone_checker: "Tone Checker",
  boundary_builder: "Boundary Builder",
  negotiation: "Sales & Negotiation",
  follow_up: "Follow Up",
  difficult_email: "Difficult Email",
  intent_detector: "Intent Detector",
};

// Tool filters (using formatted labels)
const TOOL_FILTERS = [
  { value: "", label: "All tools" },
  { value: "reply_generator", label: "Reply Generator" },
  { value: "tone_checker", label: "Tone Checker" },
  { value: "boundary_builder", label: "Boundary Builder" },
  { value: "negotiation", label: "Sales & Negotiation" },
  { value: "follow_up", label: "Follow Up" },
  { value: "difficult_email", label: "Difficult Email" },
  { value: "intent_detector", label: "Intent Detector" },
];

// Variant colors
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
  soft: "var(--green)",
  value_reinforcement: "var(--green)",
  calm_pushback: "var(--teal)",
  strategic_positioning: "var(--blue)",
  friendly_reminder: "var(--teal)",
  value_driven: "var(--green)",
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

// Generic Variant Panel for any tool that has a variants object (replies, responses, follow_ups)
function GenericVariantPanel({
  variantsObj,
  activeTab,
  setActiveTab,
  recommendedVariant,
}) {
  const variants = Object.keys(variantsObj);
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
          const displayName = v
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
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
              {displayName}
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
          const data = variantsObj[v];
          const text =
            typeof data === "string" ? data : data?.text || data?.body || "";
          const insight = data?.insight || "";
          const subject = data?.subject || "";
          return (
            <div
              key={v}
              style={{
                padding: "22px 24px",
                animation: "fadeIn 0.2s ease both",
              }}
            >
              {subject && (
                <div
                  style={{
                    marginBottom: 12,
                    padding: "8px 12px",
                    background: "var(--surface2)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--ink-2)",
                  }}
                >
                  Subject: {subject}
                </div>
              )}
              {text && (
                <>
                  <div
                    style={{
                      fontSize: 15.5,
                      color: "var(--ink)",
                      lineHeight: 1.8,
                      marginBottom: insight ? 14 : 0,
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
                </>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <CopyBtn text={text || JSON.stringify(data)} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

// Component for displaying Intent Detector saved results
function IntentDetectorCard({ resultJson }) {
  const copyText = `
Surface meaning: ${resultJson.surface_meaning || "—"}
Primary intent: ${resultJson.primary_intent || "—"}
Emotional tone: ${resultJson.emotional_tone || "—"}
Subtext: ${resultJson.subtext || "—"}
What they want: ${resultJson.what_they_want || "—"}
What they expect next: ${resultJson.what_they_expect_next || "—"}
Strategy: ${resultJson.recommended_response_strategy || "—"}
Confidence: ${Math.round((resultJson.confidence || 0) * 100)}%
Trust signal: ${resultJson.trust_signal || "—"}
  `.trim();

  return (
    <div style={{ padding: "20px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 20px",
          marginBottom: 20,
        }}
      >
        {resultJson.surface_meaning && (
          <div style={{ gridColumn: "span 2" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Surface meaning
            </p>
            <p style={{ fontSize: 14, color: "var(--ink)" }}>
              {resultJson.surface_meaning}
            </p>
          </div>
        )}
        {resultJson.primary_intent && (
          <div>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Primary intent
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--teal)" }}>
              {resultJson.primary_intent}
            </p>
          </div>
        )}
        {resultJson.emotional_tone && (
          <div>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Emotional tone
            </p>
            <p style={{ fontSize: 14, color: "var(--ink)" }}>
              {resultJson.emotional_tone}
            </p>
          </div>
        )}
        {resultJson.subtext && (
          <div style={{ gridColumn: "span 2" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Subtext
            </p>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
              {resultJson.subtext}
            </p>
          </div>
        )}
        {resultJson.what_they_want && (
          <div>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              What they want
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
              {resultJson.what_they_want}
            </p>
          </div>
        )}
        {resultJson.what_they_expect_next && (
          <div>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              What they expect next
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
              {resultJson.what_they_expect_next}
            </p>
          </div>
        )}
        {resultJson.risk_indicators &&
          resultJson.risk_indicators.length > 0 && (
            <div style={{ gridColumn: "span 2" }}>
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Risk indicators
              </p>
              <ul
                style={{ marginLeft: 20, color: "var(--ink-2)", fontSize: 13 }}
              >
                {resultJson.risk_indicators.map((ind, i) => (
                  <li key={i}>{ind}</li>
                ))}
              </ul>
            </div>
          )}
        {resultJson.recommended_response_strategy && (
          <div
            style={{
              gridColumn: "span 2",
              marginTop: 8,
              padding: "10px 14px",
              background: "rgba(34,197,94,0.05)",
              borderRadius: 10,
            }}
          >
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--green)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Recommended response strategy
            </p>
            <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
              {resultJson.recommended_response_strategy}
            </p>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 8,
        }}
      >
        <CopyBtn text={copyText} />
      </div>
    </div>
  );
}

// Component for displaying Tone Checker saved results
function ToneCheckerCard({ resultJson }) {
  const copyText = `
Tone: ${resultJson.primary_tone || "—"}
Secondary signals: ${(resultJson.secondary_signals || []).join(", ")}
Emotional intensity: ${resultJson.emotional_intensity || "—"}
Risk level: ${resultJson.risk_level || "—"}
Interpretation: ${resultJson.interpretation || "—"}
  `.trim();

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          Detected tone
        </p>
        <p
          style={{
            fontSize: "clamp(24px,3vw,28px)",
            fontWeight: 800,
            color: "var(--green)",
            marginBottom: 8,
          }}
        >
          {resultJson.primary_tone || "—"}
        </p>
      </div>
      {resultJson.secondary_signals &&
        resultJson.secondary_signals.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Secondary signals
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {resultJson.secondary_signals.map((signal) => (
                <span
                  key={signal}
                  style={{
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: "var(--surface2)",
                    fontSize: 12,
                  }}
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        )}
      {resultJson.emotional_intensity && (
        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Emotional intensity
          </p>
          <p style={{ fontSize: 13, color: "var(--ink)" }}>
            {resultJson.emotional_intensity}
          </p>
        </div>
      )}
      {resultJson.risk_level && (
        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Risk level
          </p>
          <p
            style={{
              fontSize: 13,
              color:
                resultJson.risk_level === "High"
                  ? "#ef4444"
                  : resultJson.risk_level === "Medium"
                    ? "#f59e0b"
                    : "var(--green)",
            }}
          >
            {resultJson.risk_level}
          </p>
        </div>
      )}
      {resultJson.interpretation && (
        <div style={{ marginBottom: 16 }}>
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Interpretation
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {resultJson.interpretation}
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
        <CopyBtn text={copyText} />
      </div>
    </div>
  );
}

// Component for displaying Analysis-only tools (boundary builder, negotiation insight)
function AnalysisCard({ resultJson, situationRead, insight }) {
  const copyText = `
Situation: ${situationRead || "—"}
${insight ? `Insight: ${insight}` : ""}
${resultJson.strategy ? `Strategy: ${resultJson.strategy}` : ""}
${resultJson.power_note ? `Power note: ${resultJson.power_note}` : ""}
  `.trim();

  return (
    <div style={{ padding: "20px 24px" }}>
      {situationRead && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            background: "rgba(34,197,94,0.05)",
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--green)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Situation
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {situationRead}
          </p>
        </div>
      )}
      {insight && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            background: "rgba(45,212,191,0.05)",
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--teal)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Insight
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {insight}
          </p>
        </div>
      )}
      {resultJson.strategy && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            background: "rgba(167,139,250,0.05)",
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#a78bfa",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Strategy
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {resultJson.strategy}
          </p>
        </div>
      )}
      {resultJson.power_note && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            background: "rgba(34,197,94,0.03)",
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--green)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Power note
          </p>
          <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
            {resultJson.power_note}
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
        <CopyBtn text={copyText} />
      </div>
    </div>
  );
}

// Individual saved reply card component
function SavedReplyCard({ item }) {
  const resultJson = item.generations?.result_json || {};
  const pack = item.pack || "general";
  // Use mapping or fallback to formatted name
  const toolLabel = PACK_LABELS[pack] || formatPackName(pack);
  const [activeTab, setActiveTab] = useState(null);

  let renderMode = "unknown";
  let variantsObj = null;
  let recommendedVariant = null;
  let situationRead = null;
  let insight = null;

  // Check for reply generators (replies object)
  if (
    resultJson.replies &&
    typeof resultJson.replies === "object" &&
    Object.keys(resultJson.replies).length > 0
  ) {
    renderMode = "variants";
    variantsObj = resultJson.replies;
    recommendedVariant =
      resultJson.recommended_reply ||
      resultJson.recommended ||
      Object.keys(variantsObj)[0];
    if (!activeTab && recommendedVariant) setActiveTab(recommendedVariant);
  }
  // Check for boundary builder (responses object)
  else if (
    resultJson.responses &&
    typeof resultJson.responses === "object" &&
    Object.keys(resultJson.responses).length > 0
  ) {
    renderMode = "variants";
    variantsObj = resultJson.responses;
    recommendedVariant = resultJson.recommended || Object.keys(variantsObj)[0];
    situationRead = resultJson.situation_read;
    if (!activeTab && recommendedVariant) setActiveTab(recommendedVariant);
  }
  // Check for follow-up writer (follow_ups object)
  else if (
    resultJson.follow_ups &&
    typeof resultJson.follow_ups === "object" &&
    Object.keys(resultJson.follow_ups).length > 0
  ) {
    renderMode = "variants";
    variantsObj = resultJson.follow_ups;
    recommendedVariant = resultJson.recommended || Object.keys(variantsObj)[0];
    if (!activeTab && recommendedVariant) setActiveTab(recommendedVariant);
  }
  // Check for tone checker
  else if (resultJson.primary_tone) {
    renderMode = "tone_checker";
  }
  // Check for intent detector
  else if (resultJson.primary_intent || resultJson.surface_meaning) {
    renderMode = "intent_detector";
  }
  // Fallback: analysis card (situation_read, insight, strategy)
  else if (
    resultJson.situation_read ||
    resultJson.insight ||
    resultJson.strategy
  ) {
    renderMode = "analysis";
    situationRead = resultJson.situation_read;
    insight = resultJson.insight;
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Header with pack and tone (only show tone if not null) */}
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
            {toolLabel}
          </span>
          {item.tone && item.tone !== null && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink-3)",
              }}
            >
              Tone: {item.tone}
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: "var(--ink-4)" }}>
          Saved on {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Content based on tool type */}
      {renderMode === "variants" && variantsObj && (
        <GenericVariantPanel
          variantsObj={variantsObj}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          recommendedVariant={recommendedVariant}
        />
      )}
      {renderMode === "intent_detector" && (
        <IntentDetectorCard resultJson={resultJson} />
      )}
      {renderMode === "tone_checker" && (
        <ToneCheckerCard resultJson={resultJson} />
      )}
      {renderMode === "analysis" && (
        <AnalysisCard
          resultJson={resultJson}
          situationRead={situationRead}
          insight={insight}
        />
      )}
      {renderMode === "unknown" && (
        <div
          style={{
            padding: "20px 24px",
            color: "var(--ink-3)",
            textAlign: "center",
          }}
        >
          <p>Unable to display this saved item.</p>
          <CopyBtn text={JSON.stringify(resultJson, null, 2)} />
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
              <Menu size={21} />
            </button>
            <style>{`
              @media (max-width: 900px) {
                .mobile-menu-btn { display: flex !important; }
                .main-content { margin-left: 0 !important; }
              }
            `}</style>
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
