"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth";

type Status = "processing" | "success" | "error" | "extension-success";

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

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Tokens arrive in the URL hash — e.g. #access_token=...&refresh_token=...&type=recovery
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error || errorDescription) {
      setErrorMsg(
        errorDescription?.replace(/\+/g, " ") ||
          error ||
          "Sign-in was cancelled or failed.",
      );
      setStatus("error");
      return;
    }

    if (!accessToken) {
      setErrorMsg("No access token returned. Please try signing in again.");
      setStatus("error");
      return;
    }

    // ── Password recovery flow ──────────────────────────────────
    // Supabase sends type=recovery for forgot-password links.
    // Redirect to the reset-password page with the token in the URL.
    if (type === "recovery") {
      router.replace(`/auth/reset-password?access_token=${accessToken}`);
      return;
    }

    const isFromExtension = sessionStorage.getItem("avertune_ext_login") === "1";

    // ── Normal OAuth / magic-link flow ──────────────────────────
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

    getMe(accessToken)
      .then((user) => {
        queryClient.setQueryData(["user", accessToken], user);
        if (isFromExtension) {
          sessionStorage.removeItem("avertune_ext_login");
          if (refreshToken) {
            notifyExtensionOfLogin(accessToken, refreshToken, user);
          }
          setStatus("extension-success");
        } else {
          setStatus("success");
          setTimeout(() => router.replace("/app"), 600);
        }
      })
      .catch(() => {
        if (isFromExtension) {
          sessionStorage.removeItem("avertune_ext_login");
          setStatus("extension-success");
        } else {
          setStatus("success");
          setTimeout(() => router.replace("/app"), 600);
        }
      });
  }, [router, queryClient]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] text-center">
        {status === "processing" && (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin mx-auto mb-5" />
            <h1 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1.5">
              Signing you in…
            </h1>
            <p className="text-[14px] text-[var(--text-muted)]">
              Completing your Google sign-in. Just a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
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
            <h1 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1.5">
              Signed in
            </h1>
            <p className="text-[14px] text-[var(--text-muted)]">
              Redirecting you to the app…
            </p>
          </>
        )}

        {status === "extension-success" && (
          <>
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
            <h1 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1.5">
              You&apos;re logged in
            </h1>
            <p className="text-[14px] text-[var(--text-muted)]">
              You can close this tab and continue in the extension.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-6 h-6 text-red-400"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v5" />
                <circle
                  cx="10"
                  cy="13.5"
                  r=".5"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </div>
            <h1 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1.5">
              Sign-in failed
            </h1>
            <p className="text-[14px] text-[var(--text-muted)] mb-6">
              {errorMsg}
            </p>
            <a
              href="/auth/signin"
              className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-violet-600 hover:bg-violet-500
                text-white text-[14px] font-medium transition-all"
            >
              Back to sign in
            </a>
          </>
        )}
      </div>
    </div>
  );
}
