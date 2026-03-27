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
} from "lucide-react";
import { useAuth } from "../AuthContext.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { generateApi } from "../lib/generateApi.js";
import { PACKS } from "../lib/packData.js";
import { useToast } from "../lib/Toast.jsx";

/* ─────────────────────────────── Custom Select ─────────────────────────── */
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
          {selected || placeholder || "Select…"}
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
                onChange(opt);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background:
                  selected && opt === selected ? "var(--surface2)" : "transparent",
                color: selected && opt === selected ? "var(--green)" : "var(--ink)",
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
              {opt}
              {selected && opt === selected && <Check size={12} color="var(--green)" />}
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

  // Reset internal state when parent clears value (tool switch)
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
        if (next.size >= maxSelect) return prev; // at limit — ignore
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
      <div style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border2)",
        borderRadius: 16,
        overflow: "hidden",
        transition: "border-color .2s",
      }}>
        {/* Header */}
        <div style={{
          padding: "12px 18px 10px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}>
            {field.label}
          </span>
          <span style={{
            fontSize: 10.5, color: "var(--ink-4)",
            background: "var(--surface2)", padding: "1px 7px", borderRadius: 4,
          }}>
            {field.maxSelect ? `pick up to ${field.maxSelect}` : "optional · pick any"}
          </span>
          {/* Clear button — only shown when something is selected */}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                marginLeft: "auto", fontSize: 11.5, fontWeight: 600,
                color: "var(--ink-3)", background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 4,
                transition: "color .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--ink-3)"}
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>

        {/* Chips */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {field.chips.map((chip) => {
              const active = selected.has(chip);
              // dim unselected chips when at limit
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
                    background: active ? "rgba(34,197,94,0.1)" : "var(--surface2)",
                    color: active ? "var(--green)" : "var(--ink-2)",
                    opacity: dimmed ? 0.3 : 1,
                    transition: "all .15s",
                    display: "flex", alignItems: "center", gap: 5,
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
function PackModal({ value, onChange, onClose, userPlan }) {
  const [activePack, setActivePack] = useState(
    value?.packId ? PACKS.find(p => p.id === value.packId) || PACKS[0] : PACKS[0]
  );
  const [selected, setSelected] = useState(value || null);
  const isPro = userPlan && userPlan.toLowerCase() !== 'free' && userPlan.toLowerCase() !== 'trial';

  function selectScenario(pack, scenario) {
    if (scenario.pro && !isPro) return;
    const next = { packId: pack.id, packLabel: pack.label, scenarioId: scenario.id, scenarioLabel: scenario.label };
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
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.18s ease both',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 24,
        width: '100%',
        maxWidth: 760,
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeUp 0.28s cubic-bezier(0.16,1,0.3,1) both',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: 2 }}>
              Context Pack
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
              Pick a pack then choose your scenario
            </p>
          </div>
          <button onClick={onClose} style={{
            color: 'var(--ink-3)', background: 'var(--surface2)',
            border: '1px solid var(--border)', borderRadius: 9,
            cursor: 'pointer', padding: 7, display: 'flex', alignItems: 'center',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="pack-modal-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <style>{`
            @media (max-width: 560px) {
              .pack-modal-body { flex-direction: column !important; }
              .pack-modal-left { width: 100% !important; borderRight: none !important; borderBottom: 1px solid var(--border) !important; flexDirection: row !important; flexWrap: wrap !important; overflowX: auto !important; overflowY: visible !important; padding: 8px !important; gap: 6px !important; maxHeight: 110px !important; }
              .pack-modal-right { flex: 1 !important; minHeight: 200px !important; }
            }
          `}</style>

          {/* Left: Pack list */}
          <div className="pack-modal-left" style={{
            width: 190, flexShrink: 0,
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            padding: '10px 8px',
          }}>
            {PACKS.map(pack => {
              const isActive = activePack?.id === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => setActivePack(pack)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    borderRadius: 11, marginBottom: 2,
                    background: isActive ? pack.bg : 'transparent',
                    border: `1px solid ${isActive ? pack.border : 'transparent'}`,
                    color: isActive ? pack.color : 'var(--ink-2)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'inherit', fontWeight: isActive ? 700 : 500,
                    fontSize: 13, cursor: 'pointer', textAlign: 'left',
                    transition: 'all .15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)'; }}}
                >
                  <span style={{ lineHeight: 1.3 }}>{pack.label}</span>
                  {isActive && (
                    <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: pack.color, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Scenarios */}
          <div className="pack-modal-right" style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
            {activePack && (
              <>
                {/* Pack header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 14,
                  padding: '10px 14px',
                  background: activePack.bg,
                  border: `1px solid ${activePack.border}`,
                  borderRadius: 12,
                }}>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: activePack.color }}>{activePack.label}</p>
                    <p style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 }}>
                      {activePack.scenarios.length} scenarios available
                    </p>
                  </div>
                </div>

                {/* Scenarios grid */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {activePack.scenarios.map(scenario => {
                    const isSelected = selected?.packId === activePack.id && selected?.scenarioId === scenario.id;
                    const locked = scenario.pro && !isPro;
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => selectScenario(activePack, scenario)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: isSelected ? 700 : 500,
                          fontFamily: 'inherit',
                          cursor: locked ? 'not-allowed' : 'pointer',
                          border: `1.5px solid ${isSelected ? activePack.color : 'var(--border2)'}`,
                          background: isSelected ? activePack.bg : 'var(--surface2)',
                          color: locked ? 'var(--ink-4)' : isSelected ? activePack.color : 'var(--ink-2)',
                          opacity: locked ? 0.5 : 1,
                          transition: 'all .15s',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}
                        onMouseEnter={e => { if (!locked && !isSelected) { e.currentTarget.style.borderColor = activePack.color; e.currentTarget.style.color = activePack.color; }}}
                        onMouseLeave={e => { if (!locked && !isSelected) { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--ink-2)'; }}}
                      >
                        {isSelected && <Check size={11} />}
                        {scenario.label}
                        {locked && (
                          <span style={{
                            fontSize: 9.5, fontWeight: 700,
                            color: '#f59e0b', background: 'rgba(245,158,11,0.12)',
                            border: '1px solid rgba(245,158,11,0.25)',
                            padding: '1px 5px', borderRadius: 4,
                          }}>PRO</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
          background: 'var(--surface2)',
        }}>
          {/* Selected preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {selected ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px',
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                borderRadius: 20, maxWidth: 300,
              }}>
                <span style={{
                  fontSize: 12.5, fontWeight: 600, color: 'var(--ink)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {selected.packLabel} · {selected.scenarioLabel}
                </span>
              </div>
            ) : (
              <p style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>No scenario selected</p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {value && (
              <button onClick={clear} style={{
                padding: '9px 16px', borderRadius: 10,
                border: '1px solid var(--border2)', background: 'transparent',
                color: 'var(--ink-3)', fontFamily: 'inherit',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
              >
                Clear
              </button>
            )}
            <button
              onClick={apply}
              disabled={!selected}
              className="btn-green"
              style={{
                padding: '9px 22px', borderRadius: 10,
                fontWeight: 700, fontSize: 13,
                opacity: selected ? 1 : 0.4,
                cursor: selected ? 'pointer' : 'not-allowed',
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
function ShareModal({ result, tool, activeVariant, onClose }) {
  const cardRef = useRef();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const replyText =
    result?.replies?.[activeVariant] || result?.recommended_approach || "";
  const toneText = result?.tone || result?.primary_tone || "";
  const riskText = result?.risk || result?.risk_level || "—";
  const stratText = result?.strategy || result?.recommended_approach || "";

  // Text to share on platforms
  const shareQuote = `📊 Message analysis via Avertune:\n\nTone: ${toneText} · Risk: ${riskText}\nStrategy: ${stratText}\n\n💬 ${activeVariant} reply:\n"${replyText.slice(0, 200)}${replyText.length > 200 ? "…" : ""}"\n\n🔗 avertune.com`;

  const platforms = [
    {
      label: "X / Twitter",
      bg: "#000",
      color: "#fff",
      icon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://avertune.com")}`,
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

  // Download card as image using the DOM card element
  async function downloadCard() {
    setDownloading(true);
    try {
      // dynamically load html2canvas from CDN
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
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `avertune-${tool.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  }

  async function copyImage() {
    setCopied(false);
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
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          // fallback: copy text
          await navigator.clipboard.writeText(shareQuote);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      });
    } catch {
      await navigator.clipboard.writeText(shareQuote).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const VARIANT_COLORS = {
    Balanced: "#22c55e",
    Firm: "#2dd4bf",
    Warm: "#38bdf8",
    Delay: "#a78bfa",
    Improved: "#22c55e",
    Concise: "#2dd4bf",
    Confident: "#38bdf8",
    "Original+": "#a78bfa",
    Diplomatic: "#22c55e",
    Direct: "#2dd4bf",
    Final: "#ef4444",
    Strategic: "#22c55e",
    "Hold Firm": "#2dd4bf",
    Counter: "#38bdf8",
    "Walk Away": "#a78bfa",
    Standard: "#22c55e",
    Friendly: "#2dd4bf",
    Urgent: "#f59e0b",
    Brief: "#38bdf8",
  };
  const varColor = VARIANT_COLORS[activeVariant] || "#22c55e";

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
        overflowY: "auto",
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
          position: "relative",
          animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "var(--ink-3)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 7,
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
          }}
        >
          Your insight card
        </p>

        {/* ── The visual card (this is what gets captured) ── */}
        <div
          ref={cardRef}
          style={{
            borderRadius: 18,
            background:
              "linear-gradient(135deg, #09090B 0%, #0F1A12 50%, #091211 100%)",
            padding: "clamp(20px,3vw,28px)",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(34,197,94,0.15)",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: -40,
              left: -40,
              width: 200,
              height: 200,
              background: `radial-gradient(circle, ${varColor}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -40,
              width: 240,
              height: 240,
              background:
                "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#22c55e,#2dd4bf)",
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "-0.03em",
                  color: "#F4F4F6",
                }}
              >
                Avertune
              </span>
            </div>
            <div
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: `${varColor}20`,
                border: `1px solid ${varColor}40`,
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
                {activeVariant}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              marginBottom: 18,
            }}
          >
            {[
              { l: "Tone", v: toneText || "—", c: "#38bdf8" },
              {
                l: "Risk",
                v: riskText,
                c:
                  riskText === "High"
                    ? "#ef4444"
                    : riskText === "Medium"
                      ? "#f59e0b"
                      : "#22c55e",
              },
              { l: "Tool", v: tool.label, c: "#a78bfa" },
            ].map((r) => (
              <div
                key={r.l}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#71717A",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    marginBottom: 4,
                  }}
                >
                  {r.l}
                </p>
                <p
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: r.c,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.v}
                </p>
              </div>
            ))}
          </div>

          {/* Strategy */}
          {stratText && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(34,197,94,0.07)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 10,
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "#22c55e",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  marginBottom: 5,
                }}
              >
                Strategy
              </p>
              <p style={{ fontSize: 12.5, color: "#A1A1AA", lineHeight: 1.55 }}>
                {stratText}
              </p>
            </div>
          )}

          {/* Reply */}
          {replyText && (
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
                {activeVariant} reply
              </p>
              <p style={{ fontSize: 12.5, color: "#F4F4F6", lineHeight: 1.65 }}>
                "
                {replyText.length > 200
                  ? replyText.slice(0, 197) + "…"
                  : replyText}
                "
              </p>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: 11, color: "#3F3F46" }}>avertune.com</p>
            <p style={{ fontSize: 10, color: "#3F3F46" }}>
              Think before you send.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={copyImage}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border2)"}`,
              background: copied ? "rgba(34,197,94,0.07)" : "transparent",
              color: copied ? "var(--green)" : "var(--ink-2)",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all .2s",
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy card"}
          </button>
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
              fontFamily: "inherit",
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
            <Download size={13} />
            {downloading ? "Saving…" : "Download"}
          </button>
        </div>

        {/* Platform buttons */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          Share on
        </p>
        <div style={{ display: "flex", gap: 8 }}>
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
              <p.icon />
              {p.label}
            </button>
          ))}
        </div>
      </div>
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

