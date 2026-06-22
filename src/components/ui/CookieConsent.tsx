// src/components/ui/CookieConsent.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ConsentPrefs {
  necessary: true; // always on, not optional
  analytics: boolean;
}

function readConsent(): ConsentPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cookie_consent");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === "boolean") {
      return { necessary: true, analytics: parsed.analytics };
    }
    return null;
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean) {
  localStorage.setItem(
    "cookie_consent",
    JSON.stringify({ necessary: true, analytics }),
  );
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    if (!readConsent()) {
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    writeConsent(true);
    setShow(false);
  };

  const declineNonEssential = () => {
    writeConsent(false);
    setShow(false);
  };

  const savePreferences = () => {
    writeConsent(analyticsEnabled);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] p-4 bg-[var(--card-bg)] border-t border-[var(--border-default)] shadow-lg">
      <div className="max-w-[1200px] mx-auto">
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-[var(--text-muted)]">
              We use cookies to run the site and, with your permission, to
              understand how it's used.{" "}
              <Link
                href="/cookies"
                className="text-violet-400 hover:underline"
              >
                Learn more
              </Link>
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 rounded-lg text-[13px] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
              >
                Customize
              </button>
              <button
                onClick={declineNonEssential}
                className="px-4 py-2 rounded-lg text-[13px] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
              >
                Decline non-essential
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg text-[13px] bg-violet-600 text-white hover:bg-violet-500 transition-all"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[13px] text-[var(--text-muted)]">
              Choose which cookies we can use.{" "}
              <Link
                href="/cookies"
                className="text-violet-400 hover:underline"
              >
                Learn more
              </Link>
            </p>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[var(--card-muted-bg)]">
                <div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">
                    Necessary
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                    Required for login, security, and core site
                    functionality. Always on.
                  </p>
                </div>
                <div className="w-10 h-6 rounded-full bg-violet-600/40 flex items-center px-0.5 flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-violet-600 ml-auto" />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[var(--card-muted-bg)]">
                <div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">
                    Analytics
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                    Helps us understand how the product is used so we can
                    improve it. No data is sold or shared with advertisers.
                  </p>
                </div>
                <button
                  onClick={() => setAnalyticsEnabled((v) => !v)}
                  className={`w-10 h-6 rounded-full flex items-center px-0.5 flex-shrink-0 mt-0.5 transition-colors ${
                    analyticsEnabled
                      ? "bg-violet-600 justify-end"
                      : "bg-[var(--border-default)] justify-start"
                  }`}
                  aria-pressed={analyticsEnabled}
                  aria-label="Toggle analytics cookies"
                >
                  <div className="w-5 h-5 rounded-full bg-white" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end flex-wrap">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded-lg text-[13px] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
              >
                Back
              </button>
              <button
                onClick={savePreferences}
                className="px-4 py-2 rounded-lg text-[13px] bg-violet-600 text-white hover:bg-violet-500 transition-all"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
