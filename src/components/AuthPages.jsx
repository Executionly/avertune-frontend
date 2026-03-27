import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowLeft, Loader2, Mail, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { useAuth } from '../AuthContext.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApiMessage, ApiMessage } from '../lib/useApiMessage.jsx'
import { STORAGE } from '../lib/apiClient.js'
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../lib/authSchemas.js'

// ─── Design primitives ────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'center', marginBottom: 36 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 11,
        background: 'linear-gradient(135deg,var(--green) 0%,var(--teal) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 20px rgba(34,197,94,0.3)',
      }}>
        <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.04em', color: 'var(--ink)' }}>Avertune</span>
    </div>
  )
}

function Field({ label, type = 'text', registration, error, placeholder, autoFocus }) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)
  const isPassword = type === 'password'
  const { onBlur: rhfOnBlur, ...restReg } = registration || {}

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, letterSpacing: '-0.01em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          {...restReg}
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); rhfOnBlur?.(e) }}
          style={{
            width: '100%',
            padding: isPassword ? '12px 42px 12px 14px' : '12px 14px',
            borderRadius: 11,
            border: `1.5px solid ${error ? '#ef4444' : focused ? 'var(--green)' : 'var(--border2)'}`,
            background: 'var(--surface2)',
            color: 'var(--ink)',
            fontSize: 15,
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color .2s, box-shadow .2s',
            boxShadow: focused && !error ? '0 0 0 3px rgba(34,197,94,0.1)' : 'none',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--ink-3)', transition: 'color .15s', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 5 }}>{error}</p>}
    </div>
  )
}

// ErrorBox replaced by <ApiMessage> from useApiMessage.js

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 12, color: 'var(--ink-4)', fontWeight: 500 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

function GoogleBtn({ onClick }) {
  const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
  return (
    <button type="button" onClick={onClick} style={{
      width: '100%', padding: '10px 16px', borderRadius: 10,
      border: '1.5px solid var(--border2)', background: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      fontFamily: 'inherit', fontWeight: 600, fontSize: 14, color: 'var(--ink-2)',
      cursor: 'pointer', transition: 'all .15s', marginBottom: 10,
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--ink)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)' }}>
      <GoogleIcon /> Continue with Google
    </button>
  )
}

function SubmitBtn({ loading, label, loadingLabel }) {
  return (
    <button type="submit" disabled={loading} className="btn-green" style={{ width: '100%', padding: 13, borderRadius: 12, fontWeight: 700, gap: 8, fontSize: 15, opacity: loading ? 0.75 : 1 }}>
      {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> {loadingLabel}</> : label}
    </button>
  )
}

function Card({ children }) {
  return (
    <div style={{ width: '100%', maxWidth: 400, background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 22, padding: 'clamp(24px,5vw,34px)', boxShadow: '0 24px 80px rgba(0,0,0,0.16)' }}>
      {children}
    </div>
  )
}

