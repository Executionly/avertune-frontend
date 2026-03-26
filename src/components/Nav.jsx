import { useState, useRef, useEffect } from 'react'
import { Menu, X, Sun, Moon, Monitor, Activity, MessageSquare, ShieldCheck, Swords, Clock, User, LogOut } from 'lucide-react'
import { useTheme } from '../ThemeContext.jsx'
import { useAuth } from '../AuthContext.jsx'

const TOOLS = [
  { icon: Activity,      label: 'Tone Checker',     slug: 'tone-checker' },
  { icon: MessageSquare, label: 'Reply Generator',   slug: 'reply-generator' },
  { icon: ShieldCheck,   label: 'Boundaries',        slug: 'boundary-builder' },
  { icon: Swords,        label: 'Negotiation',       slug: 'negotiation-reply' },
  { icon: Clock,         label: 'Follow-Up',         slug: 'follow-up-writer' },
  { icon: Clock,         label: 'Difficult Email',   slug: 'difficult-email' },
  { icon: Clock,         label: 'Intent Detector',   slug: 'intent-detector' },
]

const THEME_OPTS = [
  { id: 'light',  Icon: Sun,     label: 'Light' },
  { id: 'dark',   Icon: Moon,    label: 'Dark' },
  { id: 'system', Icon: Monitor, label: 'System' },
]

function useClickOutside(ref, fn) {
  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) fn() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
}

