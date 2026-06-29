"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

const EXTENSION_ID = "hllpepfbhjidhdheagfembdjdljklbke"; // TODO: move to env, will be changed later

function notifyExtensionOfLogin(
  accessToken: string,
  refreshToken: string,
  user: unknown,
) {
  // @ts-ignore - chrome is injected by the extension's content script context
  if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
    return;
  }
  // @ts-ignore
  chrome.runtime.sendMessage(
    EXTENSION_ID,
    {
      type: "AVERTUNE_LOGIN_SUCCESS",
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    },
    (response: unknown) => {
      // @ts-ignore
      if (chrome.runtime.lastError) {
        console.warn(
          "Could not reach Avertune extension:",
          // @ts-ignore
          chrome.runtime.lastError.message,
        );
        return;
      }
      console.log("Extension notified of login:", response);
    },
  );
}

function AvertuneLogoMark() {
  return <div></div>;
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
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
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--input-bg)]
            text-[var(--input-text)] text-[14px] placeholder:text-[var(--input-placeholder)]
            focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15
            transition-all"
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
    </div>
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code2FA, setCode2FA] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFromExtension, setIsFromExtension] = useState(false);
  const [extensionNotified, setExtensionNotified] = useState(false);
  const { login, signInWithGoogle, complete2FA } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fromExtension =
      new URLSearchParams(window.location.search).get("source") === "extension";
    setIsFromExtension(fromExtension);
    if (fromExtension) {
      // Persist across the redirect to Google's OAuth page and back,
      // since the query param won't survive that round trip.
      sessionStorage.setItem("avertune_ext_login", "1");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.requires2fa && result.temp_token) {
        setTempToken(result.temp_token);
        setStep("2fa");
      } else if (isFromExtension) {
        if (result.access_token && result.refresh_token) {
          notifyExtensionOfLogin(result.access_token, result.refresh_token, result.user);
        }
        setExtensionNotified(true);
      } else {
        router.push("/app");
      }
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await complete2FA(tempToken, code2FA);
      if (isFromExtension) {
        notifyExtensionOfLogin(result.access_token, result.refresh_token, result.user);
        setExtensionNotified(true);
      } else {
        router.push("/app");
      }
    } catch (err: any) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M10 3L5 8l5 5" />
          </svg>
          Back
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <AvertuneLogoMark />
          <h1 className="mt-4 text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">
            {step === "2fa" ? "Two-step verification" : "Welcome back"}
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-1">
            {step === "2fa"
              ? "Enter the code from your authenticator app"
              : "Sign in to your Avertune account"}
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

        {extensionNotified ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-green-500"
              >
                <polyline points="4 10 8 14 16 6" />
              </svg>
            </div>
            <h2 className="text-[16px] font-medium text-[var(--text-primary)] mb-1.5">
              You&apos;re logged in
            </h2>
            <p className="text-[14px] text-[var(--text-muted)]">
              You can close this tab and continue in the extension.
            </p>
          </div>
        ) : step === "login" ? (
          <>
            {/* Google */}
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
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-[13px] text-violet-500 hover:text-violet-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-medium
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="text-center text-[13px] text-[var(--text-muted)] mt-5">
              No account?{" "}
              <Link
                href="/auth/signup"
                className="text-violet-500 font-medium hover:text-violet-400 transition-colors"
              >
                Create one
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handle2FA} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[var(--text-primary)] mb-1.5">
                6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code2FA}
                onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--input-bg)]
                  text-[var(--input-text)] text-[18px] font-mono tracking-[0.3em] text-center
                  placeholder:text-[var(--input-placeholder)] placeholder:text-base placeholder:tracking-normal
                  focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || code2FA.length !== 6}
              className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-medium
                transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Verifying…
                </>
              ) : (
                "Verify"
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep("login")}
              className="w-full text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
