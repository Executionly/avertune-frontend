import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Zap,
  Copy,
  Check,
  ChevronDown,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Shield,
  Share2,
  Twitter,
  Linkedin,
  MessageCircle,
  X,
  Download,
  MessageSquare,
  Activity,
  ShieldCheck,
  Swords,
  Clock,
  Home,
  LogOut,
  Menu,
  Bookmark,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { generateApi } from "../lib/generateApi.js";
import { api } from "../lib/apiClient.js";
import { PACKS } from "../lib/packData.js";
import { useToast } from "../lib/Toast.jsx";
import Sidebar from "./Sidebar.jsx";
import { useMySubscription } from "../lib/useSubscription";

/* ─────────────────────────────── Custom Select ─────────────────────────── */
function formatOptionLabel(str) {
  if (!str) return "";

  // Special case mappings
  const specialCases = {
    boss_manager: "Boss/Manager",
    partner_spouse: "Partner/Spouse",
    colleague: "Colleague",
    direct_report: "Direct Report",
    client: "Client",
    friend: "Friend",
    stranger: "Stranger",
    acquaintance: "Acquaintance",
    // Follow-up duration special cases
    "1_2_days": "1-2 days",
    "3_5_days": "3-5 days",
    "1_week": "1 week",
    "2_weeks": "2 weeks",
    "1_month": "1 month",
    longer_than_month: "Longer than a month",
    // Relationship stakes
    high: "High",
    medium: "Medium",
    low: "Low",
    // Said before
    first_time: "First time",
    said_once_before: "Said once before",
    said_multiple_times: "Said multiple times",
    // Negotiation context
    salary_negotiation: "Salary negotiation",
    pricing_vendor_deal: "Pricing / vendor deal",
    contract_terms: "Contract terms",
    raise_request: "Raise request",
    partnership_deal: "Partnership deal",
    freelance_rate: "Freelance rate",
    other: "Other",
    // Leverage
    strong: "Strong",
    moderate: "Moderate",
    weak: "Weak",
    unknown: "Unknown",
    // Style
    collaborative: "Collaborative",
    competitive: "Competitive",
    principled: "Principled",
    relationship_first: "Relationship first",
    // Follow-up type
    job_application: "Job application",
    sales_proposal: "Sales proposal",
    invoice_payment: "Invoice payment",
    meeting_request: "Meeting request",
    project_update: "Project update",
    personal_relationship: "Personal relationship",
    // Follow-up number
    first_follow_up: "First follow-up",
    second_follow_up: "Second follow-up",
    third_final_follow_up: "Third / final follow-up",
    checking_in_after_meeting: "Checking in after meeting",
    // Preferred tone
    friendly_casual: "Friendly casual",
    professional: "Professional",
    urgent_but_respectful: "Urgent but respectful",
    brief_and_direct: "Brief and direct",
    // Medium
    email: "Email",
    sms: "SMS",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    slack: "Slack",
    in_person: "In person",
    twitter: "Twitter",
    instagram: "Instagram",
    facebook: "Facebook",
    text_message: "Text message",
    social_media: "Social media",
    // Channel for intent detector
    text_message: "Text message",
    // Relationship for boundary builder
    boss: "Boss",
    family: "Family",
    // Situation types
    giving_bad_news: "Giving bad news",
    declining_request: "Declining request",
    addressing_conflict: "Addressing conflict",
    raising_concern: "Raising concern",
    apologising: "Apologising",
    pushing_back: "Pushing back",
    ending_relationship: "Ending relationship",
    requesting_something: "Requesting something",
    // Sensitivity
    low: "Low",
    medium: "Medium",
    high: "High",
    // Tension history
    no_history: "No history",
    minor_tension: "Minor tension",
    ongoing_conflict: "Ongoing conflict",
    recent_argument: "Recent argument",
    reconciling: "Reconciling",
    // Preferred length
    very_short: "Very short",
    short: "Short",
    medium: "Medium",
    long: "Long",
    // Tone preference
    professional: "Professional",
    friendly: "Friendly",
    direct: "Direct",
    empathetic: "Empathetic",
    formal: "Formal",
    // Goal
    "De-escalate and set a clear timeline":
      "De-escalate and set a clear timeline",
    "Assert my position": "Assert my position",
    "Build rapport": "Build rapport",
    "Set a boundary": "Set a boundary",
    "Request more time": "Request more time",
    "Decline gracefully": "Decline gracefully",
    "Escalate urgency": "Escalate urgency",
    "Close the conversation": "Close the conversation",
  };

  if (specialCases[str]) return specialCases[str];

  // Default: split by underscore, capitalize each word
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function CustomSelect({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const selected = value || "";

  useEffect(() => {
    const h = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && (
        <p
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: "var(--ink-3)",
            marginBottom: 7,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 12,
          border: `1.5px solid ${open ? "var(--green)" : "var(--border2)"}`,
          background: "var(--surface2)",
          color: "var(--ink)",
          fontSize: 14,
          fontFamily: "inherit",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
          transition: "border-color .2s, box-shadow .2s",
          boxShadow: open ? "0 0 0 3px rgba(34,197,94,0.08)" : "none",
        }}
      >
        <span
          style={{
            color: selected ? "var(--ink)" : "var(--ink-4)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selected ? formatOptionLabel(selected) : placeholder || "Select…"}
        </span>
        <ChevronDown
          size={14}
          color="var(--ink-3)"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .2s",
            flexShrink: 0,
            marginLeft: 8,
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "var(--surface)",
            border: "1.5px solid var(--border2)",
            borderRadius: 12,
            padding: 5,
            boxShadow: "0 16px 48px rgba(0,0,0,0.28)",
            animation: "slideDown 0.18s ease both",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(selected && opt === selected ? "" : opt);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background:
                  selected && opt === selected
                    ? "var(--surface2)"
                    : "transparent",
                color:
                  selected && opt === selected ? "var(--green)" : "var(--ink)",
                fontSize: 13.5,
                fontFamily: "inherit",
                fontWeight: opt === selected ? 600 : 400,
                textAlign: "left",
                cursor: "pointer",
                border: "none",
                transition: "background .12s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                if (opt !== selected)
                  e.currentTarget.style.background = "var(--surface2)";
              }}
              onMouseLeave={(e) => {
                if (opt !== selected)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {formatOptionLabel(opt)}
              {selected && opt === selected && (
                <Check size={12} color="var(--green)" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────── Copy button ─────────────────────────── */
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
        padding: "7px 14px",
        borderRadius: 9,
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border2)"}`,
        background: copied ? "rgba(34,197,94,0.08)" : "transparent",
        color: copied ? "var(--green)" : "var(--ink-3)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all .18s",
        fontFamily: "inherit",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ─────────────────────────────── Chips Field ─────────────────────────── */
function ChipsField({ field, value, onChange }) {
  const [selected, setSelected] = useState(new Set());
  const maxSelect = field.maxSelect || Infinity;
  const atLimit = selected.size >= maxSelect;

  useEffect(() => {
    if (!value) {
      setSelected(new Set());
    }
  }, [value]);

  function toggleChip(chip) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(chip)) {
        next.delete(chip);
      } else {
        if (next.size >= maxSelect) return prev;
        next.add(chip);
      }
      onChange([...next].join(", "));
      return next;
    });
  }

  function clearAll() {
    setSelected(new Set());
    onChange("");
  }

  return (
    <div style={{ marginBottom: "clamp(14px,2vw,20px)" }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border2)",
          borderRadius: 16,
          overflow: "hidden",
          transition: "border-color .2s",
        }}
      >
        <div
          style={{
            padding: "12px 18px 10px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}
          >
            {field.label}
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: "var(--ink-4)",
              background: "var(--surface2)",
              padding: "1px 7px",
              borderRadius: 4,
            }}
          >
            {field.maxSelect
              ? `pick up to ${field.maxSelect}`
              : "optional · pick any"}
          </span>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                marginLeft: "auto",
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--ink-3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--ink-3)")
              }
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>

        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {field.chips.map((chip) => {
              const active = selected.has(chip);
              const dimmed = atLimit && !active;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  disabled={dimmed}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    cursor: dimmed ? "not-allowed" : "pointer",
                    border: `1.5px solid ${active ? "var(--green)" : "var(--border2)"}`,
                    background: active
                      ? "rgba(34,197,94,0.1)"
                      : "var(--surface2)",
                    color: active ? "var(--green)" : "var(--ink-2)",
                    opacity: dimmed ? 0.3 : 1,
                    transition: "all .15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {active && <Check size={10} />}
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Pack Modal ───────────────────────────── */
function PackModal({ value, onChange, onClose, userPlan, availablePacks }) {
  const navigate = useNavigate();

  const packIdMap = {
    personal: "personal",
    customer_support: "customer_support",
    work_corporate: "work",
    sales_negotiation: "sales",
    dating: "dating",
    core_professional: "core_professional",
  };

  const ownedPackIds = (availablePacks || [])
    .map((apiId) => packIdMap[apiId])
    .filter(Boolean);

  const [activePack, setActivePack] = useState(
    value?.packId
      ? PACKS.find((p) => p.id === value.packId) || PACKS[0]
      : PACKS[0],
  );
  const [selected, setSelected] = useState(value || null);
  const isPro =
    userPlan &&
    userPlan.toLowerCase() !== "free" &&
    userPlan.toLowerCase() !== "trial";

  const isPackOwned = ownedPackIds.includes(activePack.id);

  function selectScenario(pack, scenario) {
    if (!isPackOwned) return;
    if (scenario.pro && !isPro) return;
    const next = {
      packId: pack.id,
      packLabel: pack.label,
      scenarioId: scenario.id,
      scenarioLabel: scenario.label,
    };
    setSelected(next);
  }

  function apply() {
    onChange(selected);
    onClose();
  }

  function clear() {
    onChange(null);
    onClose();
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 600,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.18s ease both",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
          borderRadius: 24,
          width: "100%",
          maxWidth: 760,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) both",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                marginBottom: 2,
              }}
            >
              Context Pack
            </h2>
            <p style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
              Pick a pack then choose your scenario
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              color: "var(--ink-3)",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              cursor: "pointer",
              padding: 7,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div
          className="pack-modal-body"
          style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          <style>{`
            @media (max-width: 560px) {
              .pack-modal-body { flex-direction: column !important; }
              .pack-modal-left { width: 100% !important; borderRight: none !important; borderBottom: 1px solid var(--border) !important; flexDirection: row !important; flexWrap: wrap !important; overflowX: auto !important; overflowY: visible !important; padding: 8px !important; gap: 6px !important; maxHeight: 110px !important; }
              .pack-modal-right { flex: 1 !important; minHeight: 200px !important; }
            }
          `}</style>

          <div
            className="pack-modal-left"
            style={{
              width: 190,
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
              overflowY: "auto",
              padding: "10px 8px",
            }}
          >
            {PACKS.map((pack) => {
              const isActive = activePack?.id === pack.id;
              const packOwned = ownedPackIds.includes(pack.id);
              return (
                <button
                  key={pack.id}
                  onClick={() => setActivePack(pack)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 11,
                    marginBottom: 2,
                    background: isActive ? pack.bg : "transparent",
                    border: `1px solid ${isActive ? pack.border : "transparent"}`,
                    color: isActive ? pack.color : "var(--ink-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "inherit",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all .15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--surface2)";
                      e.currentTarget.style.color = "var(--ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--ink-2)";
                    }
                  }}
                >
                  <span style={{ lineHeight: 1.3 }}>{pack.label}</span>
                  {isActive && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: pack.color,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {!packOwned && (
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: "#f59e0b",
                        background: "rgba(245,158,11,0.12)",
                        padding: "1px 5px",
                        borderRadius: 4,
                        marginLeft: 6,
                      }}
                    >
                      PREMIUM
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            className="pack-modal-right"
            style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}
          >
            {activePack && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 14,
                    padding: "10px 14px",
                    background: activePack.bg,
                    border: `1px solid ${activePack.border}`,
                    borderRadius: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: activePack.color,
                      }}
                    >
                      {activePack.label}
                    </p>
                    <p
                      style={{
                        fontSize: 11.5,
                        color: "var(--ink-3)",
                        marginTop: 1,
                      }}
                    >
                      {activePack.scenarios.length} scenarios
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {activePack.scenarios.map((scenario) => {
                    const isSelected =
                      selected?.packId === activePack.id &&
                      selected?.scenarioId === scenario.id;
                    const locked = !isPackOwned || (scenario.pro && !isPro);
                    return (
                      <button
                        key={scenario.id}
                        onClick={() =>
                          !locked && selectScenario(activePack, scenario)
                        }
                        style={{
                          padding: "8px 14px",
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: isSelected ? 700 : 500,
                          fontFamily: "inherit",
                          cursor: locked ? "not-allowed" : "pointer",
                          border: `1.5px solid ${isSelected ? activePack.color : "var(--border2)"}`,
                          background: isSelected
                            ? activePack.bg
                            : "var(--surface2)",
                          color: locked
                            ? "var(--ink-4)"
                            : isSelected
                              ? activePack.color
                              : "var(--ink-2)",
                          transition: "all .15s",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {isSelected && <Check size={11} />}
                        {scenario.label}
                      </button>
                    );
                  })}
                </div>
                {!isPackOwned && (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="btn-green"
                    style={{
                      marginTop: 16,
                      width: "100%",
                      padding: "10px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Upgrade to unlock this pack →
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "var(--surface2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              minWidth: 0,
            }}
          >
            {selected ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "var(--surface)",
                  border: "1px solid var(--border2)",
                  borderRadius: 20,
                  maxWidth: 300,
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selected.packLabel} · {selected.scenarioLabel}
                </span>
              </div>
            ) : (
              <p style={{ fontSize: 12.5, color: "var(--ink-4)" }}>
                No scenario selected
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {value && (
              <button
                onClick={clear}
                style={{
                  padding: "9px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border2)",
                  background: "transparent",
                  color: "var(--ink-3)",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ink-3)";
                  e.currentTarget.style.borderColor = "var(--border2)";
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={apply}
              disabled={!selected}
              className="btn-green"
              style={{
                padding: "9px 22px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                opacity: selected ? 1 : 0.4,
                cursor: selected ? "pointer" : "not-allowed",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Share Modal ─────────────────────────── */
function ShareModal({
  result,
  tool,
  activeVariant,
  onClose,
  subscription,
  promptText,
}) {
  const cardRef = useRef();
  const [downloading, setDownloading] = useState(false);
  const [includePrompt, setIncludePrompt] = useState(true);
  const showWatermark =
    subscription?.features?.share_receipt_watermark === true;

  const replyText =
    result?.replies?.[activeVariant] || result?.recommended_approach || "";
  let fullReply = replyText;
  let displayLabel = activeVariant;

  // Handle tone checker and intent detector
  if (!fullReply && tool?.id === "tone-checker") {
    fullReply = `<strong>Tone:</strong> ${result?.primary_tone || "—"}\n<strong>Risk:</strong> ${result?.risk_level || "—"}\n<strong>Interpretation:</strong> ${result?.interpretation || "—"}`;
    displayLabel = "Analysis";
  } else if (!fullReply && tool?.id === "intent-detector") {
    fullReply = `<strong>Primary intent:</strong> ${result?.primary_intent || "—"}\n<strong>Surface meaning:</strong> ${result?.surface_meaning || "—"}\n<strong>Subtext:</strong> ${result?.subtext || "—"}\n<strong>Strategy:</strong> ${result?.recommended_response_strategy || "—"}`;
    displayLabel = "Analysis";
  }

  const shareQuote = `Reply via Avertune:\n\n${includePrompt && promptText ? `Original message:\n"${promptText}"\n\n` : ""} ${displayLabel} reply:\n"${fullReply.replace(/<[^>]*>/g, "")}"\n\n🔗 avertune.com`;

  const platforms = [
    {
      label: "X / Twitter",
      bg: "#000",
      color: "#fff",
      icon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622z" />
        </svg>
      ),
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareQuote)}`,
          "_blank",
        ),
    },
    {
      label: "LinkedIn",
      bg: "#0A66C2",
      color: "#fff",
      icon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
        </svg>
      ),
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareQuote)}`,
          "_blank",
        ),
    },
    {
      label: "WhatsApp",
      bg: "#25D366",
      color: "#fff",
      icon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareQuote)}`,
          "_blank",
        ),
    },
  ];

  async function downloadCard() {
    setDownloading(true);
    try {
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const cardElement = cardRef.current;
      const originalOverflow = cardElement.style.overflow;
      cardElement.style.overflow = "visible";
      const canvas = await window.html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        windowWidth: cardElement.scrollWidth,
        windowHeight: cardElement.scrollHeight,
      });
      cardElement.style.overflow = originalOverflow;
      const link = document.createElement("a");
      link.download = `avertune-${tool.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  }

  const varColor = "#22c55e";

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
          borderRadius: 24,
          padding: "clamp(22px,3vw,32px)",
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Sticky close button */}
        <button
          onClick={onClose}
          style={{
            position: "sticky",
            top: 0,
            alignSelf: "flex-end",
            color: "var(--ink-3)",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: 9,
            cursor: "pointer",
            padding: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            zIndex: 10,
          }}
        >
          <X size={17} />
        </button>

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            marginBottom: 14,
            flexShrink: 0,
          }}
        >
          Your insight card
        </p>

        {/* Toggle for including prompt */}
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <label
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <input
              type="checkbox"
              checked={includePrompt}
              onChange={(e) => setIncludePrompt(e.target.checked)}
            />
            Include original message
          </label>
          {includePrompt && (
            <span style={{ fontSize: 10, color: "#f59e0b" }}>
              (Sensitive? Uncheck to hide)
            </span>
          )}
        </div>

        {/* Scrollable container for the insight card */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: 16,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          <div
            ref={cardRef}
            style={{
              borderRadius: 18,
              background:
                "linear-gradient(135deg, #09090B 0%, #0F1A12 50%, #091211 100%)",
              padding: "clamp(20px,3vw,28px)",
              position: "relative",
              overflow: "visible",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            {/* Watermark at the top */}
            {showWatermark && (
              <div
                style={{
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <div>
                  <img
                    src="./logo.png"
                    alt="avertune logo"
                    width={100}
                    height={100}
                  />
                </div>

                <span style={{ fontSize: 10, color: "#3F3F46" }}>·</span>
                <span style={{ fontSize: 10, color: "#71717A" }}>
                  avertune.com
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 14,
                    letterSpacing: "-0.03em",
                    color: "#F4F4F6",
                  }}
                >
                  {tool?.label || ""}
                </span>
              </div>
              <div
                style={{
                  padding: "3px 10px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: varColor,
                    letterSpacing: "0.04em",
                  }}
                >
                  {displayLabel}
                </span>
              </div>
            </div>

            {includePrompt && promptText && (
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(56,189,248,0.07)",
                  border: "1px solid rgba(56,189,248,0.15)",
                  borderRadius: 10,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#38bdf8",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    marginBottom: 5,
                  }}
                >
                  Original message
                </p>
                <p
                  style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.55 }}
                >
                  "{promptText}"
                </p>
              </div>
            )}

            {fullReply && (
              <div
                style={{
                  padding: "12px 14px",
                  background: `${varColor}0D`,
                  border: `1px solid ${varColor}28`,
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: varColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    marginBottom: 6,
                  }}
                >
                  {displayLabel} reply
                </p>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#F4F4F6",
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{ __html: `"${fullReply}"` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Download button */}
        <div
          style={{ display: "flex", gap: 8, marginBottom: 16, flexShrink: 0 }}
        >
          <button
            onClick={downloadCard}
            disabled={downloading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: "1px solid var(--border2)",
              background: "transparent",
              color: "var(--ink-2)",
              fontWeight: 600,
              fontSize: 13,
              cursor: downloading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all .2s",
              opacity: downloading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                e.currentTarget.style.borderColor = "var(--teal)";
                e.currentTarget.style.color = "var(--teal)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border2)";
              e.currentTarget.style.color = "var(--ink-2)";
            }}
          >
            <Download size={13} /> {downloading ? "Saving…" : "Download"}
          </button>
        </div>

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
            flexShrink: 0,
          }}
        >
          Share on
        </p>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {platforms.map((p) => (
            <button
              key={p.label}
              onClick={p.action}
              style={{
                flex: 1,
                padding: "11px 8px",
                borderRadius: 11,
                background: p.bg,
                color: p.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                transition: "opacity .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <p.icon /> {p.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
/* ─────────────────────────────── Variant tabs ─────────────────────────── */
const VARIANT_COLORS = {
  Balanced: "var(--green)",
  Firm: "var(--teal)",
  Warm: "var(--blue)",
  Delay: "#a78bfa",
  Improved: "var(--green)",
  Concise: "var(--teal)",
  Confident: "var(--blue)",
  "Original+": "#a78bfa",
  Diplomatic: "var(--green)",
  Direct: "var(--teal)",
  Final: "#ef4444",
  Strategic: "var(--green)",
  "Hold Firm": "var(--teal)",
  Counter: "var(--blue)",
  "Walk Away": "#a78bfa",
  Standard: "var(--green)",
  Friendly: "var(--teal)",
  Urgent: "#f59e0b",
  Brief: "var(--blue)",
};

/* ── FIX 4: savingVariant prop added so the button shows a spinner while saving ── */
function VariantPanel({
  variants,
  replies,
  activeTab,
  setActiveTab,
  onShare,
  onSave,
  isSaved,
  savingVariant,
  insights,
  descriptors,
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
          const c = VARIANT_COLORS[v] || "var(--green)";
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
              {v}
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
          const c = VARIANT_COLORS[v] || "var(--green)";
          const text = replies?.[v];
          const isSaving = savingVariant === v;
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
                  {descriptors?.[v] && (
                    <p
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "var(--ink-3)",
                        marginBottom: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: c,
                          flexShrink: 0,
                        }}
                      />{" "}
                      {descriptors[v]}
                    </p>
                  )}
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
                  {insights?.[v] && (
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
                        {insights[v]}
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
                    {onSave && (
                      <button
                        onClick={() => !isSaved && !isSaving && onSave(v)}
                        disabled={isSaved || isSaving}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 14px",
                          borderRadius: 9,
                          border: `1px solid ${isSaved ? "rgba(34,197,94,0.3)" : "var(--border2)"}`,
                          background: isSaved
                            ? "rgba(34,197,94,0.08)"
                            : "transparent",
                          color: isSaved ? "var(--green)" : "var(--ink-3)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: isSaved || isSaving ? "default" : "pointer",
                          transition: "all .15s",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSaved && !isSaving) {
                            e.currentTarget.style.borderColor = "var(--green)";
                            e.currentTarget.style.color = "var(--green)";
                            e.currentTarget.style.background =
                              "rgba(34,197,94,0.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSaved && !isSaving) {
                            e.currentTarget.style.borderColor =
                              "var(--border2)";
                            e.currentTarget.style.color = "var(--ink-3)";
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        {isSaving ? (
                          <>
                            <Loader2
                              size={12}
                              style={{
                                animation: "spin .7s linear infinite",
                              }}
                            />
                            Saving…
                          </>
                        ) : isSaved ? (
                          <>
                            <BookmarkCheck size={12} />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark size={12} />
                            Save
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={onShare}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "7px 14px",
                        borderRadius: 9,
                        border: "1px solid var(--border2)",
                        background: "transparent",
                        color: "var(--ink-3)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all .15s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--green)";
                        e.currentTarget.style.color = "var(--green)";
                        e.currentTarget.style.background =
                          "rgba(34,197,94,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border2)";
                        e.currentTarget.style.color = "var(--ink-3)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Share2 size={12} /> Share
                    </button>
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

/* ═══════════════════════════════════════════════════════════════════════
   MAIN TOOL PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function ToolPage({ tool, onBack, onLogin, onTool }) {
  const { user, authLoading } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const availablePacks = subscription?.features?.available_packs || [];

  const planTier = user?.plan_tier || "free";
  const [fields, setFields] = useState({});

  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(tool.outputVariants?.[0] || "");
  const [showShare, setShowShare] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savingVariant, setSavingVariant] = useState(null);
  const [savedVariants, setSavedVariants] = useState(new Set());

  const allTextareas = tool.fields.filter((f) => f.type === "textarea");
  const firstRequiredTextarea = allTextareas.find((f) => f.required);
  const otherTextareas = allTextareas.filter(
    (f) => f !== firstRequiredTextarea,
  );
  const allOptionFields = tool.fields.filter((f) => f.type !== "textarea");
  const optionFields =
    tool.id === "intent-detector"
      ? allOptionFields.filter((f) => f.id !== "pack_scenario")
      : allOptionFields;
  const charLimit = subscription?.character_limits?.[tool.limitKey] || 2000;
  const mainText = fields[firstRequiredTextarea?.id] || "";
  const charCount = mainText.length;

  const canSave =
    user &&
    (planTier === "daily" || planTier === "pro") &&
    phase === "done" &&
    result?._generationId;

  useEffect(() => {
    setFields({});
    setResult(null);
    setPhase("idle");
    setErrorMessage("");
    setActiveTab(tool.outputVariants?.[0] || "");
    setShowShare(false);
    setShowPackModal(false);
    setSavedVariants(new Set());
  }, [tool.id]);

  useEffect(() => {
    const pendingMessage = sessionStorage.getItem("pendingMessage");
    if (pendingMessage && tool.id === "reply-generator") {
      const messageField = tool.fields.find((f) => f.id === "message");
      if (messageField) {
        setFields((prev) => ({ ...prev, message: pendingMessage }));
        sessionStorage.removeItem("pendingMessage");
      }
    }
  }, [tool.id]);

  const hasPrefilled = useRef(false);
  useEffect(() => {
    const prefillMessage = location.state?.message;
    if (
      prefillMessage &&
      tool.id === "reply-generator" &&
      !hasPrefilled.current
    ) {
      const messageField = tool.fields.find((f) => f.id === "message");
      if (messageField) {
        setFields((prev) => ({ ...prev, message: prefillMessage }));
        hasPrefilled.current = true;
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, tool.id]);
  // Loading state
  if (authLoading || subLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div className="dot-loader">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  function setField(id, val) {
    if (id === firstRequiredTextarea?.id) {
      if (val.length > charLimit) {
        toast.warning(`Character limit exceeded (max ${charLimit} chars).`);
        return;
      }
    }
    setFields((prev) => ({ ...prev, [id]: val }));
  }

  function canSubmit() {
    const requiredOk = tool.fields
      .filter((f) => f.required)
      .every((f) => (fields[f.id] || "").trim().length > 0);
    if (!requiredOk) return false;
    if (firstRequiredTextarea && charCount > charLimit) return false;
    return true;
  }

  async function generate() {
    if (!canSubmit() || phase === "generating") return;
    setPhase("generating");
    setResult(null);
    setErrorMessage("");
    setActiveTab(tool.outputVariants?.[0] || "");
    setSavedVariants(new Set());
    try {
      let parsed;
      if (tool.backendRoute && generateApi[tool.backendRoute]) {
        parsed = await generateApi[tool.backendRoute](fields);
        toast.success("Done! Here are your results.");
      } else {
        const prompt = tool.buildPrompt(fields);
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await res.json();
        const raw = data.content?.find((b) => b.type === "text")?.text || "{}";
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        toast.success("Done! Here are your results.");
      }
      setResult(parsed);
      setPhase("done");
      if (parsed?._remaining != null || parsed?._raw?.remaining != null) {
        const remaining = parsed._remaining ?? parsed._raw?.remaining;
        const limit = parsed._raw?.limit;
        qc.setQueryData(["auth", "me"], (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            replies_remaining: remaining,
            usage_today:
              limit != null ? limit - remaining : (prev.usage_today ?? 0) + 1,
            limit_today: limit ?? prev.limit_today,
          };
        });
      }
    } catch (err) {
      const status = err?.response?.status || err?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";
      setPhase("error");
      if (status === 401) {
        setErrorMessage("Your session has expired. Please sign in again.");
        toast.error("Session expired — please sign in again.");
      } else if (status === 403) {
        setErrorMessage(
          msg ||
            "Your trial has expired or your plan doesn't include this tool.",
        );
        toast.warning(msg || "Plan access denied.");
      } else if (status === 429) {
        setErrorMessage(
          msg || "You've reached your daily limit. Upgrade to continue.",
        );
        toast.warning(msg || "Daily limit reached.");
      } else if (status === 504) {
        setErrorMessage(
          "The AI took too long to respond. Your usage was not affected — please try again.",
        );
        toast.error("AI timeout — try again.");
      } else {
        setErrorMessage(msg);
        toast.error(msg);
      }
    }
  }

  async function handleSaveReply(variant) {
    if (!result?._generationId) {
      toast.error("No generation ID found. Please regenerate.");
      return;
    }
    setSavingVariant(variant);
    try {
      await api.post("/generate/reply/save", {
        generation_id: result._generationId,
      });
      setSavedVariants((prev) => new Set(prev).add(variant));
      toast.success(`Analysis saved!`);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to save.";
      if (msg.toLowerCase().includes("already saved")) {
        toast.warning("This analysis was already saved.");
        setSavedVariants((prev) => new Set(prev).add(variant));
      } else {
        toast.error(msg);
      }
    } finally {
      setSavingVariant(null);
    }
  }

  const getAnalysisText = () => {
    if (!result) return "";
    if (tool.id === "tone-checker") {
      return `Tone: ${result.primary_tone || "—"}\nRisk: ${result.risk_level || "—"}\nInterpretation: ${result.interpretation || "—"}`;
    }
    if (tool.id === "intent-detector") {
      return `Primary intent: ${result.primary_intent || "—"}\nSurface meaning: ${result.surface_meaning || "—"}\nSubtext: ${result.subtext || "—"}\nStrategy: ${result.recommended_response_strategy || "—"}`;
    }
    return "";
  };

  /* ── shared save button renderer for tone-checker / intent-detector ── */
  function SaveBtn({ key: _k, variantKey }) {
    const isSaving = savingVariant === variantKey;
    const isSaved = savedVariants.has(variantKey);
    return (
      <button
        onClick={() => !isSaved && !isSaving && handleSaveReply(variantKey)}
        disabled={isSaved || isSaving}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "7px 14px",
          borderRadius: 9,
          border: `1px solid ${isSaved ? "rgba(34,197,94,0.3)" : "var(--border2)"}`,
          background: isSaved ? "rgba(34,197,94,0.08)" : "transparent",
          color: isSaved ? "var(--green)" : "var(--ink-3)",
          fontSize: 13,
          fontWeight: 600,
          cursor: isSaved || isSaving ? "default" : "pointer",
          transition: "all .15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          if (!isSaved && !isSaving) {
            e.currentTarget.style.borderColor = "var(--green)";
            e.currentTarget.style.color = "var(--green)";
            e.currentTarget.style.background = "rgba(34,197,94,0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSaved && !isSaving) {
            e.currentTarget.style.borderColor = "var(--border2)";
            e.currentTarget.style.color = "var(--ink-3)";
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {isSaving ? (
          <>
            <Loader2
              size={12}
              style={{ animation: "spin .7s linear infinite" }}
            />
            Saving…
          </>
        ) : isSaved ? (
          <>
            <BookmarkCheck size={12} />
            Saved
          </>
        ) : (
          <>
            <Bookmark size={12} />
            Save
          </>
        )}
      </button>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      {showPackModal && (
        <PackModal
          value={fields.pack_scenario || null}
          onChange={(v) => setField("pack_scenario", v)}
          onClose={() => setShowPackModal(false)}
          userPlan={planTier}
          availablePacks={availablePacks}
        />
      )}
      {showShare && result && (
        <ShareModal
          result={result}
          tool={tool}
          activeVariant={activeTab}
          onClose={() => setShowShare(false)}
          subscription={subscription}
          promptText={fields[firstRequiredTextarea?.id] || ""} // Add this line
        />
      )}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className="main-content tool-main"
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
                className="tool-hamburger"
              >
                <Menu size={21} />
              </button>
              <style>{`@media (max-width: 900px) { .tool-hamburger { display: flex !important; } }`}</style>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: tool.color,
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
                  {tool.label}
                </span>
              </div>
            </div>
            {phase === "done" && result && (
              <button
                onClick={() => setShowShare(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 15px",
                  borderRadius: 9,
                  border: "1px solid var(--border2)",
                  background: "transparent",
                  color: "var(--ink-2)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--green)";
                  e.currentTarget.style.color = "var(--green)";
                  e.currentTarget.style.background = "rgba(34,197,94,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border2)";
                  e.currentTarget.style.color = "var(--ink-2)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Share2 size={13} /> Share insight
              </button>
            )}
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
              textAlign: "center",
              marginBottom: "clamp(28px,4vw,48px)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 14px",
                borderRadius: 999,
                background: tool.bg,
                border: `1px solid ${tool.border}`,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: tool.color,
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: tool.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {tool.label}
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(26px,4vw,44px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                marginBottom: 10,
                lineHeight: 1.1,
              }}
            >
              {tool.tagline}
            </h1>
            <p
              style={{
                fontSize: "clamp(14px,1.6vw,16px)",
                color: "var(--ink-3)",
                maxWidth: 500,
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              {tool.description}
            </p>
          </div>

          {firstRequiredTextarea && (
            <div style={{ marginBottom: "clamp(16px,2vw,24px)" }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "2px solid var(--border2)",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                  transition: "border-color .2s, box-shadow .2s",
                }}
                onFocusCapture={(e) => {
                  e.currentTarget.style.borderColor = tool.color;
                  e.currentTarget.style.boxShadow = `0 0 0 4px ${tool.color}12, 0 12px 48px rgba(0,0,0,0.15)`;
                }}
                onBlurCapture={(e) => {
                  e.currentTarget.style.borderColor = "var(--border2)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 40px rgba(0,0,0,0.12)";
                }}
              >
                <div
                  style={{
                    padding: "18px 24px 8px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: tool.color,
                      boxShadow: `0 0 8px ${tool.color}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--ink-3)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {firstRequiredTextarea.label}
                  </span>
                  <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
                    <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                      {charCount} chars
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        color:
                          charCount > charLimit ? "#ef4444" : "var(--ink-4)",
                      }}
                    >
                      {charCount}/{charLimit} chars
                    </span>
                  </div>
                </div>
                <textarea
                  value={fields[firstRequiredTextarea.id] || ""}
                  onChange={(e) =>
                    setField(firstRequiredTextarea.id, e.target.value)
                  }
                  placeholder={firstRequiredTextarea.placeholder}
                  rows={firstRequiredTextarea.rows || 7}
                  style={{
                    width: "100%",
                    padding: "clamp(18px,2.5vw,28px) clamp(20px,3vw,32px)",
                    fontSize: "clamp(15px,2vw,18px)",
                    lineHeight: 1.75,
                    color: "var(--ink)",
                    background: "transparent",
                    border: "none",
                    caretColor: tool.color,
                    fontFamily: "inherit",
                    minHeight: "clamp(140px,20vw,220px)",
                  }}
                />
              </div>
              {charCount > charLimit && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: 12,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Character limit exceeded ({charLimit} characters maximum).
                  Please shorten your message.
                </p>
              )}
            </div>
          )}

          {otherTextareas.map((f) => (
            <div key={f.id} style={{ marginBottom: "clamp(14px,2vw,20px)" }}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1.5px solid var(--border2)",
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "border-color .2s, box-shadow .2s",
                }}
              >
                <div
                  style={{
                    padding: "12px 18px 8px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: tool.color,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--ink-3)",
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11.5,
                      color: "var(--ink-4)",
                    }}
                  >
                    {(fields[f.id] || "").length} chars
                  </span>
                </div>
                <textarea
                  value={fields[f.id] || ""}
                  onChange={(e) => setField(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.rows || 4}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    fontSize: "clamp(14px,1.8vw,16px)",
                    lineHeight: 1.65,
                    color: "var(--ink)",
                    background: "transparent",
                    border: "none",
                    caretColor: tool.color,
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          ))}

          {optionFields
            .filter((f) => f.type === "chips")
            .map((f) => (
              <ChipsField
                key={f.id}
                field={f}
                value={fields[f.id]}
                onChange={(v) => setField(f.id, v)}
              />
            ))}

          {optionFields
            .filter((f) => f.type === "pack-modal")
            .map((f) => {
              const ps = fields.pack_scenario;
              const pack = ps ? PACKS.find((p) => p.id === ps.packId) : null;
              return (
                <div
                  key={f.id}
                  style={{ marginBottom: "clamp(14px,2vw,20px)" }}
                >
                  <button
                    type="button"
                    onClick={() => setShowPackModal(true)}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      borderRadius: 12,
                      border: `1.5px solid ${ps ? pack?.border || "var(--green)" : "var(--border2)"}`,
                      background: ps
                        ? pack?.bg || "rgba(34,197,94,0.06)"
                        : "var(--surface2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all .2s",
                      boxShadow: ps
                        ? `0 0 0 3px ${pack?.bg || "rgba(34,197,94,0.08)"}`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!ps) {
                        e.currentTarget.style.borderColor = "var(--green)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(34,197,94,0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!ps) {
                        e.currentTarget.style.borderColor = "var(--border2)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 0,
                      }}
                    >
                      {ps && pack ? (
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: pack.color,
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              marginBottom: 2,
                            }}
                          >
                            {ps.packLabel}
                          </p>
                          <p
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: "var(--ink)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ps.scenarioLabel}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 9,
                              background: "var(--surface3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Zap size={14} color="var(--ink-3)" />
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--ink-3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: 1,
                              }}
                            >
                              Context Pack
                            </p>
                            <p
                              style={{ fontSize: 13.5, color: "var(--ink-3)" }}
                            >
                              Choose a pack and scenario
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      {ps && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setField("pack_scenario", null);
                          }}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "var(--surface3)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "var(--ink-3)",
                            transition: "all .15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.12)";
                            e.currentTarget.style.color = "#ef4444";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "var(--surface3)";
                            e.currentTarget.style.color = "var(--ink-3)";
                          }}
                        >
                          <X size={11} />
                        </button>
                      )}
                      <ChevronDown size={14} color="var(--ink-3)" />
                    </div>
                  </button>
                </div>
              );
            })}

          {optionFields.filter((f) => f.type === "select").length > 0 && (
            <div
              className="tool-selects-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                gap: 12,
                marginBottom: "clamp(18px,2.5vw,28px)",
              }}
            >
              {optionFields
                .filter((f) => f.type === "select")
                .map((f) => (
                  <CustomSelect
                    key={f.id}
                    label={f.label}
                    options={f.options}
                    value={fields[f.id] || ""}
                    placeholder={`Choose ${f.label.toLowerCase()}…`}
                    onChange={(v) => setField(f.id, v)}
                  />
                ))}
            </div>
          )}

          {user ? (
            <button
              onClick={generate}
              disabled={!canSubmit() || phase === "generating"}
              className="btn-green"
              style={{
                width: "100%",
                padding: "clamp(14px,2vw,18px)",
                borderRadius: 14,
                fontSize: "clamp(15px,2vw,17px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: "clamp(24px,3vw,40px)",
                opacity: !canSubmit() || phase === "generating" ? 0.5 : 1,
                cursor:
                  !canSubmit() || phase === "generating"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {phase === "generating" ? (
                <>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: "2.5px solid rgba(0,0,0,0.25)",
                      borderTopColor: "#000",
                      borderRadius: "50%",
                      animation: "spin .7s linear infinite",
                    }}
                  />{" "}
                  Generating…
                </>
              ) : (
                <>
                  <Zap size={18} /> Generate with Avertune
                </>
              )}
            </button>
          ) : (
            <div style={{ marginBottom: "clamp(24px,3vw,40px)" }}>
              <button
                disabled
                className="btn-green"
                style={{
                  width: "100%",
                  padding: "clamp(14px,2vw,18px)",
                  borderRadius: 14,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: 0.4,
                  cursor: "not-allowed",
                  marginBottom: 12,
                }}
              >
                <Zap size={18} /> Generate with Avertune
              </button>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: "var(--ink-3)",
                }}
              >
                <button
                  onClick={onLogin}
                  style={{
                    color: "var(--green)",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                  }}
                >
                  Sign in free
                </button>{" "}
                to use this tool
              </p>
            </div>
          )}

          {phase === "generating" && (
            <div
              style={{
                padding: "28px",
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                borderRadius: 18,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <div className="dot-loader">
                  <span />
                  <span />
                  <span />
                </div>
                <span style={{ fontSize: 14, color: "var(--ink-3)" }}>
                  Generating your {tool.label.toLowerCase()}…
                </span>
              </div>
              <div
                style={{
                  height: 3,
                  background: "var(--surface3)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg,${tool.color},var(--teal))`,
                    borderRadius: 2,
                    animation:
                      "progress-bar 2s cubic-bezier(0.4,0,0.2,1) forwards",
                  }}
                />
              </div>
            </div>
          )}

          {phase === "error" && (
            <div
              style={{
                padding: "20px 24px",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 14,
                marginBottom: 20,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: "rgba(239,68,68,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle size={16} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: "#ef4444",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontSize: 14,
                  }}
                >
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={() => {
                    setPhase("idle");
                    setErrorMessage("");
                  }}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink-3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  Try again →
                </button>
              </div>
            </div>
          )}

          {phase === "done" && result && (
            <div
              style={{
                animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {tool.id === "reply-generator" && (
                <div style={{ marginBottom: 16 }}>
                  <VariantPanel
                    variants={
                      tool.outputVariants && tool.outputVariants.length
                        ? tool.outputVariants
                        : Object.keys(result.replies || {})
                    }
                    replies={result.replies}
                    activeTab={activeTab}
                    setActiveTab={(v) => setActiveTab(v)}
                    onShare={() => setShowShare(true)}
                    onSave={canSave ? handleSaveReply : null}
                    isSaved={savedVariants.has(activeTab)}
                    savingVariant={savingVariant}
                    insights={result._replyInsights}
                    descriptors={result._replyDescriptors}
                    recommendedVariant={result._recommendedVariant}
                  />
                </div>
              )}
              {tool.id === "tone-checker" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border2)",
                      borderRadius: 16,
                      padding: "clamp(20px,3vw,32px)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--ink-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 12,
                      }}
                    >
                      Detected tone
                    </p>
                    <p
                      style={{
                        fontSize: "clamp(24px,4vw,32px)",
                        fontWeight: 800,
                        color: "var(--green)",
                        letterSpacing: "-0.02em",
                        marginBottom: 16,
                      }}
                    >
                      {result.primary_tone || "—"}
                    </p>
                    {result.secondary_signals?.length > 0 && (
                      <>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 8,
                          }}
                        >
                          Secondary signals
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginBottom: 16,
                          }}
                        >
                          {result.secondary_signals.map((signal) => (
                            <span
                              key={signal}
                              style={{
                                padding: "4px 12px",
                                borderRadius: 20,
                                background: "var(--surface2)",
                                border: "1px solid var(--border2)",
                                fontSize: 13,
                              }}
                            >
                              {signal}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                    {result.emotional_intensity && (
                      <div style={{ marginBottom: 12 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Emotional intensity
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.emotional_intensity}
                        </p>
                      </div>
                    )}
                    {result.risk_level && (
                      <div style={{ marginBottom: 12 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Risk level
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.risk_level}
                        </p>
                      </div>
                    )}
                    {result.interpretation && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Interpretation
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: "var(--ink-2)",
                            lineHeight: 1.6,
                          }}
                        >
                          {result.interpretation}
                        </p>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {canSave && <SaveBtn variantKey="tone-analysis" />}
                      <button
                        onClick={() => setShowShare(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 14px",
                          borderRadius: 9,
                          border: "1px solid var(--border2)",
                          background: "transparent",
                          color: "var(--ink-3)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all .15s",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--green)";
                          e.currentTarget.style.color = "var(--green)";
                          e.currentTarget.style.background =
                            "rgba(34,197,94,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border2)";
                          e.currentTarget.style.color = "var(--ink-3)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Share2 size={12} /> Share
                      </button>
                      <CopyBtn text={getAnalysisText()} />
                    </div>
                  </div>
                </div>
              )}
              {tool.id === "boundary-builder" && (
                <div style={{ marginBottom: 16 }}>
                  {result.situation_read && (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "rgba(34,197,94,0.05)",
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--ink-3)",
                          marginBottom: 4,
                        }}
                      >
                        Situation
                      </p>
                      <p style={{ fontSize: 14, color: "var(--ink)" }}>
                        {result.situation_read}
                      </p>
                    </div>
                  )}
                  <VariantPanel
                    variants={
                      tool.outputVariants && tool.outputVariants.length
                        ? tool.outputVariants
                        : Object.keys(result.replies || {})
                    }
                    replies={result.replies}
                    activeTab={activeTab}
                    setActiveTab={(v) => setActiveTab(v)}
                    onShare={() => setShowShare(true)}
                    onSave={canSave ? handleSaveReply : null}
                    isSaved={savedVariants.has(activeTab)}
                    savingVariant={savingVariant}
                    insights={result._replyInsights}
                    descriptors={result._replyDescriptors}
                    recommendedVariant={result._recommendedVariant}
                  />
                  {result.power_note && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: "10px 14px",
                        background: "rgba(34,197,94,0.03)",
                        borderRadius: 10,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--green)",
                        }}
                      >
                        Power note
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
                        {result.power_note}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {tool.id === "negotiation-reply" && (
                <div style={{ marginBottom: 16 }}>
                  {result.situation_read && (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "rgba(34,197,94,0.05)",
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--ink-3)",
                          marginBottom: 4,
                        }}
                      >
                        Situation
                      </p>
                      <p style={{ fontSize: 14, color: "var(--ink)" }}>
                        {result.situation_read}
                      </p>
                    </div>
                  )}
                  {result.insight && (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "rgba(45,212,191,0.05)",
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--teal)",
                          marginBottom: 4,
                        }}
                      >
                        Key insight
                      </p>
                      <p style={{ fontSize: 14, color: "var(--ink)" }}>
                        {result.insight}
                      </p>
                    </div>
                  )}
                  <VariantPanel
                    variants={
                      tool.outputVariants && tool.outputVariants.length
                        ? tool.outputVariants
                        : Object.keys(result.replies || {})
                    }
                    replies={result.replies}
                    activeTab={activeTab}
                    setActiveTab={(v) => setActiveTab(v)}
                    onShare={() => setShowShare(true)}
                    onSave={canSave ? handleSaveReply : null}
                    isSaved={savedVariants.has(activeTab)}
                    savingVariant={savingVariant}
                    insights={result._replyInsights}
                    descriptors={result._replyDescriptors}
                    recommendedVariant={result._recommendedVariant}
                  />
                </div>
              )}
              {tool.id === "follow-up-writer" && (
                <div style={{ marginBottom: 16 }}>
                  <VariantPanel
                    variants={
                      tool.outputVariants && tool.outputVariants.length
                        ? tool.outputVariants
                        : Object.keys(result.replies || {})
                    }
                    replies={result.replies}
                    activeTab={activeTab}
                    setActiveTab={(v) => setActiveTab(v)}
                    onShare={() => setShowShare(true)}
                    onSave={canSave ? handleSaveReply : null}
                    isSaved={savedVariants.has(activeTab)}
                    savingVariant={savingVariant}
                    insights={result._replyInsights}
                    descriptors={result._replyDescriptors}
                    recommendedVariant={result._recommendedVariant}
                  />
                  {result.replies?._emailDetails?.[activeTab] && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: "10px 14px",
                        background: "var(--surface2)",
                        borderRadius: 10,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--ink-3)",
                          marginBottom: 2,
                        }}
                      >
                        Subject
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink)" }}>
                        {result.replies._emailDetails[activeTab].subject}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {tool.id === "difficult-email" && (
                <div style={{ marginBottom: 16 }}>
                  <VariantPanel
                    variants={
                      tool.outputVariants && tool.outputVariants.length
                        ? tool.outputVariants
                        : Object.keys(result.replies || {})
                    }
                    replies={result.replies}
                    activeTab={activeTab}
                    setActiveTab={(v) => setActiveTab(v)}
                    onShare={() => setShowShare(true)}
                    onSave={canSave ? handleSaveReply : null}
                    isSaved={savedVariants.has(activeTab)}
                    savingVariant={savingVariant}
                    insights={result._replyInsights}
                    descriptors={result._replyDescriptors}
                    recommendedVariant={result._recommendedVariant}
                  />
                  {result.replies?._emailSubjects?.[activeTab] && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: "10px 14px",
                        background: "var(--surface2)",
                        borderRadius: 10,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--ink-3)",
                          marginBottom: 2,
                        }}
                      >
                        Subject
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink)" }}>
                        {result.replies._emailSubjects[activeTab]}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {tool.id === "intent-detector" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border2)",
                      borderRadius: 16,
                      padding: "clamp(20px,3vw,32px)",
                    }}
                  >
                    {result.surface_meaning && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Surface meaning
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.surface_meaning}
                        </p>
                      </div>
                    )}
                    {result.likely_intents &&
                      result.likely_intents.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "var(--ink-3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: 8,
                            }}
                          >
                            Likely intents
                          </p>
                          <ul
                            style={{
                              marginLeft: 20,
                              color: "var(--ink-2)",
                              fontSize: 14,
                            }}
                          >
                            {result.likely_intents.map((intent, i) => (
                              <li key={i}>{intent}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {result.primary_intent && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Primary intent
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--teal)",
                          }}
                        >
                          {result.primary_intent}
                        </p>
                      </div>
                    )}
                    {result.emotional_tone && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Emotional tone
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.emotional_tone}
                        </p>
                      </div>
                    )}
                    {result.subtext && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Subtext
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.subtext}
                        </p>
                      </div>
                    )}
                    {result.risk_indicators &&
                      result.risk_indicators.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "var(--ink-3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: 8,
                            }}
                          >
                            Risk indicators
                          </p>
                          <ul
                            style={{
                              marginLeft: 20,
                              color: "var(--ink-2)",
                              fontSize: 14,
                            }}
                          >
                            {result.risk_indicators.map((ind, i) => (
                              <li key={i}>{ind}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {result.what_they_want && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          What they want
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.what_they_want}
                        </p>
                      </div>
                    )}
                    {result.what_they_expect_next && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          What they expect next
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.what_they_expect_next}
                        </p>
                      </div>
                    )}
                    {result.confidence && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Confidence
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {Math.round(result.confidence * 100)}%
                        </p>
                      </div>
                    )}
                    {result.trust_signal && (
                      <div style={{ marginBottom: 16 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Trust signal
                        </p>
                        <p style={{ fontSize: 14, color: "var(--ink)" }}>
                          {result.trust_signal}
                        </p>
                      </div>
                    )}
                    {result.recommended_response_strategy && (
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--ink-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 4,
                          }}
                        >
                          Recommended response strategy
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: "var(--ink)",
                            lineHeight: 1.6,
                          }}
                        >
                          {result.recommended_response_strategy}
                        </p>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {canSave && <SaveBtn variantKey="intent-analysis" />}
                      <button
                        onClick={() => setShowShare(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "7px 14px",
                          borderRadius: 9,
                          border: "1px solid var(--border2)",
                          background: "transparent",
                          color: "var(--ink-3)",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all .15s",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--green)";
                          e.currentTarget.style.color = "var(--green)";
                          e.currentTarget.style.background =
                            "rgba(34,197,94,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border2)";
                          e.currentTarget.style.color = "var(--ink-3)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Share2 size={12} /> Share
                      </button>
                      <CopyBtn text={getAnalysisText()} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <style>{`@media (max-width: 480px) { .tool-selects-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