function PageShell({ onBack, children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      {onBack && (
        <button onClick={onBack} style={{ position: 'fixed', top: 24, left: 24, color: 'var(--ink-3)', fontSize: 13.5, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={15} /> Back
        </button>
      )}
      {children}
    </div>
  )
}

// ─── Login page ───────────────────────────────────────────────────────────────

export function LoginPage() {
  const { login, googleSignIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const msg = useApiMessage()
  const from = location.state?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit(values) {
    msg.clear()
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (err) {
      msg.setFromError(err)
    }
  }

  return (
    <PageShell onBack={() => navigate('/')}>
      <Card>
        <Logo />
        <h1 style={{ fontSize: 26, marginBottom: 6, textAlign: 'center' }}>Welcome back</h1>
        <p style={{ textAlign: 'center', color: 'var(--ink-3)', marginBottom: 22 }}>Log in to continue.</p>

        <GoogleBtn onClick={googleSignIn} />
        <Divider label="or continue with email" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoFocus
            registration={register('email')}
            error={errors.email?.message}
          />
          <Field
            label="Password"
            type="password"
            placeholder="Your password"
            registration={register('password')}
            error={errors.password?.message}
          />

          <ApiMessage state={msg.state} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button type="button" onClick={() => navigate('/forgot-password')} style={{ border: 'none', background: 'none', color: 'var(--green)', fontWeight: 600, cursor: 'pointer', fontSize: 13.5 }}>
              Forgot password?
            </button>
          </div>

          <SubmitBtn loading={isSubmitting} label="Log in" loadingLabel="Signing in…" />
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--ink-3)', fontSize: 14 }}>
          No account?{' '}
          <button onClick={() => navigate('/signup')} style={{ border: 'none', background: 'transparent', color: 'var(--green)', fontWeight: 700, cursor: 'pointer' }}>Sign up free</button>
        </p>
      </Card>
    </PageShell>
  )
}

// ─── Signup page ──────────────────────────────────────────────────────────────

export function SignupPage({ onSuccess }) {
  const { signup, googleSignIn } = useAuth()
  const navigate = useNavigate()
  const msg = useApiMessage()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(values) {
    msg.clear()
    try {
      const res = await signup(values)
      onSuccess?.({ email: values.email, message: res?.message || null })
    } catch (err) {
      msg.setFromError(err)
    }
  }

  return (
    <PageShell onBack={() => navigate('/')}>
      <Card>
        <Logo />
        <h1 style={{ fontSize: 26, marginBottom: 6, textAlign: 'center' }}>Start for free</h1>
        <p style={{ textAlign: 'center', color: 'var(--ink-3)', marginBottom: 22 }}>7-day free trial, no credit card required.</p>

        <GoogleBtn onClick={googleSignIn} />
        <Divider label="or sign up with email" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            label="Your name"
            placeholder="Ada Lovelace"
            autoFocus
            registration={register('full_name')}
            error={errors.full_name?.message}
          />
          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            registration={register('email')}
            error={errors.email?.message}
          />
          <Field
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            registration={register('password')}
            error={errors.password?.message}
          />

          <ApiMessage state={msg.state} />

          <SubmitBtn loading={isSubmitting} label="Create free account" loadingLabel="Creating account…" />
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--ink-3)', fontSize: 14 }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} style={{ border: 'none', background: 'transparent', color: 'var(--green)', fontWeight: 700, cursor: 'pointer' }}>Log in</button>
        </p>
      </Card>
    </PageShell>
  )
}

// ─── Forgot password page ─────────────────────────────────────────────────────

export function ForgotPasswordPage({ onSuccess }) {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const msg = useApiMessage()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(values) {
    msg.clear()
    try {
      const res = await forgotPassword(values)
      onSuccess?.({ email: values.email, message: res?.message || null })
    } catch (err) {
      msg.setFromError(err)
    }
  }

  return (
    <PageShell onBack={() => navigate('/login')}>
      <Card>
        <Logo />
        <h1 style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>Forgot password?</h1>
        <p style={{ textAlign: 'center', color: 'var(--ink-3)', marginBottom: 26, lineHeight: 1.6 }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoFocus
            registration={register('email')}
            error={errors.email?.message}
          />

          <ApiMessage state={msg.state} />

          <SubmitBtn loading={isSubmitting} label="Send reset link" loadingLabel="Sending…" />
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--ink-3)', fontSize: 14 }}>
          <button onClick={() => navigate('/login')} style={{ border: 'none', background: 'transparent', color: 'var(--green)', fontWeight: 600, cursor: 'pointer' }}>← Back to login</button>
        </p>
      </Card>
    </PageShell>
  )
}

// ─── Email sent confirmation page ─────────────────────────────────────────────

export function EmailSentPage({ email, kind = 'confirmation', backendMessage }) {
  const navigate = useNavigate()
  // kind: 'confirmation' | 'reset'
  const title = kind === 'reset' ? 'Check your email' : 'Confirm your email'
  const desc =
    kind === 'reset'
      ? 'We sent a password reset link to'
      : 'We sent a confirmation link to'
  const tip =
    kind === 'reset'
      ? 'Click the link in the email to reset your password. The link expires in 1 hour.'
      : 'Click the link in the email to activate your account. Check your spam folder if you do not see it.'

  return (
    <PageShell onBack={onBack}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(45,212,191,0.15) 100%)',
            border: '1px solid rgba(34,197,94,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Mail size={28} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 10 }}>{title}</h1>

          {/* Show exact backend message if present, otherwise fallback */}
          {backendMessage ? (
            <div style={{
              margin: '0 auto 18px',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}>
              <p style={{ color: 'var(--green)', fontWeight: 600, fontSize: 13.5, lineHeight: 1.6 }}>
                {backendMessage}
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--ink-3)', marginBottom: 6, lineHeight: 1.6 }}>{desc}</p>
              {email && (
                <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 18, fontSize: 15 }}>{email}</p>
              )}
            </>
          )}

          <p style={{ color: 'var(--ink-3)', fontSize: 13.5, lineHeight: 1.7, marginBottom: 28 }}>{tip}</p>

          {onBack && (
            <button onClick={() => navigate('/login')} style={{ border: 'none', background: 'transparent', color: 'var(--green)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              ← Back to login
            </button>
          )}
        </div>
      </Card>
    </PageShell>
  )
}

// ─── Auth callback page ───────────────────────────────────────────────────────

