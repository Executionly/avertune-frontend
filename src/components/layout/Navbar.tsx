"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-[200] bg-cream-100/95 backdrop-blur-xl border-b border-navy-900/[0.08]">
      <div className="flex items-center justify-between px-8 h-16 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          prefetch={false}
          className="flex items-center gap-2.5 font-bold text-[18px] text-navy-900 tracking-tight flex-shrink-0"
        >
          <div className="w-[200px] h-[200px]">
            <img
              src="/logo.png"
              alt="Avertune Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isLoading &&
            (isAuthenticated ? (
              <Link
                href="/app"
                className="h-8 px-4 text-[13px] font-medium bg-violet-500 text-white rounded-md inline-flex items-center hover:bg-violet-600 transition-colors"
              >
                Go to App →
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden sm:inline-flex h-8 px-4 text-[13px] font-medium text-navy-500 hover:text-violet-500 hover:bg-violet-50 rounded-md items-center transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="h-8 px-4 text-[13px] font-medium bg-violet-500 text-white rounded-md inline-flex items-center hover:bg-violet-600 transition-colors"
                >
                  Get Started Free →
                </Link>
              </>
            ))}
          <button
            className="lg:hidden p-1.5 text-navy-500"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span
                className={cn(
                  "h-0.5 bg-current transition-all",
                  mobileOpen && "rotate-45 translate-y-1.5",
                )}
              />
              <span
                className={cn(
                  "h-0.5 bg-current transition-all",
                  mobileOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "h-0.5 bg-current transition-all",
                  mobileOpen && "-rotate-45 -translate-y-1.5",
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-900/[0.08] bg-white px-6 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="py-2.5 text-sm text-navy-600 border-b border-navy-100/60"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <div key={item.label}>
                <p className="py-2 text-xs font-semibold uppercase tracking-widest text-navy-400">
                  {item.label}
                </p>
                {item.items?.map((dd) => (
                  <Link
                    key={dd.href}
                    href={dd.href}
                    className="flex items-center gap-2 py-2 pl-3 text-sm text-navy-600 hover:text-violet-500"
                    onClick={() => setMobileOpen(false)}
                  >
                    {dd.icon} {dd.label}
                  </Link>
                ))}
                {item.sections?.map((sec) =>
                  sec.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-2 py-2 pl-3 text-sm text-navy-600 hover:text-violet-500"
                      onClick={() => setMobileOpen(false)}
                    >
                      {l.icon} {l.label}
                    </Link>
                  )),
                )}
              </div>
            ),
          )}
          <div className="pt-3 border-t border-navy-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href="/app"
                className="py-2 text-sm font-medium text-violet-600"
                onClick={() => setMobileOpen(false)}
              >
                Go to App →
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="py-2 text-sm text-navy-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="py-2 text-sm font-medium text-violet-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── NavItem with pure CSS hover dropdown ── */
function NavItem({ item }: { item: NavItem }) {
  const hasDropdown = !!(item.items || item.sections);

  if (!hasDropdown) {
    return (
      <Link
        href={item.href ?? "#"}
        className="px-3 py-2 text-sm text-navy-500 hover:text-violet-500 hover:bg-violet-50 rounded-md transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-2 text-sm text-navy-500 hover:text-violet-500 hover:bg-violet-50 rounded-md transition-colors cursor-pointer">
        {item.label}
        <svg
          className="w-2.5 h-2.5 transition-transform duration-150 group-hover:rotate-180"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150 z-50">
        <div
          className={cn(
            "bg-white border border-navy-900/[0.08] rounded-2xl shadow-lg p-3",
            item.items
              ? "min-w-[480px] grid grid-cols-2 gap-1.5"
              : "min-w-[220px]",
          )}
        >
          {item.items?.map((dd) => (
            <Link
              key={dd.href}
              href={dd.href}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-violet-50 transition-colors group/dd"
            >
              <div>
                <strong className="block text-[13px] font-medium text-navy-800 mb-0.5 group-hover/dd:text-violet-600 transition-colors">
                  {dd.label}
                </strong>
                <span className="text-xs text-navy-400">{dd.description}</span>
              </div>
            </Link>
          ))}

          {item.sections?.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-400 px-3 pt-2 pb-1.5">
                {section.title}
              </p>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-navy-600 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
