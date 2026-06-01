// FILE: src/components/ui/Logo.tsx
"use client";

import Link from "next/link";

interface LogoProps {
  showName?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({
  showName = true,
  className = "",
  iconOnly = false,
}: LogoProps) {
  const showNameText = showName && !iconOnly;

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-navy-700 flex items-center justify-center shadow-md">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="w-4 h-4"
        >
          <path d="M4 15s2-5 6-7 7-6 7-6" />
          <circle cx="10" cy="10" r="2.5" fill="white" stroke="none" />
        </svg>
      </div>
      {showNameText && (
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          Avertune
        </span>
      )}
    </Link>
  );
}
