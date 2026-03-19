import { useState, useEffect, useRef } from 'react'

const DATA = {
  Companies: [
    { q: 'Avertune helped me respond to a tense email without escalating the situation.', name: 'Sarah K.', role: 'Product Manager' },
    { q: 'I used to spend 20 minutes drafting replies. Now it takes seconds.', name: 'Marcus D.', role: 'Founder' },
    { q: 'The tone analysis alone is worth it. I finally understand what people actually mean.', name: 'Priya T.', role: 'Sales Lead' },
  ],
  Universities: [
    { q: "Writing emails to professors used to stress me out. Avertune changed that completely.", name: 'James L.', role: 'Graduate Student' },
    { q: "Keeps my communication professional even when I'm overwhelmed with deadlines.", name: 'Sofia R.', role: 'PhD Candidate' },
    { q: 'The Boundary Builder tool changed how I handle difficult situations.', name: 'Arjun M.', role: 'Research Assistant' },
  ],
  Teams: [
    { q: 'We use Avertune across our entire support team. Response quality doubled.', name: 'Claire B.', role: 'Support Manager' },
    { q: 'Onboarding new reps is faster when they have Avertune helping them.', name: 'David P.', role: 'Team Lead' },
    { q: "Fewer escalations, happier customers. That's what Avertune gave us.", name: 'Lena V.', role: 'Operations Director' },
  ],
}

const COLORS = ['var(--green)', 'var(--teal)', 'var(--blue)']
const TABS = Object.keys(DATA)
const TAB_DURATION = 5000 // ms before auto-advancing

export default function Testimonials() {
  const [tabIdx, setTabIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(null)
  const startRef = useRef(null)
  const pausedRef = useRef(false)

  const tab = TABS[tabIdx]

  function goTo(idx) {
    setTabIdx(idx)
    setProgress(0)
    startRef.current = performance.now()
  }

  // Animate progress bar and auto-advance
  useEffect(() => {
    startRef.current = performance.now()
    pausedRef.current = false

    function tick(now) {
      if (pausedRef.current) { progressRef.current = requestAnimationFrame(tick); return }
      const elapsed = now - startRef.current
      const pct = Math.min((elapsed / TAB_DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick)
      } else {
        setTabIdx(i => (i + 1) % TABS.length)
        setProgress(0)
      }
    }

    progressRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(progressRef.current)
  }, [tabIdx])

  return (
    <section style={{ padding: 'clamp(64px,8vw,96px) 0', background: 'var(--bg)' }}>
      <div className="container">

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 1,
          marginBottom: 'clamp(48px,6vw,72px)',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {[{val:'12,000+',label:'Professionals'},{val:'2.4M+',label:'Replies generated'},{val:'98%',label:'Satisfaction rate'}].map((s,i) => (
            <div key={s.label} style={{ background: 'var(--surface)', padding: 'clamp(20px,3vw,28px)', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-0.04em', color: COLORS[i], marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 'clamp(12px,1.4vw,13.5px)', color: 'var(--ink-3)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Trusted by professionals<br />and creators worldwide.
          </h2>
        </div>

        {/* Tab switcher with progress bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'flex', gap: 6, padding: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14,
          }}>
            {TABS.map((t, i) => {
              const isActive = i === tabIdx
              return (
                <button
                  key={t}
                  onClick={() => goTo(i)}
                  style={{
                    position: 'relative',
                    padding: 'clamp(7px,1vw,9px) clamp(16px,2vw,22px)',
                    borderRadius: 9,
                    fontFamily: 'inherit', fontWeight: 600,
                    fontSize: 'clamp(12px,1.5vw,14px)',
                    border: 'none', cursor: 'pointer',
                    background: isActive ? 'var(--surface2)' : 'transparent',
                    color: isActive ? 'var(--ink)' : 'var(--ink-3)',
                    transition: 'background 0.2s, color 0.2s',
                    overflow: 'hidden',
                    boxShadow: isActive ? '0 1px 8px rgba(0,0,0,0.18)' : 'none',
                  }}
                  onMouseEnter={e => { pausedRef.current = true }}
                  onMouseLeave={e => {
                    if (i === tabIdx) {
                      pausedRef.current = false
                      // reset timer so hover doesn't cut short
                      startRef.current = performance.now() - (progress / 100) * TAB_DURATION
                    }
                  }}
                >
                  {t}
                  {/* Progress fill at bottom of active tab */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0,
                      height: 2, borderRadius: 1,
                      width: `${progress}%`,
                      background: COLORS[i % 3],
                      transition: 'width 0.05s linear',
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Cards — animate on tab change */}
        <div
          key={tab}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))',
            gap: 'clamp(10px,1.5vw,16px)',
            animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >
          {DATA[tab].map((t, i) => (
            <div
              key={i}
              style={{
                padding: 'clamp(20px,2.5vw,26px)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16,
                transition: 'border-color 0.2s, transform 0.2s',
                animationDelay: `${i * 0.06}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = COLORS[i % 3]
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array(5).fill(0).map((_,si) => (
                  <svg key={si} width="13" height="13" viewBox="0 0 13 13" fill={COLORS[i % 3]}>
                    <path d="M6.5 1l1.4 3 3.1.48-2.25 2.3.53 3.26L6.5 8.42l-2.78 1.62.53-3.26L2 4.48 5.1 4z"/>
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 'clamp(13px,1.5vw,14.5px)', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: 18 }}>
                "{t.q}"
              </p>
              <div>
                <p style={{ fontWeight: 700, fontSize: 'clamp(12px,1.4vw,13.5px)', color: 'var(--ink)' }}>{t.name}</p>
                <p style={{ fontSize: 'clamp(11.5px,1.3vw,12.5px)', color: 'var(--ink-4)', marginTop: 2 }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 }}>
          {TABS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === tabIdx ? 20 : 6, height: 6, borderRadius: 3,
              background: i === tabIdx ? COLORS[i % 3] : 'var(--surface3)',
              border: 'none', cursor: 'pointer',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}
        </div>

      </div>
    </section>
  )
}
