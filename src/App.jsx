import { useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'
import { TOOL_CONFIGS } from './toolConfigs.js'
import Nav from './components/Nav.jsx'
import HeroDemo from './components/HeroDemo.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import UseCases from './components/UseCases.jsx'
import Tools from './components/Tools.jsx'
import Testimonials from './components/Testimonials.jsx'
import FAQ from './components/FAQ.jsx'
import { CTA, Footer } from './components/CtaFooter.jsx'
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  EmailSentPage,
  AuthCallbackPage,
  ResetPasswordPage,
  LinkAlreadyUsedPage,
  AccountConfirmedPage,
} from './components/AuthPages.jsx'
import Dashboard from './components/Dashboard.jsx'
import ToolPage from './components/ToolPage.jsx'
import PricingPage from './components/PricingPage.jsx'

export default function App() {
  const { user } = useAuth()

  // Detect ?auth=link-expired redirect from /auth/reset-password
  const searchParams = new URLSearchParams(window.location.search)
  const authParam = searchParams.get('auth')

  const [view, setView] = useState(
    authParam === 'link-expired' ? 'link-already-used' : 'landing'
  )
  const [emailSentMeta, setEmailSentMeta] = useState({ email: '', kind: 'confirmation', message: null })

  const path = window.location.pathname

  // ── URL-based routes (email callback, password reset) ─────────────────────
  if (path === '/auth/callback' || path === '/api/auth/google/callback') return <AuthCallbackPage />

  if (path === '/auth/reset-password')
    return (
      <ResetPasswordPage
        onSuccess={() => (window.location.href = '/')}
        onLinkInvalid={() => (window.location.href = '/?auth=link-expired')}
      />
    )

  // ── Navigation helpers ────────────────────────────────────────────────────
  function goTool(slug) {
    window.scrollTo(0, 0)
    setView({ type: 'tool', slug })
  }

  function goBack() {
    window.scrollTo(0, 0)
    setView(user ? 'dashboard' : 'landing')
  }

  // ── Auth views ────────────────────────────────────────────────────────────
  if (view === 'login')
    return (
      <LoginPage
        onBack={() => setView('landing')}
        onSwitchToSignup={() => setView('signup')}
        onForgotPassword={() => setView('forgot-password')}
        onSuccess={() => {
          window.scrollTo(0, 0)
          setView('dashboard')
        }}
      />
    )

  if (view === 'signup')
    return (
      <SignupPage
        onBack={() => setView('landing')}
        onSwitchToLogin={() => setView('login')}
        onSuccess={({ email, message } = {}) => {
          setEmailSentMeta({ email, kind: 'confirmation', message: message || null })
          setView('email-sent')
        }}
      />
    )

  if (view === 'forgot-password')
    return (
      <ForgotPasswordPage
        onBack={() => setView('login')}
        onSuccess={({ email, message } = {}) => {
          setEmailSentMeta({ email, kind: 'reset', message: message || null })
          setView('email-sent')
        }}
      />
    )

  if (view === 'email-sent')
    return (
      <EmailSentPage
        email={emailSentMeta.email}
        kind={emailSentMeta.kind}
        backendMessage={emailSentMeta.message}
        onBack={() => setView('login')}
      />
    )

  if (view === 'link-already-used')
    return (
      <LinkAlreadyUsedPage
        onBack={() => setView('forgot-password')}
      />
    )

  if (view === 'account-confirmed')
    return (
      <AccountConfirmedPage
        onLogin={() => setView('login')}
      />
    )

  // ── Dashboard ─────────────────────────────────────────────────────────────
  if (view === 'dashboard')
    return (
      <Dashboard
        onBack={() => { window.scrollTo(0, 0); setView('landing') }}
        onTool={goTool}
        onPricing={() => { window.scrollTo(0, 0); setView('pricing') }}
      />
    )

  // ── Tool pages ────────────────────────────────────────────────────────────
  if (view?.type === 'tool') {
    const tool = TOOL_CONFIGS[view.slug]
    if (!tool) { setView('landing'); return null }
    return (
      <ToolPage
        tool={tool}
        onBack={goBack}
        onLogin={() => setView('login')}
        onTool={goTool}
      />
    )
  }

  // ── Pricing ───────────────────────────────────────────────────────────────
  if (view === 'pricing')
    return (
      <PricingPage
        onBack={() => { window.scrollTo(0, 0); setView('landing') }}
        onSignup={() => setView('signup')}
      />
    )

  // ── Landing ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav
        onLogin={() => setView('login')}
        onSignup={() => setView('signup')}
        onDashboard={() => { window.scrollTo(0, 0); setView(user ? 'dashboard' : 'login') }}
        onTool={goTool}
        onPricing={() => { window.scrollTo(0, 0); setView('pricing') }}
      />
      <HeroDemo onSignup={() => setView('signup')} />
      <div className="hr" />
      <HowItWorks />
      <div className="hr" />
      <UseCases />
      <div className="hr" />
      <Tools onTool={goTool} onSignup={() => setView('signup')} />
      <div className="hr" />
      <Testimonials />
      <div className="hr" />
      <FAQ />
      <div className="hr" />
      <CTA onSignup={() => setView('signup')} />
      <Footer
        onPricing={() => { window.scrollTo(0, 0); setView('pricing') }}
      />
    </div>
  )
}
