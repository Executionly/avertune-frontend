import { useState } from 'react'
import { ArrowLeft, Check, X, Zap, Star, Building2, ChevronDown, ChevronUp } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    desc: 'For trying Avertune out.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'var(--ink-2)',
    badge: null,
    cta: 'Start free',
    ctaStyle: 'ghost',
    features: [
      { text: '5 replies per day', included: true },
      { text: 'All 4 reply styles', included: true },
      { text: 'Tone & risk analysis', included: true },
      { text: 'Reply Generator', included: true },
      { text: 'Tone Checker', included: true },
      { text: 'Improve My Reply', included: false },
      { text: 'Boundary Builder', included: false },
      { text: 'Negotiation Reply', included: false },
      { text: 'Follow-Up Writer', included: false },
      { text: 'Context-aware replies', included: false },
      { text: 'Reply history', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'For people who communicate daily.',
    monthlyPrice: 12,
    yearlyPrice: 8,
    color: 'var(--green)',
    badge: 'Most popular',
    cta: 'Start 7-day trial',
    ctaStyle: 'green',
    features: [
      { text: 'Unlimited replies', included: true },
      { text: 'All 4 reply styles', included: true },
      { text: 'Tone & risk analysis', included: true },
      { text: 'All 6 communication tools', included: true },
      { text: 'Context-aware replies', included: true },
      { text: 'Reply history (30 days)', included: true },
      { text: 'Share insight cards', included: true },
      { text: 'Email & SMS optimization', included: true },
      { text: 'Priority support', included: false },
      { text: 'Team workspace', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    desc: 'For teams who reply together.',
    monthlyPrice: 39,
    yearlyPrice: 29,
    color: 'var(--blue)',
    badge: 'Best value',
    cta: 'Start team trial',
    ctaStyle: 'blue',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Up to 10 team members', included: true },
      { text: 'Shared reply library', included: true },
      { text: 'Team analytics dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom tone settings', included: true },
      { text: 'Onboarding call', included: true },
      { text: 'Unlimited history', included: true },
      { text: 'API access', included: false },
      { text: 'SSO / SAML', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'For large orgs with custom needs.',
    monthlyPrice: null,
    yearlyPrice: null,
    color: '#a78bfa',
    badge: null,
    cta: 'Contact us',
    ctaStyle: 'ghost',
    features: [
      { text: 'Everything in Team', included: true },
      { text: 'Unlimited team members', included: true },
      { text: 'API access & webhooks', included: true },
      { text: 'SSO / SAML', included: true },
      { text: 'Custom AI tone profiles', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantees', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Security review', included: true },
      { text: 'Invoice billing', included: true },
      { text: 'White-label options', included: true },
    ],
  },
]

const FAQS = [
  { q: 'Is the free trial really free?', a: "Yes — no credit card required. You get 7 full days of Pro access. After the trial, you're automatically moved to the free Starter plan unless you choose to upgrade." },
  { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your account settings at any time. You keep access until the end of your billing period — no questions asked.' },
  { q: "What's the difference between monthly and yearly?", a: 'Yearly plans save you about 35%. You pay upfront for 12 months and get a locked-in rate. Monthly plans are flexible and can be cancelled at any time.' },
  { q: 'How does the team plan work?', a: 'One team workspace, billed per workspace. Invite up to 10 members who each get their own account linked to the team. Shared libraries and analytics are accessible to admins.' },
  { q: 'Do unused replies carry over?', a: "On the Starter plan, reply limits reset each day at midnight UTC — unused replies don't carry over. Pro and Team plans have unlimited replies so this doesn't apply." },
  { q: 'What payment methods do you accept?', a: 'All major credit and debit cards via Stripe. Enterprise plans also support bank transfer and invoice billing.' },
]

function PlanCard({ plan, isYearly, onSignup }) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const isPopular = plan.badge === 'Most popular'

  return (
    <div style={{
      background: 'var(--surface)',
      border: `${isPopular ? '2px' : '1px'} solid ${isPopular ? plan.color : 'var(--border)'}`,
      borderRadius: 20,
      padding: 'clamp(22px,3vw,28px)',
      position: 'relative',
      transition: 'transform .2s, box-shadow .2s',
      boxShadow: isPopular ? `0 0 0 1px ${plan.color}20, 0 12px 40px rgba(0,0,0,0.15)` : 'none',
      display: 'flex', flexDirection: 'column',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 56px rgba(0,0,0,0.18)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isPopular ? `0 0 0 1px ${plan.color}20, 0 12px 40px rgba(0,0,0,0.15)` : 'none' }}>

      {/* Badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          padding: '4px 14px', borderRadius: 20,
          background: plan.color, color: '#000',
          fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', whiteSpace: 'nowrap',
        }}>
          {plan.badge}
        </div>
      )}

      {/* Plan name */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)' }}>{plan.name}</span>
          {isPopular && <Zap size={14} color={plan.color} />}
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.4 }}>{plan.desc}</p>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 24, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
        {price === null ? (
          <div>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Custom</span>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Talk to our team</p>
          </div>
        ) : price === 0 ? (
          <div>
            <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Free</span>
            <span style={{ fontSize: 14, color: 'var(--ink-3)', marginLeft: 6 }}>forever</span>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-3)', alignSelf: 'flex-start', marginTop: 8 }}>$</span>
              <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--ink)' }}>{price}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>/mo</span>
            </div>
            {isYearly && (
              <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 3 }}>
                Billed ${price * 12}/year · Save ${(plan.monthlyPrice - price) * 12}/yr
              </p>
            )}
            {!isYearly && (
              <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 3 }}>per month, cancel anytime</p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onSignup}
        style={{
          width: '100%', padding: '11px', borderRadius: 11, fontSize: 14, fontWeight: 700,
          marginBottom: 22, fontFamily: 'inherit', cursor: 'pointer',
          ...(plan.ctaStyle === 'green' ? {
            background: plan.color, color: '#000', border: 'none',
          } : plan.ctaStyle === 'blue' ? {
            background: 'var(--blue)', color: '#000', border: 'none',
          } : {
            background: 'transparent', color: 'var(--ink-2)',
            border: '1.5px solid var(--border2)',
          }),
          transition: 'opacity .15s, transform .12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {plan.cta}
      </button>

      {/* Features */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {plan.features.map(f => (
          <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              background: f.included ? `${plan.color}15` : 'var(--surface2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {f.included
                ? <Check size={10} color={plan.color} strokeWidth={2.5} />
                : <X size={9} color="var(--ink-4)" strokeWidth={2.5} />}
            </div>
            <span style={{ fontSize: 13.5, color: f.included ? 'var(--ink)' : 'var(--ink-4)', lineHeight: 1.3 }}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: `1px solid ${open ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`, borderRadius: 14, background: open ? 'rgba(34,197,94,0.03)' : 'var(--surface)', overflow: 'hidden', transition: 'border-color .2s' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1.4 }}>{item.q}</span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: open ? 'var(--green)' : 'var(--surface2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}>
          {open ? <ChevronUp size={13} color="#000" strokeWidth={2.5} /> : <ChevronDown size={13} color="var(--ink-3)" strokeWidth={2.5} />}
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.7 }}>{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function PricingPage({ onBack, onSignup }) {
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 60, gap: 12 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--ink-3)', fontSize: 13, transition: 'color .15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-3)'}>
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,var(--green),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em', color: 'var(--ink)' }}>Avertune</span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--ink-4)' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Pricing</span>
        </div>
      </header>

      <div className="container" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 80 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 18 }}>
            <Star size={12} color="var(--green)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>Simple, transparent pricing</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 14 }}>
            Reply with confidence.<br /><span style={{ background: 'linear-gradient(135deg,var(--green),var(--teal))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>At every level.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'var(--ink-3)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.65 }}>
            Start free, no card required. Upgrade when you're ready to communicate at a higher level.
          </p>

          {/* Monthly / Yearly toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '5px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <button onClick={() => setIsYearly(false)} style={{
              padding: '7px 18px', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
              background: !isYearly ? 'var(--surface2)' : 'transparent',
              color: !isYearly ? 'var(--ink)' : 'var(--ink-3)',
              transition: 'all .15s',
              boxShadow: !isYearly ? '0 1px 6px rgba(0,0,0,0.15)' : 'none',
            }}>Monthly</button>
            <button onClick={() => setIsYearly(true)} style={{
              padding: '7px 18px', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer',
              background: isYearly ? 'var(--surface2)' : 'transparent',
              color: isYearly ? 'var(--ink)' : 'var(--ink-3)',
              transition: 'all .15s',
              boxShadow: isYearly ? '0 1px 6px rgba(0,0,0,0.15)' : 'none',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              Yearly
              <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: 'var(--green)', color: '#000' }}>Save 35%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: 16, marginBottom: 'clamp(60px,8vw,96px)', alignItems: 'start' }}>
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} isYearly={isYearly} onSignup={onSignup} />
          ))}
        </div>

        {/* Social proof strip */}
        <div style={{ textAlign: 'center', padding: 'clamp(28px,4vw,40px) 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 'clamp(60px,8vw,96px)' }}>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>Trusted by 12,000+ professionals</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,4vw,48px)', flexWrap: 'wrap' }}>
            {[
              { val: '2.4M+',   label: 'Replies generated' },
              { val: '98%',     label: 'Satisfaction rate' },
              { val: '< 10s',   label: 'Average reply time' },
              { val: '7-day',   label: 'Free trial, no card' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--green)', marginBottom: 3 }}>{s.val}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise callout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 16, marginBottom: 'clamp(60px,8vw,96px)', alignItems: 'center' }}>
          <div style={{ padding: 'clamp(24px,4vw,36px)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Building2 size={18} color="var(--ink-2)" />
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' }}>Built for enterprise teams</h3>
            </div>
            <p style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 20 }}>
              Custom AI communication profiles, SSO, API access, dedicated support, and SLA guarantees — built around your team's workflow.
            </p>
            <button className="btn-ghost" style={{ padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
              Talk to our team →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['SOC 2 Type II compliant', 'GDPR-ready data handling', 'No data used for training', 'SSO & SAML support', 'Custom onboarding & training'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={10} color="var(--green)" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, letterSpacing: '-0.04em', textAlign: 'center', marginBottom: 36 }}>
            Pricing FAQs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map(f => <FAQItem key={f.q} item={f} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