function ThemePicker() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useClickOutside(ref, () => setOpen(false))
  const cur = THEME_OPTS.find(t => t.id === theme) || THEME_OPTS[2]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} title="Theme" style={{
        width: 34, height: 34, borderRadius: 8,
        border: '1px solid var(--border2)',
        background: open ? 'var(--surface2)' : 'transparent',
        color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)' }}
      onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' } }}>
        <cur.Icon size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'var(--surface)', border: '1px solid var(--border2)',
          borderRadius: 12, padding: 5, minWidth: 136,
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
          animation: 'slideDown 0.18s ease both', zIndex: 300,
        }}>
          {THEME_OPTS.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => { setTheme(id); setOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              width: '100%', padding: '8px 12px', borderRadius: 8,
              background: theme === id ? 'var(--surface2)' : 'transparent',
              color: theme === id ? 'var(--ink)' : 'var(--ink-2)',
              fontSize: 13.5, fontWeight: theme === id ? 600 : 400,
              transition: 'background .12s', textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={e => { if (theme !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' } }}>
              <Icon size={13} /> {label}
              {theme === id && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu({ onDashboard }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useClickOutside(ref, () => setOpen(false))

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User'
  const displayInitial = displayName[0].toUpperCase()
  const planTier = user?.plan_tier || 'free'
  const displayPlan = planTier.charAt(0).toUpperCase() + planTier.slice(1)
  const repliesRemaining = user?.replies_remaining ?? user?.limit_today ?? 5

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 10px 5px 6px', borderRadius: 10,
        border: '1px solid var(--border2)',
        background: open ? 'var(--surface2)' : 'transparent',
        transition: 'all .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--green), var(--teal))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#000' }}>
            {displayInitial}
          </span>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{displayName}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'var(--surface)', border: '1px solid var(--border2)',
          borderRadius: 14, padding: 6, minWidth: 200,
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
          animation: 'slideDown 0.18s ease both', zIndex: 300,
        }}>
          <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{displayName}</p>
            <p style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{user?.email}</p>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>{displayPlan}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>· {repliesRemaining} replies left today</span>
            </div>
          </div>
          <button onClick={() => { onDashboard(); setOpen(false) }} style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            padding: '9px 12px', borderRadius: 9,
            background: 'transparent', color: 'var(--ink-2)',
            fontSize: 13.5, fontWeight: 500, textAlign: 'left',
            transition: 'background .12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' }}>
            <User size={14} /> Dashboard
          </button>
          <button onClick={() => { logout(); setOpen(false) }} style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            padding: '9px 12px', borderRadius: 9,
            background: 'transparent', color: 'var(--ink-2)',
            fontSize: 13.5, fontWeight: 500, textAlign: 'left',
            transition: 'background .12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Nav({ onLogin, onSignup, onDashboard, onTool, onPricing }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  function handleTool(slug) {
    setMenuOpen(false)
    if (user) { onTool(slug) } else { onLogin() }
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', height: 62,
        justifyContent: 'space-between', gap: 12,
      }}>
        {/* Logo */}
        <button onClick={() => { setMenuOpen(false); window.scrollTo(0,0) }} style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg,var(--green) 0%,var(--teal) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em', color: 'var(--ink)' }}>Avertune</span>
        </button>

        {/* ── Inline tools strip (desktop) ── */}
        <nav className="hide-md" style={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'center' }}>
          {TOOLS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.slug} onClick={() => handleTool(t.slug)} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 11px', borderRadius: 8,
                background: 'transparent', color: 'var(--ink-3)',
                fontSize: 13, fontWeight: 500,
                transition: 'background .15s, color .15s',
                whiteSpace: 'nowrap', fontFamily: 'inherit', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-3)' }}>
                <Icon size={13} strokeWidth={1.8} />
                {t.label}
              </button>
            )
          })}
          <button onClick={onPricing} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 11px', borderRadius: 8,
            background: 'transparent', color: 'var(--ink-3)',
            fontSize: 13, fontWeight: 500,
            transition: 'background .15s, color .15s',
            whiteSpace: 'nowrap', fontFamily: 'inherit', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-3)' }}>
            Pricing
          </button>
        </nav>

        {/* Right actions */}
        <div className="hide-md" style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <ThemePicker />
          {user ? (
            <UserMenu onDashboard={onDashboard} />
          ) : (
            <>
              <button onClick={onLogin} className="btn-ghost" style={{ padding: '7px 15px', borderRadius: 8, fontSize: 13.5 }}>Log in</button>
              <button onClick={onSignup} className="btn-green" style={{ padding: '7px 17px', borderRadius: 8, fontSize: 13.5 }}>Start Free Trial</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="show-md" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemePicker />
          <button onClick={() => setMenuOpen(o => !o)} style={{ color: 'var(--ink)', padding: 4, marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)', background: 'var(--bg2)',
          padding: '16px 20px 24px', animation: 'slideDown 0.2s ease both',
        }} className="show-md">
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Tools</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {TOOLS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.slug} onClick={() => handleTool(t.slug)} style={{
                  padding: '9px 11px', borderRadius: 10,
                  border: '1px solid var(--border)', background: 'var(--surface)',
                  display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left',
                }}>
                  <Icon size={13} color="var(--green)" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{t.label}</span>
                </button>
              )
            })}
          </div>
          <button onClick={() => { onPricing(); setMenuOpen(false) }} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', fontFamily: 'inherit', cursor: 'pointer', marginBottom: 12, textAlign: 'left' }}>
            Pricing
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {user ? (
              <>
                <button onClick={() => { onDashboard(); setMenuOpen(false) }} className="btn-ghost" style={{ flex: 1, padding: '11px', borderRadius: 9, fontSize: 14 }}>Dashboard</button>
                <button onClick={() => { logout(); setMenuOpen(false) }} className="btn-ghost" style={{ flex: 1, padding: '11px', borderRadius: 9, fontSize: 14 }}>Sign out</button>
              </>
            ) : (
              <>
                <button onClick={() => { onLogin(); setMenuOpen(false) }} className="btn-ghost" style={{ flex: 1, padding: '11px', borderRadius: 9, fontSize: 14 }}>Log in</button>
                <button onClick={() => { onSignup(); setMenuOpen(false) }} className="btn-green" style={{ flex: 1, padding: '11px', borderRadius: 9, fontSize: 14 }}>Sign up</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
