import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
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
import { useState } from 'react'

// ── Protected route ───────────────────────────────────────────────────────────
function Protected({ children }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()
  if (authLoading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// ── Tool page wrapper ─────────────────────────────────────────────────────────
function ToolPageWrapper() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const tool = TOOL_CONFIGS[slug]
  if (!tool) return <Navigate to="/dashboard" replace />
  return (
    <ToolPage
      tool={tool}
      onBack={() => navigate('/dashboard')}
      onLogin={() => navigate('/login')}
      onTool={s => { window.scrollTo(0, 0); navigate(`/tool/${s}`) }}
    />
  )
}

// ── Landing ───────────────────────────────────────────────────────────────────
function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <HeroDemo onSignup={() => navigate('/signup')} />
      <div className="hr" />
      <HowItWorks />
      <div className="hr" />
      <UseCases />
      <div className="hr" />
      <Tools
        onTool={slug => { window.scrollTo(0, 0); navigate(user ? `/tool/${slug}` : '/login') }}
        onSignup={() => navigate('/signup')}
      />
      <div className="hr" />
      <Testimonials />
      <div className="hr" />
      <FAQ />
      <div className="hr" />
      <CTA onSignup={() => navigate('/signup')} />
      <Footer onPricing={() => { window.scrollTo(0, 0); navigate('/pricing') }} />
    </div>
  )
}

// ── Email sent state — lives here since it's transient between pages ──────────
let _emailSentMeta = { email: '', kind: 'confirmation', message: null }

function SignupWrapper() {
  const navigate = useNavigate()
  return (
    <SignupPage
      onSuccess={({ email, message } = {}) => {
        _emailSentMeta = { email, kind: 'confirmation', message: message || null }
        navigate('/email-sent')
      }}
    />
  )
}

function ForgotWrapper() {
  const navigate = useNavigate()
  return (
    <ForgotPasswordPage
      onSuccess={({ email, message } = {}) => {
        _emailSentMeta = { email, kind: 'reset', message: message || null }
        navigate('/email-sent')
      }}
    />
  )
}

function EmailSentWrapper() {
  return (
    <EmailSentPage
      email={_emailSentMeta.email}
      kind={_emailSentMeta.kind}
      backendMessage={_emailSentMeta.message}
    />
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupWrapper />} />
      <Route path="/forgot-password" element={<ForgotWrapper />} />
      <Route path="/email-sent" element={<EmailSentWrapper />} />
      <Route path="/link-expired" element={<LinkAlreadyUsedPage />} />
      <Route path="/account-confirmed" element={<AccountConfirmedPage />} />

      {/* Auth callbacks */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/api/auth/google/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/tool/:slug" element={<Protected><ToolPageWrapper /></Protected>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
