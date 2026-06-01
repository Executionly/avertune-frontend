"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  createCheckout,
  getPortalUrl,
  cancelSubscription,
} from "@/lib/api/auth";
import type { User } from "@/lib/api/auth";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
}

type TabId = "profile" | "settings" | "usage" | "billing";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-4 h-4"
      >
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-4 h-4"
      >
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
      </svg>
    ),
  },
  {
    id: "usage",
    label: "Usage",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-4 h-4"
      >
        <rect x="1" y="10" width="3" height="5" rx="0.5" />
        <rect x="6" y="6" width="3" height="9" rx="0.5" />
        <rect x="11" y="2" width="3" height="13" rx="0.5" />
      </svg>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-4 h-4"
      >
        <rect x="1" y="3" width="14" height="10" rx="1.5" />
        <path d="M1 7h14M4 11h2M9 11h3" />
      </svg>
    ),
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-violet-600" : "bg-gray-300 dark:bg-gray-600"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

export function AccountModal({
  isOpen,
  onClose,
  user,
  onLogout,
}: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.addEventListener("mousedown", handleClick);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const { url } = await getPortalUrl(token);
      window.open(url, "_blank");
    } catch {
      window.open("/pricing", "_blank");
    } finally {
      setBillingLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    setBillingLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }
      const { url } = await createCheckout(token, plan, "monthly");
      window.location.href = url;
    } catch {
      window.location.href = "/pricing";
    } finally {
      setBillingLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Cancel your subscription? You'll keep access until the end of your billing period.",
      )
    )
      return;
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (token)
        await cancelSubscription(token, "User cancelled via account modal");
      alert(
        "Subscription cancelled. Access continues until end of billing period.",
      );
    } catch {
      alert("Failed to cancel. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isOpen) return null;

  const userInitial = user.full_name?.charAt(0).toUpperCase() || "U";
  const planTier = user.plan_tier || "trial";
  const isTrial = planTier === "trial";
  const isFree = planTier === "free";
  const isPaid = !isFree && !isTrial;

  const planBadgeStyle = isTrial
    ? "bg-amber-500/15 text-amber-500"
    : isFree
      ? "bg-gray-500/15 text-gray-500"
      : "bg-violet-500/15 text-violet-500";

  const planLabel = isTrial
    ? "Trial"
    : isFree
      ? "Free"
      : planTier.charAt(0).toUpperCase() + planTier.slice(1);
  const creditsUsedPct =
    user.credits_limit > 0
      ? Math.round((user.credits_used / user.credits_limit) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative w-full max-w-[700px] h-[520px] rounded-2xl overflow-hidden flex flex-col shadow-2xl
          bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/[0.07]"
        style={{ animation: "modalIn 0.18s ease" }}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.07] flex-shrink-0">
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
            Account
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-3.5 h-3.5"
            >
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0 flex-col sm:flex-row">
          {/* Sidebar nav */}
          <nav
            className="flex-shrink-0 sm:w-52 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-white/[0.06]
            flex sm:flex-col overflow-x-auto sm:overflow-visible p-2 sm:p-3 gap-0.5"
          >
            {/* User card */}
            <div className="hidden sm:flex items-center gap-2.5 px-2 py-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                  {user.full_name}
                </p>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${planBadgeStyle}`}
                >
                  {planLabel}
                  {isTrial &&
                    user.trial_days_left > 0 &&
                    ` · ${user.trial_days_left}d left`}
                </span>
              </div>
            </div>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? "bg-gray-100 dark:bg-white/[0.08] text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            <div className="hidden sm:block mt-auto pt-2 border-t border-gray-100 dark:border-white/[0.06]">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="w-4 h-4"
                >
                  <path
                    d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l4-3-4-3M14 8H6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 min-h-0">
            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <div className="space-y-4 max-w-sm">
                <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  Profile
                </h3>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-base font-semibold text-white flex-shrink-0">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-gray-900 dark:text-white">
                      {user.full_name}
                    </p>
                    <p className="text-[12px] text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                    <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-[13px] text-gray-700 dark:text-gray-300">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                    <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Provider</span>
                    <span className="text-[13px] text-gray-700 dark:text-gray-300 capitalize">{user.auth_provider}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.is_email_verified && (
                    <span className="flex items-center gap-1 text-[12px] text-green-600 dark:text-green-400">
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-3 h-3"
                      >
                        <path
                          d="M2 6l2.5 2.5L10 3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {activeTab === "settings" && (
              <div className="space-y-1 max-w-sm">
                <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-3">
                  Settings
                </h3>

                {/* Theme */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div>
                    <p className="text-[13px] font-medium text-gray-800 dark:text-gray-100">
                      Dark mode
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Switch between light and dark appearance
                    </p>
                  </div>
                  <Toggle
                    checked={theme === "dark"}
                    onChange={(v) => setTheme(v ? "dark" : "light")}
                  />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div>
                    <p className="text-[13px] font-medium text-gray-800 dark:text-gray-100">
                      Email notifications
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Weekly insights and updates
                    </p>
                  </div>
                  <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
                </div>

                {/* Data sharing 
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div>
                    <p className="text-[13px] font-medium text-gray-800 dark:text-gray-100">Improve Avertune</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Share anonymised usage data</p>
                  </div>
                  <Toggle checked={shareData} onChange={setShareData} />
                </div>*/}

                {/* 2FA status */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/[0.06]">
                  <div>
                    <p className="text-[13px] font-medium text-gray-800 dark:text-gray-100">
                      Two-factor authentication
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {user.two_fa_enabled
                        ? "Enabled and confirmed"
                        : "Not enabled"}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full ${user.two_fa_enabled ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-white/[0.06] text-gray-500"}`}
                  >
                    {user.two_fa_enabled ? "On" : "Off"}
                  </span>
                </div>

                <div className="pt-4">
                  <Link
                    href="/auth/reset-password"
                    onClick={onClose}
                    className="text-[13px] text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Change password →
                  </Link>
                </div>
              </div>
            )}

            {/* ── USAGE ── */}
            {activeTab === "usage" && (
              <div className="space-y-4">
                <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  Usage
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    {
                      label: "Plan",
                      value: planLabel,
                      color: "text-gray-900 dark:text-white",
                    },
                    {
                      label: "Credits used",
                      value: String(user.credits_used),
                      color: "text-gray-900 dark:text-white",
                    },
                    {
                      label: "Remaining",
                      value: String(user.credits_remaining),
                      color:
                        user.credits_remaining === 0
                          ? "text-red-500"
                          : "text-green-600 dark:text-green-400",
                    },
                    {
                      label: "Trial days",
                      value:
                        user.trial_days_left > 0
                          ? `${user.trial_days_left}d`
                          : "—",
                      color: "text-amber-500",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]"
                    >
                      <p className="text-[11px] text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-[22px] font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Credits bar */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                      Credit usage
                    </p>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400">
                      {user.credits_used} / {user.credits_limit}
                    </p>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${creditsUsedPct > 80 ? "bg-red-500" : "bg-violet-600"}`}
                      style={{ width: `${Math.min(creditsUsedPct, 100)}%` }}
                    />
                  </div>
                  {user.credits_remaining === 0 && (
                    <p className="text-[11px] text-red-500 mt-1.5">
                      Credits exhausted — upgrade to continue
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── BILLING ── */}
            {activeTab === "billing" && (
              <div className="space-y-3.5 max-w-sm">
                <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">
                  Billing
                </h3>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900 dark:text-white">
                        {planLabel} Plan
                      </p>
                      <p className="text-[12px] text-gray-400 mt-0.5">
                        {isTrial
                          ? `Trial · ${user.trial_days_left} day${user.trial_days_left !== 1 ? "s" : ""} remaining`
                          : isFree
                            ? "Free forever"
                            : `Billed ${user.billing_period}`}
                      </p>
                    </div>
                  </div>

                  {isFree || isTrial ? (
                    <button
                      onClick={() => handleUpgrade("pro")}
                      disabled={billingLoading}
                      className="w-full h-9 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {billingLoading && (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      Upgrade to Pro
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleManageBilling}
                        disabled={billingLoading}
                        className="flex-1 h-9 rounded-lg text-[13px] font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center"
                      >
                        Manage billing
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={cancelLoading}
                        className="h-9 px-3 rounded-lg text-[13px] font-medium text-red-500 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  href="/pricing"
                  onClick={onClose}
                  className="block text-[13px] text-violet-600 dark:text-violet-400 hover:underline"
                >
                  View all plans →
                </Link>

                {/* Mobile sign out */}
                <button
                  onClick={onLogout}
                  className="sm:hidden w-full py-2 px-4 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-red-100 dark:border-red-500/20"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
