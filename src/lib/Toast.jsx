import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, AlertTriangle, X, Info, Zap } from 'lucide-react'

const ToastCtx = createContext(null)

let _toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
  }, [])

  const toast = useCallback(({ type = 'info', message, duration = 4500 }) => {
    const id = ++_toastId
    setToasts(prev => [...prev.slice(-4), { id, type, message, leaving: false }])
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const success = useCallback((message, opts) => toast({ type: 'success', message, ...opts }), [toast])
  const error   = useCallback((message, opts) => toast({ type: 'error',   message, duration: 6000, ...opts }), [toast])
  const warning = useCallback((message, opts) => toast({ type: 'warning', message, ...opts }), [toast])
  const info    = useCallback((message, opts) => toast({ type: 'info',    message, ...opts }), [toast])

  return (
    <ToastCtx.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

// ── Config per type ────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    color: 'var(--green)',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.25)',
    bar: 'var(--green)',
  },
  error: {
    icon: AlertTriangle,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.25)',
    bar: '#ef4444',
  },
  warning: {
    icon: AlertTriangle,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.25)',
    bar: '#f59e0b',
  },
  info: {
    icon: Info,
    color: 'var(--blue)',
    bg: 'rgba(56,189,248,0.10)',
    border: 'rgba(56,189,248,0.25)',
    bar: 'var(--blue)',
  },
}

// ── Single toast ───────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info
  const Icon = cfg.icon

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '13px 14px',
        borderRadius: 14,
        background: 'var(--surface)',
        border: `1px solid ${cfg.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16)',
        minWidth: 280,
        maxWidth: 380,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        animation: toast.leaving
          ? 'toast-out 0.32s cubic-bezier(0.4,0,1,1) both'
          : 'toast-in 0.38s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      {/* colour bar on left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 3, background: cfg.bar, borderRadius: '14px 0 0 14px',
      }} />

      {/* icon */}
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: 4,
      }}>
        <Icon size={15} style={{ color: cfg.color }} />
      </div>

      {/* message */}
      <p style={{
        flex: 1, fontSize: 13.5, color: 'var(--ink)',
        lineHeight: 1.55, fontWeight: 500, paddingTop: 5,
      }}>
        {toast.message}
      </p>

      {/* dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          color: 'var(--ink-4)', background: 'none', border: 'none',
          cursor: 'pointer', padding: 4, borderRadius: 6,
          flexShrink: 0, marginTop: 2, transition: 'color .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-4)'}
      >
        <X size={13} />
      </button>
    </div>
  )
}

// ── Stack ──────────────────────────────────────────────────────────────────────
function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity:0; transform:translateY(16px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes toast-out {
          from { opacity:1; transform:translateY(0)    scale(1);    }
          to   { opacity:0; transform:translateY(8px)  scale(0.95); }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <Toast toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </>
  )
}
