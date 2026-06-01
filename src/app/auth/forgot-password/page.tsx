"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPw } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPw(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.2" className="w-5 h-5">
              <path d="M4 15s2-5 6-7 7-6 7-6" /><circle cx="10" cy="10" r="2.5" fill="white" stroke="none" />
            </svg>
          </div>
          {!sent ? (
            <>
              <h1 className="mt-4 text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Reset your password</h1>
              <p className="text-[14px] text-[var(--text-muted)] mt-1 text-center">
                Enter your email and we'll send you a reset link
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Check your inbox</h1>
              <p className="text-[14px] text-[var(--text-muted)] mt-1 text-center">
                If <strong className="text-[var(--text-primary)]">{email}</strong> is registered, you'll receive a reset link shortly.
              </p>
            </>
          )}
        </div>

        {!sent ? (
          <>
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-start gap-2">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 flex-shrink-0 mt-0.5">
                  <circle cx="8" cy="8" r="7" /><path d="M8 5v4M8 11v.5" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--input-bg)]
                    text-[var(--input-text)] text-[14px] placeholder:text-[var(--input-placeholder)]
                    focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-medium
                  transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : "Send reset link"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-green-500">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" fill="currentColor" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" fill="currentColor" />
              </svg>
            </div>
            <p className="text-[13px] text-[var(--text-muted)] text-center">Didn't receive it? Check your spam folder or try again.</p>
            <button onClick={() => setSent(false)}
              className="text-[13px] text-violet-500 hover:text-violet-400 transition-colors">
              Try a different email
            </button>
          </div>
        )}

        <p className="text-center text-[13px] text-[var(--text-muted)] mt-6">
          <Link href="/auth/signin" className="text-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
              <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