export function AuthCallbackPage() {
  const { handleAuthCallback } = useAuth()
  const [status, setStatus] = useState('loading') // 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function run() {
      try {
        const hash = window.location.hash
        const result = await handleAuthCallback(hash)
        if (result?.type === 'recovery') {
          navigate('/auth/reset-password', { replace: true })
          return
        }
        // signup or google → go to app
        navigate('/dashboard', { replace: true })
      } catch (err) {
        setErrorMsg(err.message || 'Authentication failed. Please try again.')
        setStatus('error')
      }
    }
    run()
  }, [handleAuthCallback])

  return (
    <PageShell>
      <Card>
        <div style={{ textAlign: 'center' }}>
          {status === 'loading' ? (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: 'var(--surface2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <Loader2 size={26} style={{ color: 'var(--green)', animation: 'spin 0.8s linear infinite' }} />
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 10 }}>Completing sign-in…</h2>
              <p style={{ color: 'var(--ink-3)' }}>Hold on while we verify your account.</p>
            </>
          ) : (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <AlertTriangle size={26} style={{ color: '#ef4444' }} />
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 10 }}>Something went wrong</h2>
              <p style={{ color: 'var(--ink-3)', marginBottom: 24, lineHeight: 1.6 }}>{errorMsg}</p>
              <button onClick={() => navigate('/')} style={{ border: 'none', background: 'transparent', color: 'var(--green)', fontWeight: 600, cursor: 'pointer' }}>
                Back to home
              </button>
            </>
          )}
        </div>
      </Card>
    </PageShell>
  )
}

// ─── Link already used page ───────────────────────────────────────────────────

export function LinkAlreadyUsedPage() {
  const navigate = useNavigate()
  return (
    <PageShell>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <AlertTriangle size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 10 }}>Link already used</h1>
          <p style={{ color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 28 }}>
            This link has already been used or has expired. Each link can only be used once.
            {' '}If you need to reset your password again, start a new request below.
          </p>
          <button onClick={() => navigate('/forgot-password')} className="btn-green" style={{ padding: '11px 28px', borderRadius: 11, fontWeight: 700, fontSize: 14 }}>
            Request new link
          </button>
        </div>
      </Card>
    </PageShell>
  )
}

// ─── Account confirmed page ───────────────────────────────────────────────────

export function AccountConfirmedPage() {
  const navigate = useNavigate()
  return (
    <PageShell>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(45,212,191,0.15) 100%)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle2 size={30} style={{ color: 'var(--green)' }} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 10 }}>You're all set!</h1>
          <p style={{ color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 28 }}>
            Your account has been confirmed. You can now log in and start using Avertune.
          </p>
          <button onClick={() => navigate('/login')} className="btn-green" style={{ padding: '12px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15 }}>
            Log in to your account
          </button>
        </div>
      </Card>
    </PageShell>
  )
}

// ─── Reset password page ──────────────────────────────────────────────────────

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const msg = useApiMessage()
  const [done, setDone] = useState(false)

  const recoveryToken = localStorage.getItem(STORAGE.recoveryToken)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  // No recovery token — link is stale/invalid
  useEffect(() => {
    if (!recoveryToken) navigate('/link-expired', { replace: true })
  }, [recoveryToken, onLinkInvalid])

  async function onSubmit(values) {
    msg.clear()
    try {
      const res = await resetPassword({ access_token: recoveryToken, new_password: values.new_password })
      msg.setFromResponse(res)
      localStorage.removeItem(STORAGE.recoveryToken)
      setDone(true)
    } catch (err) {
      const errMsg = err.message || 'Reset failed. Please try again.'
      if (errMsg.toLowerCase().includes('expired') || errMsg.toLowerCase().includes('invalid')) {
        navigate('/link-expired', { replace: true })
        return
      }
      msg.setFromError(err)
    }
  }

  if (done) {
    return (
      <PageShell>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(45,212,191,0.15) 100%)',
              border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle2 size={30} style={{ color: 'var(--green)' }} />
            </div>
            <h1 style={{ fontSize: 24, marginBottom: 10 }}>Password updated!</h1>
            <p style={{ color: 'var(--ink-3)', marginBottom: 28, lineHeight: 1.6 }}>
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <button onClick={() => navigate('/login')} className="btn-green" style={{ padding: '12px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15 }}>
              Log in
            </button>
          </div>
        </Card>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Card>
        <Logo />
        <h1 style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>Set new password</h1>
        <p style={{ textAlign: 'center', color: 'var(--ink-3)', marginBottom: 26 }}>
          Choose a strong password for your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            label="New password"
            type="password"
            placeholder="Min. 8 characters"
            autoFocus
            registration={register('new_password')}
            error={errors.new_password?.message}
          />
          <Field
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            registration={register('confirm_password')}
            error={errors.confirm_password?.message}
          />

          <ApiMessage state={msg.state} />

          <SubmitBtn loading={isSubmitting} label="Reset password" loadingLabel="Resetting…" />
        </form>
      </Card>
    </PageShell>
  )
}
