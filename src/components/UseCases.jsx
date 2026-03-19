import { Handshake, Mail, Shield, Headphones, Heart, GraduationCap } from 'lucide-react'
const cases = [
  { icon: Handshake,    title: 'Sales Outreach',       desc: 'Respond to objections and close deals with confidence.',       color: 'var(--green)' },
  { icon: Shield,       title: 'Negotiation',           desc: 'Protect your position while keeping conversations productive.', color: 'var(--teal)' },
  { icon: Heart,        title: 'Dating & Relationships',desc: 'Respond naturally without overthinking every message.',         color: 'var(--blue)' },
  { icon: Mail,         title: 'Professional Emails',   desc: 'Write clear, polished workplace replies.',                     color: 'var(--green)' },
  { icon: Headphones,   title: 'Customer Support',      desc: 'Resolve complaints calmly and clearly.',                       color: 'var(--teal)' },
  { icon: GraduationCap,title: 'Academic & Formal',     desc: 'Write structured responses when clarity matters.',             color: 'var(--blue)' },
]
export default function UseCases() {
  return (
    <section style={{ padding: 'clamp(64px,8vw,96px) 0', background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,5vw,56px)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Use cases</p>
          <h2 style={{ fontSize: 'clamp(26px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 12 }}>One tool for every conversation.</h2>
          <p style={{ fontSize: 'clamp(14px,1.8vw,16px)', color: 'var(--ink-3)', maxWidth: 400, margin: '0 auto' }}>Avertune adapts to any communication challenge you face.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 'clamp(10px,1.5vw,16px)' }}>
          {cases.map(c => {
            const Icon = c.icon
            return (
              <div key={c.title} style={{ padding: 'clamp(20px,2.5vw,26px)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}12`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={17} color={c.color} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 7, color: 'var(--ink)' }}>{c.title}</h3>
                <p style={{ fontSize: 'clamp(12.5px,1.4vw,13.5px)', color: 'var(--ink-3)', lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