function VariantPanel({ variants, replies, activeTab, setActiveTab, onShare, insights, descriptors, recommendedVariant }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* Tab row */}
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
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              {v}
              {recommendedVariant === v && (
                <span style={{
                  fontSize: 9, fontWeight: 700, color: c,
                  background: `${c}18`, border: `1px solid ${c}30`,
                  padding: "1px 6px", borderRadius: 10, lineHeight: 1.4,
                }}>★</span>
              )}
            </button>
          );
        })}
      </div>
      {/* Active reply */}
      {variants
        .filter((v) => v === activeTab)
        .map((v) => {
          const c = VARIANT_COLORS[v] || "var(--green)";
          const text = replies?.[v];
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
                  {/* Descriptor tag */}
                  {descriptors?.[v] && (
                    <p style={{
                      fontSize: 11.5, fontWeight: 600,
                      color: "var(--ink-3)",
                      marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{
                        display: "inline-block", width: 5, height: 5,
                        borderRadius: "50%", background: c, flexShrink: 0,
                      }} />
                      {descriptors[v]}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: 15.5,
                      color: "var(--ink)",
                      lineHeight: 1.8,
                      marginBottom: 14,
                    }}
                  >
                    {text}
                  </p>
                  {/* Per-reply insight */}
                  {insights?.[v] && (
                    <div style={{
                      padding: "10px 14px",
                      background: `${c}0D`,
                      border: `1px solid ${c}25`,
                      borderRadius: 10,
                      marginBottom: 14,
                      display: "flex", gap: 8, alignItems: "flex-start",
                    }}>
                      <Lightbulb size={13} style={{ color: c, flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>
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

/* ─────────────────────────────── Sidebar nav ─────────────────────────── */
const TOOL_NAV = [
  {
    icon: MessageSquare,
    slug: "reply-generator",
    label: "Reply Generator",
    color: "var(--green)",
  },
  {
    icon: Activity,
    slug: "tone-checker",
    label: "Tone Checker",
    color: "var(--teal)",
  },
  {
    icon: ShieldCheck,
    slug: "boundary-builder",
    label: "Boundaries",
    color: "var(--green)",
  },
  {
    icon: Swords,
    slug: "negotiation-reply",
    label: "Negotiation",
    color: "var(--teal)",
  },
  {
    icon: Clock,
    slug: "follow-up-writer",
    label: "Follow-Up",
    color: "var(--blue)",
  },
  {
    icon: AlertTriangle,
    slug: "difficult-email",
    label: "Difficult Email",
    color: "#f59e0b",
  },
  {
    icon: Lightbulb,
    slug: "intent-detector",
    label: "Intent Detector",
    color: "#a78bfa",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN TOOL PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function ToolPage({ tool, onBack, onLogin, onTool }) {
  const { user } = useAuth();
  const toast = useToast();
  const qc = useQueryClient();
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';
  const displayInitial = displayName[0].toUpperCase();
  const planTier = user?.plan_tier || 'free';
  const displayPlan = planTier.charAt(0).toUpperCase() + planTier.slice(1);
  const repliesRemaining = user?.replies_remaining ?? user?.limit_today ?? 5;
  const [fields, setFields] = useState({});
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(tool.outputVariants?.[0] || "");
  const [showShare, setShowShare] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reset all field values, results and phase whenever the tool changes
  useEffect(() => {
    setFields({});
    setResult(null);
    setPhase("idle");
    setErrorMessage("");
    setActiveTab(tool.outputVariants?.[0] || "");
    setShowShare(false);
    setShowPackModal(false);
  }, [tool.id]);

  function setField(id, val) {
    setFields((prev) => ({ ...prev, [id]: val }));
  }

  function canSubmit() {
    return tool.fields
      .filter((f) => f.required)
      .every((f) => (fields[f.id] || "").trim().length > 0);
  }

  async function generate() {
    if (!canSubmit() || phase === "generating") return;
    setPhase("generating");
    setResult(null);
    setErrorMessage("");
    setActiveTab(tool.outputVariants?.[0] || "");
    try {
      let parsed;
      if (tool.backendRoute && generateApi[tool.backendRoute]) {
        // ── Backend API call ──────────────────────────────────────────────
        parsed = await generateApi[tool.backendRoute](fields);
        toast.success("Done! Here are your results.");
      } else {
        // ── Fallback: direct Anthropic call (for tools without backend route) ──
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
      // Update user cache with latest remaining/usage from API response
      if (parsed?._remaining != null || parsed?._raw?.remaining != null) {
        const remaining = parsed._remaining ?? parsed._raw?.remaining;
        const limit     = parsed._raw?.limit;
        qc.setQueryData(['auth', 'me'], (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            replies_remaining: remaining,
            usage_today:  limit != null ? limit - remaining : (prev.usage_today ?? 0) + 1,
            limit_today:  limit ?? prev.limit_today,
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
        setErrorMessage(msg || "Your trial has expired or your plan doesn't include this tool.");
        toast.warning(msg || "Plan access denied.");
      } else if (status === 429) {
        setErrorMessage(msg || "You've reached your daily limit. Upgrade to continue.");
        toast.warning(msg || "Daily limit reached.");
      } else if (status === 504) {
        setErrorMessage("The AI took too long to respond. Your usage was not affected — please try again.");
        toast.error("AI timeout — try again.");
      } else {
        setErrorMessage(msg);
        toast.error(msg);
      }
    }
  }

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg,var(--green),var(--teal))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path
              d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11"
              stroke="#000"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
          }}
        >
          Avertune
        </span>
      </div>

      <div style={{ padding: "10px 10px 6px" }}>
        <button
          onClick={() => {
            onBack();
            setSidebarOpen(false);
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 10px",
            borderRadius: 9,
            background: "transparent",
            color: "var(--ink-3)",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            border: "none",
            transition: "all .15s",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface2)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ink-3)";
          }}
        >
          <Home size={14} /> Dashboard
        </button>
      </div>

      <div style={{ padding: "0 10px", flex: 1, overflowY: "auto" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            marginBottom: 6,
            paddingLeft: 8,
            paddingTop: 8,
          }}
        >
          Tools
        </p>
        {TOOL_NAV.map((t) => {
          const Icon = t.icon;
          const isActive = t.slug === tool.id;
          return (
            <button
              key={t.slug}
              onClick={() => {
                onTool?.(t.slug);
                setSidebarOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 9,
                marginBottom: 2,
                background: isActive ? `${t.color}12` : "transparent",
                color: isActive ? t.color : "var(--ink-3)",
                fontFamily: "inherit",
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                border: isActive
                  ? `1px solid ${t.color}25`
                  : "1px solid transparent",
                transition: "all .15s",
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
                  e.currentTarget.style.color = "var(--ink-3)";
                }
              }}
            >
              <Icon size={14} strokeWidth={1.8} />
              {t.label}
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: t.color,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {user && (
        <div
          style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}
        >
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
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: "#000" }}>
                {displayInitial}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--ink)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Main textarea field
  const mainField = tool.fields.find(
    (f) => f.type === "textarea" && f.required,
  );
  // Option fields (selects + optional textareas)
  const optionFields = tool.fields.filter((f) => f !== mainField);

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      {showPackModal && (
        <PackModal
          value={fields.pack_scenario || null}
          onChange={v => setField('pack_scenario', v)}
          onClose={() => setShowPackModal(false)}
          userPlan={planTier}
        />
      )}
      {showShare && result && (
        <ShareModal
          result={result}
          tool={tool}
          activeVariant={activeTab}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 40,
        }}
        className="tool-sidebar"
      >
        <style>{`.tool-sidebar { display:block!important } @media(max-width:900px){.tool-sidebar{display:none!important}.tool-main{margin-left:0!important}}`}</style>
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar ── */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}
        >
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 250,
              background: "var(--surface)",
              borderRight: "1px solid var(--border)",
              height: "100%",
              zIndex: 1,
              animation: "slideDown 0.25s ease both",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 14,
                color: "var(--ink-3)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main
        className="tool-main"
        style={{ flex: 1, marginLeft: 220, minWidth: 0 }}
      >
        {/* Header */}
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
                }}
                className="tool-menu-btn"
              >
                <style>{`.tool-menu-btn{display:none!important}@media(max-width:900px){.tool-menu-btn{display:flex!important}}`}</style>
                <ArrowLeft size={18} onClick={() => onBack()} />
              </button>
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
          {/* Tool hero */}
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

          {/* ── BIG textarea (centered, full width) ── */}
          {mainField && (
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
                    {mainField.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11.5,
                      color: "var(--ink-4)",
                    }}
                  >
                    {(fields[mainField.id] || "").length} chars
                  </span>
                </div>
                <textarea
                  value={fields[mainField.id] || ""}
                  onChange={(e) => setField(mainField.id, e.target.value)}
                  placeholder={mainField.placeholder}
                  rows={mainField.rows || 7}
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
            </div>
          )}

          {/* ── Second textarea (if any) ── */}
          {/* Optional textareas hidden — thread_context and context are sent silently */}

          {/* ── Chips fields ── */}
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

          {/* ── Pack modal trigger ── */}
          {optionFields.filter(f => f.type === "pack-modal").map(f => {
            const ps = fields.pack_scenario;
            const pack = ps ? PACKS.find(p => p.id === ps.packId) : null;
            return (
              <div key={f.id} style={{ marginBottom: "clamp(14px,2vw,20px)" }}>
                <button
                  type="button"
                  onClick={() => setShowPackModal(true)}
                  style={{
                    width: "100%", padding: "13px 16px",
                    borderRadius: 12,
                    border: `1.5px solid ${ps ? (pack?.border || "var(--green)") : "var(--border2)"}`,
                    background: ps ? (pack?.bg || "rgba(34,197,94,0.06)") : "var(--surface2)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 10, cursor: "pointer", fontFamily: "inherit",
                    transition: "all .2s",
                    boxShadow: ps ? `0 0 0 3px ${pack?.bg || "rgba(34,197,94,0.08)"}` : "none",
                  }}
                  onMouseEnter={e => { if (!ps) { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)"; }}}
                  onMouseLeave={e => { if (!ps) { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.boxShadow = "none"; }}}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    {ps && pack ? (
                      <>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: pack.color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>
                            {ps.packLabel}
                          </p>
                          <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {ps.scenarioLabel}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Zap size={14} color="var(--ink-3)" />
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 1 }}>
                            Context Pack
                          </p>
                          <p style={{ fontSize: 13.5, color: "var(--ink-3)" }}>
                            Choose a pack and scenario
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {ps && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setField("pack_scenario", null); }}
                        style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: "var(--surface3)", border: "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", color: "var(--ink-3)", transition: "all .15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface3)"; e.currentTarget.style.color = "var(--ink-3)"; }}
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

          {/* ── Options row (selects) ── */}
          {optionFields.filter((f) => f.type === "select").length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
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

          {/* ── Generate button ── */}
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
                  />
                  Generating…
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Generate with Avertune
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

          {/* ── Loading ── */}
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

          {/* ── Error ── */}
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
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: "rgba(239,68,68,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AlertTriangle size={16} color="#ef4444" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: 4, fontSize: 14 }}>
                  {errorMessage || "Something went wrong. Please try again."}
                </p>
                <button
                  onClick={() => { setPhase("idle"); setErrorMessage(""); }}
                  style={{
                    fontSize: 13, fontWeight: 600, color: "var(--ink-3)",
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, fontFamily: "inherit",
                  }}
                >
                  Try again →
                </button>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {phase === "done" && result && (
            <div
              style={{
                animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >


              {/* Tone-checker deep extras */}
              {(tool.id === "tone-checker" || tool.id === "intent-detector") && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {result.emotional_signals?.length > 0 && (
                    <div
                      style={{
                        padding: "16px 20px",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 14,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "var(--ink-3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 10,
                        }}
                      >
                        Emotional signals
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 7 }}
                      >
                        {result.emotional_signals.map((s) => (
                          <span
                            key={s}
                            style={{
                              padding: "4px 12px",
                              borderRadius: 20,
                              background: "var(--surface2)",
                              border: "1px solid var(--border2)",
                              color: "var(--ink-2)",
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.what_not_to_do && (
                    <div
                      style={{
                        padding: "14px 18px",
                        background: "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.15)",
                        borderRadius: 14,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "#ef4444",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 6,
                        }}
                      >
                        ⚠ Don't do this
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--ink)",
                          lineHeight: 1.6,
                        }}
                      >
                        {result.what_not_to_do}
                      </p>
                    </div>
                  )}
                  {result.recommended_approach && (
                    <div
                      style={{
                        padding: "14px 18px",
                        background: "rgba(34,197,94,0.05)",
                        border: "1px solid rgba(34,197,94,0.18)",
                        borderRadius: 14,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: "var(--green)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 6,
                        }}
                      >
                        {tool.id === "intent-detector" ? "How to respond" : "Recommended approach"}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--ink)",
                          lineHeight: 1.6,
                        }}
                      >
                        {result.recommended_approach}
                      </p>
                    </div>
                  )}

                  {/* Intent detector: primary/secondary tone as analysis cards */}
                  {tool.id === "intent-detector" && (
                    <>
                      {result.primary_tone && (
                        <div style={{ padding: "14px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
                          <p style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Surface meaning</p>
                          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6 }}>{result.primary_tone}</p>
                        </div>
                      )}
                      {result.secondary_tone && (
                        <div style={{ padding: "14px 18px", background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.18)", borderRadius: 14 }}>
                          <p style={{ fontSize: 10.5, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Real intent</p>
                          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6 }}>{result.secondary_tone}</p>
                        </div>
                      )}
                      {result.subtext && (
                        <div style={{ padding: "14px 18px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 14 }}>
                          <p style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Decoded subtext</p>
                          <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6 }}>{result.subtext}</p>
                        </div>
                      )}
                      {result.urgency && (
                        <div style={{ padding: "10px 16px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Emotional state</span>
                          <span style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>{result.urgency}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Reply variants */}
              {tool.outputVariants && result.replies && (
                <div style={{ marginBottom: 16 }}>
                  <VariantPanel
                    variants={tool.outputVariants}
                    replies={result.replies}
                    activeTab={activeTab}
                    setActiveTab={(v) => setActiveTab(v)}
                    onShare={() => setShowShare(true)}
                    insights={result._replyInsights}
                    descriptors={result._replyDescriptors}
                    recommendedVariant={result._recommendedVariant}
                  />
                </div>
              )}

              {/* Extra tip/do/dont rows */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[result.tip, result.anchoring_tip, result.timing_tip]
                  .filter(Boolean)
                  .map((t, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "14px 18px",
                        background: "rgba(34,197,94,0.05)",
                        border: "1px solid rgba(34,197,94,0.15)",
                        borderRadius: 12,
                        display: "flex",
                        gap: 10,
                      }}
                    >
                      <Lightbulb
                        size={14}
                        color="var(--green)"
                        style={{ flexShrink: 0, marginTop: 2 }}
                      />
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--ink)",
                          lineHeight: 1.6,
                        }}
                      >
                        {t}
                      </p>
                    </div>
                  ))}
                {result.do && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "rgba(34,197,94,0.05)",
                      border: "1px solid rgba(34,197,94,0.15)",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "var(--green)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 5,
                      }}
                    >
                      Do this
                    </p>
                    <p style={{ fontSize: 14, color: "var(--ink)" }}>
                      {result.do}
                    </p>
                  </div>
                )}
                {result.dont && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "rgba(239,68,68,0.05)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#ef4444",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 5,
                      }}
                    >
                      Avoid this
                    </p>
                    <p style={{ fontSize: 14, color: "var(--ink)" }}>
                      {result.dont}
                    </p>
                  </div>
                )}
                {result.follow_up && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "var(--ink-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 5,
                      }}
                    >
                      If they push back
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--ink)",
                        lineHeight: 1.6,
                      }}
                    >
                      {result.follow_up}
                    </p>
                  </div>
                )}
                {result.key_improvements?.length > 0 && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "var(--ink-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 8,
                      }}
                    >
                      Key improvements
                    </p>
                    <ul
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {result.key_improvements.map((k, i) => (
                        <li key={i} style={{ display: "flex", gap: 8 }}>
                          <span
                            style={{
                              color: "var(--green)",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            →
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              color: "var(--ink)",
                              lineHeight: 1.5,
                            }}
                          >
                            {k}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.red_flags && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "rgba(245,158,11,0.06)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#f59e0b",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 5,
                      }}
                    >
                      ⚑ Red flags
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--ink)",
                        lineHeight: 1.6,
                      }}
                    >
                      {result.red_flags}
                    </p>
                  </div>
                )}
                {result.call_to_action && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "rgba(34,197,94,0.05)",
                      border: "1px solid rgba(34,197,94,0.15)",
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "var(--green)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 5,
                      }}
                    >
                      Best CTA
                    </p>
                    <p style={{ fontSize: 14, color: "var(--ink)" }}>
                      {result.call_to_action}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
