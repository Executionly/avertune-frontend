"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { createCheckout, cancelSubscription, getSubscription } from "@/lib/api/auth";
import type { User } from "@/lib/api/auth";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onUserUpdate?: (updatedUser: User) => void;
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

// Cancel Subscription inline component
function CancelSubscriptionInline({
  isOpen,
  onClose,
  onConfirm,
  planName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  planName: string;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
  };

  if (!isOpen) return null;

  return (
    <div className="mt-3 p-4 rounded-xl  border border-black">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-4 h-4 text-red-400"
          >
            <path
              d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M6 7v4M10 7v4M3 4l1 9.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5L13 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-red-400">
            Cancel {planName} Plan?
          </p>
          <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
            You'll keep access until the end of your billing period. After that,
            your plan will be downgraded to Free.
          </p>
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1.5">
          Reason for cancelling (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="Help us improve..."
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-violet-500 transition-all"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 h-9 rounded-lg text-[12px] font-medium border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
        >
          Keep Plan
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex-1 h-9 rounded-lg text-[12px] font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              Cancelling...
            </div>
          ) : (
            "Cancel Subscription"
          )}
        </button>
      </div>
    </div>
  );
}

// Success message component
function SuccessMessage({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[13px] flex items-center gap-2">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4 flex-shrink-0"
      >
        <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {message}
    </div>
  );
}

export function AccountModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onUserUpdate,
}: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [billingLoading, setBillingLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [subData, setSubData] = useState<{
    status?: string;
    current_period_end?: string;
    cancel_at_period_end?: boolean;
    plan_name?: string;
  } | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Fetch real subscription data when billing tab opens
  useEffect(() => {
    if (activeTab !== "billing") return;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    setSubLoading(true);
    getSubscription(token)
      .then((data) => setSubData(data))
      .catch(() => setSubData(null))
      .finally(() => setSubLoading(false));
  }, [activeTab]);

  const getBillingExpiryText = () => {
    if (subLoading) return "Loading...";

    if (subData?.cancel_at_period_end && subData.current_period_end) {
      const end = new Date(subData.current_period_end);
      return `Cancels on ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Access until then`;
    }

    if (subData?.current_period_end) {
      const end = new Date(subData.current_period_end);
      return `Next billing on ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }

    if (planTier === "free" || planTier === "trial") {
      if (user.trial_days_left > 0) {
        return `Trial ends in ${user.trial_days_left} day${user.trial_days_left !== 1 ? "s" : ""}`;
      }
      return "Free plan — no billing";
    }

    return `Billed ${user.billing_period || "monthly"}`;
  };

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

  const handleAddCredits = async () => {
    setBillingLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        window.location.href = "/auth/signin";
        return;
      }
      // Redirect to pricing page with addons section for credit purchase
      window.location.href = "/pricing#addons";
    } catch {
      window.location.href = "/pricing#addons";
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

  const handleCancel = async (reason: string) => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await cancelSubscription(
          token,
          reason || "User cancelled via account modal",
        );

        // Re-fetch real subscription state
        try {
          const fresh = await getSubscription(token);
          setSubData(fresh);
        } catch {}

        // Update local user state to reflect cancellation
        const updatedUser = {
          ...user,
          plan_tier: "cancelled",
          plan_name: "Cancelled (ends billing period)",
        };
        onUserUpdate?.(updatedUser);

        setSuccessMessage(
          "Subscription cancelled successfully. You'll have access until the end of your billing period.",
        );
        setShowCancelForm(false);

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (err) {
      setSuccessMessage(null);
      // Show error message instead of alert
      setSuccessMessage("Failed to cancel. Please try again.");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isOpen) return null;

  const userInitial = user.full_name?.charAt(0).toUpperCase() || "U";
  const planTier = user.plan_tier || "trial";
  const isTrial = planTier === "trial";
  const isFree = planTier === "free";
  const isCancelled = planTier === "cancelled" || subData?.cancel_at_period_end === true;
  const isPro = planTier === "pro" || planTier === "pro_annual";

  const planBadgeStyle = isTrial
    ? "bg-amber-500/15 text-amber-500"
    : isFree
      ? "bg-gray-500/15 text-gray-500"
      : isCancelled
        ? "bg-red-500/15 text-red-500"
        : "bg-violet-500/15 text-violet-500";

  const planLabel = isTrial
    ? "Trial"
    : isFree
      ? "Free"
      : isCancelled
        ? "Cancelled"
        : planTier.charAt(0).toUpperCase() + planTier.slice(1);
  const creditsUsedPct =
    user.credits_limit > 0
      ? Math.round((user.credits_used / user.credits_limit) * 100)
      : 0;

  const isPaidUser = !isFree && !isTrial && !isCancelled;

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
                    <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </span>
                    <span className="text-[13px] text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                    <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                      Provider
                    </span>
                    <span className="text-[13px] text-gray-700 dark:text-gray-300 capitalize">
                      {user.auth_provider}
                    </span>
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

            {/* ── SETTINGS (only dark mode toggle) ── */}
            {activeTab === "settings" && (
              <div className="space-y-1 max-w-sm">
                <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-3">
                  Settings
                </h3>

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
                      {isPro
                        ? "Credits exhausted — add more credits to continue"
                        : "Credits exhausted — upgrade to continue"}
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
                  <div className="mb-3">
                    <p className="text-[14px] font-semibold text-gray-900 dark:text-white">
                      {planLabel} Plan
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      {getBillingExpiryText()}
                    </p>
                  </div>

                  {successMessage && (
                    <SuccessMessage
                      message={successMessage}
                      onClose={() => setSuccessMessage(null)}
                    />
                  )}

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
                  ) : isCancelled ? (
                    <div className="space-y-2.5">
                      <div className="text-center py-2">
                        <p className="text-[13px] text-amber-400">
                          Subscription cancelled
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-1">
                          Access until end of billing period
                        </p>
                      </div>
                      <button
                        onClick={() => handleUpgrade("pro")}
                        disabled={billingLoading}
                        className="w-full h-9 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {billingLoading && (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Resubscribe
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {isPro ? (
                        <button
                          onClick={handleAddCredits}
                          disabled={billingLoading}
                          className="w-full h-9 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {billingLoading && (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          )}
                          Add More Credits →
                        </button>
                      ) : (
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
                      )}
                      <button
                        onClick={() => setShowCancelForm(!showCancelForm)}
                        className="w-full h-9 rounded-lg text-[13px] font-medium text-red-500 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Cancel Subscription
                      </button>

                      <CancelSubscriptionInline
                        isOpen={showCancelForm}
                        onClose={() => setShowCancelForm(false)}
                        onConfirm={handleCancel}
                        planName={planLabel}
                        isLoading={cancelLoading}
                      />
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
