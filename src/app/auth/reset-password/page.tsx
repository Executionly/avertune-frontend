"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPw } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken =
    searchParams.get("access_token") || searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (!accessToken) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPw(accessToken, password);
      setSuccess(true);
      setTimeout(() => router.push("/auth/signin"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Back to home */}
        <a
          href="https://avertune.com"
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
          Back to home
        </a>

        <div className="flex flex-col items-center mb-8">
          <h1 className="mt-4 text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">
            {success ? "Password updated" : "Set new password"}
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-1 text-center">
            {success
              ? "Redirecting you to sign in…"
              : "Choose a strong password for your account"}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
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
            <Link
              href="/auth/signin"
              className="h-11 px-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-medium
                transition-all flex items-center justify-center"
            >
              Sign in now
            </Link>
          </div>
        ) : (
          <>
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
            {!accessToken && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[13px]">
                This reset link is invalid or has expired.{" "}
                <Link href="/auth/forgot-password" className="underline">
                  Request a new one
                </Link>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--input-bg)]
                      text-[var(--input-text)] text-[14px] placeholder:text-[var(--input-placeholder)]
                      focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="w-4 h-4"
                    >
                      {show ? (
                        <>
                          <path d="M3.98 8.223A10.477 10.477 0 001.934 10c1.292 4.338 5.31 7.5 9.066 7.5a9.522 9.522 0 004.597-1.169M6.53 6.533A3.5 3.5 0 0110 6.5c1.933 0 3.5 1.567 3.5 3.5a3.5 3.5 0 01-.666 2.07m-2.37 2.37A3.5 3.5 0 016.53 6.533M3 3l14 14" />
                        </>
                      ) : (
                        <>
                          <path d="M10 4.5C5.5 4.5 1.5 10 1.5 10S5.5 15.5 10 15.5 18.5 10 18.5 10 14.5 4.5 10 4.5z" />
                          <circle cx="10" cy="10" r="2.5" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">
                  Confirm password
                </label>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--input-bg)]
                    text-[var(--input-text)] text-[14px] placeholder:text-[var(--input-placeholder)]
                    focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !accessToken}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-medium
                  transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-[13px] text-[var(--text-muted)] mt-6">
          <Link
            href="/auth/signin"
            className="text-violet-500 hover:text-violet-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-3.5 h-3.5"
            >
              <path
                d="M10 12L6 8l4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
