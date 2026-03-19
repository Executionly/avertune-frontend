import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
const FAQS = [
  { q: 'How does Avertune work?', a: 'Avertune uses a two-stage AI pipeline. First it analyzes the incoming message for tone, intent, and risk. Then it generates four strategically distinct reply options — Balanced, Firm, Warm, and Strategic Delay.' },
  { q: 'What is the weekly pass?', a: 'Full access to all Avertune tools for 7 days at a flat rate. Ideal for one-off high-stakes situations or trying the platform before committing monthly.' },
  { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade, downgrade, or cancel at any time from your account settings. Changes take effect at the start of your next billing cycle.' },
  { q: 'What happens if I hit my reply limit?', a: 'Upgrade instantly or purchase a top-up. Your existing history, saved replies, and analysis remain fully accessible regardless.' },
  { q: 'Is my data private?', a: 'Messages are processed in real time and never stored. We do not train on your conversations and never share data with third parties. Your privacy is our baseline.' },
]
export default function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" style={{ padding: 'clamp(64px,8vw,96px) 0', background: 'var(--bg2)' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,5vw,56px)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ border: `1px solid ${isOpen ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`, borderRadius: 13, background: isOpen ? 'rgba(34,197,94,0.04)' : 'var(--surface)', overflow: 'hidden', transition: 'border-color 0.2s,background 0.2s' }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: '100%', padding: 'clamp(14px,2vw,18px) clamp(16px,2.5vw,22px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 'clamp(14px,1.8vw,15.5px)', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1.4 }}>{f.q}</span>
                  <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: isOpen ? 'var(--green)' : 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                    {isOpen ? <Minus size={13} color="#000" strokeWidth={2.5} /> : <Plus size={13} color="var(--ink-3)" strokeWidth={2.5} />}
                  </div>
                </button>
                {isOpen && <div style={{ padding: '0 clamp(16px,2.5vw,22px) clamp(14px,2vw,20px)', animation: 'fadeIn 0.2s ease' }}>
                  <p style={{ fontSize: 'clamp(13px,1.6vw,14.5px)', color: 'var(--ink-3)', lineHeight: 1.7 }}>{f.a}</p>
                </div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
