// src/components/ui/CookieConsent.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("cookie_consent");
    if (!consented) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] p-4 bg-[var(--card-bg)] border-t border-[var(--border-default)] shadow-lg">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-[var(--text-muted)]">
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.
          <Link
            href="/cookies"
            className="text-violet-400 hover:underline ml-1"
          >
            Learn more
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-lg text-[13px] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg text-[13px] bg-violet-600 text-white hover:bg-violet-500 transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
