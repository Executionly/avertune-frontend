import { useNavigate } from 'react-router-dom'

export function CTA({ onSignup }) {
  return (
    <section style={{ padding: 'clamp(64px,8vw,96px) 0', background: 'var(--bg)', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 28px', background: 'conic-gradient(from 0deg,var(--green),var(--teal),var(--blue),var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M3 13h20M13 3l10 10L13 23" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <h2 style={{ fontSize: 'clamp(30px,5vw,56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 28 }}>
          Ready to reply with<br /><span className="grad-text">confidence?</span>
        </h2>
        <button onClick={onSignup} className="btn-green" style={{ padding: 'clamp(12px,1.8vw,15px) clamp(28px,4vw,40px)', borderRadius: 13, fontSize: 'clamp(14px,1.8vw,16px)', display: 'block', margin: '0 auto 14px', fontFamily: 'inherit', cursor: 'pointer' }}>
          Start Free Trial
        </button>
        <p style={{ fontSize: 13, color: 'var(--ink-4)' }}>7 days free. No credit card required.</p>
      </div>
    </section>
  )
}

export function Footer({ onPricing }) {
  const navigate = useNavigate()
  const cols = [
    { label: 'Product', links: [
      { label: 'How it works', onClick: null },
      { label: 'Pricing',      onClick: () => (onPricing ? onPricing() : navigate('/pricing')) },
      { label: 'FAQ',          onClick: null },
    ]},
    { label: 'Tools', links: [
      { label: 'Reply Generator',  onClick: null },
      { label: 'Tone Checker',     onClick: null },
      { label: 'Improve Reply',    onClick: null },
      { label: 'Boundary Builder', onClick: null },
    ]},
    { label: 'Legal', links: [
      { label: 'Privacy policy',  onClick: null },
      { label: 'Terms of service',onClick: null },
      { label: 'Responsible use', onClick: null },
      { label: 'Support',         onClick: null },
    ]},
  ]
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: 'clamp(40px,5vw,56px) 0 28px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 'clamp(24px,4vw,40px)', marginBottom: 'clamp(32px,4vw,48px)' }}>
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,var(--green),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--ink)' }}>Avertune</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>Respond with clarity.<br />Every time.</p>
          </div>
          {cols.map(col => (
            <div key={col.label}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{col.label}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <button
                      onClick={l.onClick || undefined}
                      style={{ fontSize: 13.5, color: 'var(--ink-3)', transition: 'color 0.15s', background: 'none', border: 'none', fontFamily: 'inherit', cursor: l.onClick ? 'pointer' : 'default', padding: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color='var(--ink)'}
                      onMouseLeave={e => e.currentTarget.style.color='var(--ink-3)'}>
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>© 2026 Avertune. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 18 }}>
            {['Privacy Policy', 'Terms of Use'].map(l => (
              <button key={l} style={{ fontSize: 12.5, color: 'var(--ink-4)', transition: 'color 0.15s', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color='var(--ink)'} onMouseLeave={e => e.currentTarget.style.color='var(--ink-4)'}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
