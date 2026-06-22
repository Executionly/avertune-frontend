"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useReferral } from "@/lib/hooks/useReferral";
import { track } from "@/lib/analytics/track";

function AvertuneLogoMark() {
  return <div></div>;
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  hint,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--input-bg)]
            text-[var(--input-text)] text-[14px] placeholder:text-[var(--input-placeholder)]
            focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {show ? (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4"
              >
                <path d="M3.98 8.223A10.477 10.477 0 001.934 10c1.292 4.338 5.31 7.5 9.066 7.5a9.522 9.522 0 004.597-1.169M6.53 6.533A3.5 3.5 0 0110 6.5c1.933 0 3.5 1.567 3.5 3.5a3.5 3.5 0 01-.666 2.07m-2.37 2.37A3.5 3.5 0 016.53 6.533M3 3l14 14" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-4 h-4"
              >
                <path d="M10 4.5C5.5 4.5 1.5 10 1.5 10S5.5 15.5 10 15.5 18.5 10 18.5 10 14.5 4.5 10 4.5z" />
                <circle cx="10" cy="10" r="2.5" />
              </svg>
            )}
          </button>
        )}
      </div>
      {hint && (
        <p className="text-[12px] text-[var(--text-muted)] mt-1">{hint}</p>
      )}
    </div>
  );
}

function SignUpContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showReferral, setShowReferral] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, signInWithGoogle } = useAuth();
  const urlReferralCode = useReferral();
  const router = useRouter();

  useEffect(() => {
    if (urlReferralCode) {
      setReferralCode(urlReferralCode);
      setShowReferral(true);
    }
  }, [urlReferralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setLoading(true);
    track("signup_started", { has_referral: !!referralCode });
    try {
      await register(email, password, fullName, referralCode || undefined);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-7 h-7 text-green-500"
            >
              <path
                d="M4 10l4 4 8-8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Check your email
          </h2>
          <p className="text-[14px] text-[var(--text-muted)]">
            We've sent a confirmation link to{" "}
            <strong className="text-[var(--text-primary)]">{email}</strong>.
            Click it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M10 3L5 8l5 5" />
          </svg>
          Back
        </button>

        <div className="flex flex-col items-center mb-8">
          <AvertuneLogoMark />
          <h1 className="mt-4 text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">
            Create your account
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-1">
            Start communicating with intelligence
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-start gap-2">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="w-4 h-4 flex-shrink-0 mt-0.5"
            >
              <circle cx="8" cy="8" r="7" />
              <path d="M8 5v4M8 11v.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          className="w-full h-11 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]
                text-[var(--text-primary)] text-[14px] font-medium flex items-center justify-center gap-3
                hover:border-violet-400/60 hover:bg-[var(--card-muted-bg)] transition-all mb-4"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[var(--border-default)]" />
          <span className="text-[12px] text-[var(--text-muted)]">or</span>
          <div className="flex-1 h-px bg-[var(--border-default)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <InputField
            label="Full name"
            type="text"
            value={fullName}
            onChange={setFullName}
            placeholder="John Doe"
            autoComplete="name"
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            hint="Use a mix of letters, numbers and symbols"
            autoComplete="new-password"
          />

          {showReferral ? (
            <InputField
              label="Referral code (optional)"
              type="text"
              value={referralCode}
              onChange={setReferralCode}
              placeholder="AVT827dj"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowReferral(true)}
              className="text-[13px] text-[var(--text-muted)] hover:text-violet-500 transition-colors"
            >
              + Have a referral code?
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-medium
              transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-[12px] text-[var(--text-muted)] mt-4 leading-relaxed">
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            className="text-[var(--text-secondary)] hover:text-violet-500 transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[var(--text-secondary)] hover:text-violet-500 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>

        <p className="text-center text-[13px] text-[var(--text-muted)] mt-4">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-violet-500 font-medium hover:text-violet-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-[3px] border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
