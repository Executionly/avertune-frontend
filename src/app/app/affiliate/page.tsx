// FILE: src/app/app/affiliate/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAffiliateProfile,
  getAffiliateStats,
  getReferrals,
  getClicks,
  getWithdrawals,
  requestWithdrawal,
  type AffiliateProfile,
  type AffiliateStats,
  type Referral,
  type Click,
  type Withdrawal,
  type WithdrawalRequest,
} from "@/lib/api/affiliate";
import { useAuth } from "@/lib/contexts/AuthContext";
import { cn } from "@/lib/utils";

type TabId = "overview" | "referrals" | "clicks" | "withdrawals";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "referrals", label: "Referrals" },
  { id: "clicks", label: "Clicks" },
  { id: "withdrawals", label: "Withdrawals" },
];

const PAYOUT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "wise", label: "Wise" },
  { value: "payoneer", label: "Payoneer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "usdt", label: "USDT (TRC20)" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function WithdrawalModal({
  isOpen,
  onClose,
  balance,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [formData, setFormData] = useState<Partial<WithdrawalRequest>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (numAmount > balance) {
      setError("Amount exceeds available balance");
      return;
    }
    if (numAmount < 10) {
      setError("Minimum withdrawal amount is $10");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      await requestWithdrawal(token, {
        amount: numAmount,
        payout_method: method,
        ...formData,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Withdrawal request failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderPayoutFields = () => {
    switch (method) {
      case "bank_transfer":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={formData.bank_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bank_name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="e.g., Chase Bank"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Account Number *
              </label>
              <input
                type="text"
                required
                value={formData.bank_account || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bank_account: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                required
                value={formData.bank_account_name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bank_account_name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                SWIFT / BIC Code
              </label>
              <input
                type="text"
                value={formData.bank_swift || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bank_swift: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="CHASUS33"
              />
            </div>
          </div>
        );
      case "paypal":
        return (
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
              PayPal Email *
            </label>
            <input
              type="email"
              required
              value={formData.paypal_email || ""}
              onChange={(e) =>
                setFormData({ ...formData, paypal_email: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
              placeholder="user@paypal.com"
            />
          </div>
        );
      case "wise":
        return (
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
              Wise Email *
            </label>
            <input
              type="email"
              required
              value={formData.wise_email || ""}
              onChange={(e) =>
                setFormData({ ...formData, wise_email: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
              placeholder="user@wise.com"
            />
          </div>
        );
      case "payoneer":
        return (
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
              Payoneer Email *
            </label>
            <input
              type="email"
              required
              value={formData.payoneer_email || ""}
              onChange={(e) =>
                setFormData({ ...formData, payoneer_email: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
              placeholder="user@payoneer.com"
            />
          </div>
        );
      case "mobile_money":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={formData.mobile_number || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Mobile Provider *
              </label>
              <input
                type="text"
                required
                value={formData.mobile_provider || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_provider: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="e.g., MTN, Vodafone"
              />
            </div>
          </div>
        );
      case "usdt":
        return (
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
              USDT Wallet Address (TRC20) *
            </label>
            <input
              type="text"
              required
              value={formData.usdt_address || ""}
              onChange={(e) =>
                setFormData({ ...formData, usdt_address: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all font-mono"
              placeholder="TQqpDiEbZhbC..."
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl w-full max-w-[500px] max-h-[90vh] flex flex-col">
        {/* Header - fixed */}
        <div className="flex-shrink-0 px-6 pt-6 pb-3 border-b border-[var(--border-default)]">
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
            Request Withdrawal
          </h3>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Available balance: {formatCurrency(balance)}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Amount (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="10"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 transition-all"
                placeholder="10.00"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[var(--text-muted)] mb-1">
                Payout Method *
              </label>
              <select
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value);
                  setFormData({});
                }}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                style={{ colorScheme: "dark" }}
              >
                {PAYOUT_METHODS.map((m) => (
                  <option
                    key={m.value}
                    value={m.value}
                    className="bg-[var(--card-bg)] text-[var(--text-primary)]"
                  >
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {renderPayoutFields()}
          </form>
        </div>

        {/* Footer - fixed */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--border-default)] flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-lg text-[13px] font-medium border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-muted-bg)] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-10 rounded-lg text-[13px] font-medium bg-violet-600 text-white hover:bg-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              "Request Withdrawal"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    expired: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border",
        styles[status] || "bg-gray-500/10 text-gray-400",
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── Non-Affiliate UI Component ──────────────────────────────────────────────
function NotAffiliateMessage({
  onJoinSuccess,
}: {
  onJoinSuccess?: () => void;
}) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setJoining(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        "https://avertuneserver.xyz/api/affiliate/join",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to join affiliate program");
      }

      onJoinSuccess?.();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative">
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-8 flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
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
        Back
      </button>

      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-8 h-8 text-amber-400"
          >
            <path
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mb-2">
          Not Yet an Affiliate
        </h2>
        <p className="text-[14px] text-[var(--text-muted)] max-w-[360px] mb-6">
          Join our affiliate program to start earning commissions by sharing
          Avertune.
        </p>
        {error && <p className="text-[13px] text-red-400 mb-4">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={joining}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-[13px] font-medium hover:bg-violet-500 transition-all disabled:opacity-50"
        >
          {joining ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Joining...
            </>
          ) : (
            "Join Affiliate Program →"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard Component ────────────────────────────────────────────────
export default function AffiliateDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [referralsPage, setReferralsPage] = useState(1);
  const [referralsTotal, setReferralsTotal] = useState(0);
  const [clicksPage, setClicksPage] = useState(1);
  const [clicksTotal, setClicksTotal] = useState(0);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAffiliate, setIsAffiliate] = useState<boolean | null>(null);

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const [profileData, statsData] = await Promise.all([
        getAffiliateProfile(token),
        getAffiliateStats(token),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setIsAffiliate(true);
    } catch (err: any) {
      console.error("Failed to load affiliate data:", err);
      const errorMsg = err.message || "Failed to load affiliate data";
      setError(errorMsg);

      if (
        errorMsg.toLowerCase().includes("not found") ||
        errorMsg.toLowerCase().includes("not an affiliate")
      ) {
        setIsAffiliate(false);
      } else {
        setIsAffiliate(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReferrals = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getReferrals(token, referralsPage);
      setReferrals(data?.referrals || []);
      setReferralsTotal(data?.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to load referrals:", err);
      setReferrals([]);
      setReferralsTotal(0);
    }
  }, [referralsPage]);

  const loadClicks = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getClicks(token, clicksPage);
      setClicks(data?.clicks || []);
      setClicksTotal(data?.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to load clicks:", err);
      setClicks([]);
      setClicksTotal(0);
    }
  }, [clicksPage]);

  const loadWithdrawals = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const data = await getWithdrawals(token, withdrawalsPage);
      setWithdrawals(data?.withdrawals || []);
      setWithdrawalsTotal(data?.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to load withdrawals:", err);
      setWithdrawals([]);
      setWithdrawalsTotal(0);
    }
  }, [withdrawalsPage]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/app/affiliate");
      return;
    }
    if (isAuthenticated) {
      loadData();
    }
  }, [isLoading, isAuthenticated, router, loadData]);

  useEffect(() => {
    if (activeTab === "referrals" && isAffiliate === true) loadReferrals();
    if (activeTab === "clicks" && isAffiliate === true) loadClicks();
    if (activeTab === "withdrawals" && isAffiliate === true) loadWithdrawals();
  }, [activeTab, loadReferrals, loadClicks, loadWithdrawals, isAffiliate]);

  const handleWithdrawSuccess = () => {
    loadData();
    loadWithdrawals();
  };

  if (isLoading || (loading && isAffiliate === null)) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 rounded-full border-[3px] border-violet-500/30 border-t-violet-500 animate-spin" />
      </div>
    );
  }

  if (isAffiliate === false) {
    return <NotAffiliateMessage onJoinSuccess={loadData} />;
  }

  if (error && !profile) {
    return <NotAffiliateMessage onJoinSuccess={loadData} />;
  }

  if (!profile) return null;

  const statusText =
    profile.status === "pending"
      ? "Your application is being reviewed"
      : profile.status === "active"
        ? "Active - Start referring!"
        : "Account suspended";

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-page)] p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-1">
            Affiliate Dashboard
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] text-[var(--text-muted)]">
              Your affiliate code:{" "}
              <code className="px-2 py-0.5 rounded-md bg-[var(--card-muted-bg)] font-mono text-[12px]">
                {profile.referral_code}
              </code>
            </p>
            <button
              onClick={() =>
                navigator.clipboard.writeText(profile.referral_code)
              }
              className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-[12px] text-[var(--text-muted)] mt-1">
            {statusText}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWithdrawModalOpen(true)}
            disabled={
              profile.pending_earnings > 10 || profile.status !== "active"
            }
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-[13px] font-medium hover:bg-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-5">
          <p className="text-[12px] text-[var(--text-muted)] font-medium mb-1">
            Total Earnings
          </p>
          <p className="text-[28px] font-bold text-[var(--text-primary)]">
            {formatCurrency(profile.total_earnings)}
          </p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-5">
          <p className="text-[12px] text-[var(--text-muted)] font-medium mb-1">
            Pending Earnings
          </p>
          <p className="text-[28px] font-bold text-[var(--text-primary)]">
            {formatCurrency(profile.pending_earnings)}
          </p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-5">
          <p className="text-[12px] text-[var(--text-muted)] font-medium mb-1">
            Total Referrals
          </p>
          <p className="text-[28px] font-bold text-[var(--text-primary)]">
            {profile.total_referrals}
          </p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-5">
          <p className="text-[12px] text-[var(--text-muted)] font-medium mb-1">
            Commission Rate
          </p>
          <p className="text-[28px] font-bold text-[var(--text-primary)]">
            {profile.commission_rate}%
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {stats?.total_clicks || 0} total clicks
          </p>
        </div>
      </div>

      {/* Earnings Chart Summary */}
      {stats && stats.monthly_earnings && stats.monthly_earnings.length > 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Earnings Performance
            </h3>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                Earnings
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Referrals
              </span>
            </div>
          </div>
          <div className="h-[200px] flex items-end gap-1">
            {stats.monthly_earnings.slice(-12).map((month, i) => {
              const maxEarnings = Math.max(
                ...stats.monthly_earnings.map((m) => m.earnings),
                100,
              );
              const earningsHeight = (month.earnings / maxEarnings) * 120;
              const referralsHeight = Math.min(month.referrals * 15, 80);
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="relative w-full flex flex-col items-center">
                    <div
                      className="w-full bg-violet-500/60 rounded-t-sm"
                      style={{ height: `${Math.max(earningsHeight, 4)}px` }}
                    />
                    <div
                      className="w-full bg-teal-500/60 rounded-t-sm mt-0.5"
                      style={{ height: `${Math.max(referralsHeight, 2)}px` }}
                    />
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] rotate-45 origin-left">
                    {month.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-6 mb-6">
          <p className="text-center text-[13px] text-[var(--text-muted)] py-8">
            No earnings data available yet
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border-default)] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-[13px] font-medium transition-all border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-violet-500 text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && stats && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl p-6">
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
            How to Earn
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-violet-400">1</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  Share Your Link
                </p>
                <p className="text-[12px] text-[var(--text-muted)] break-all">
                  Share your affiliate link:{" "}
                  <code className="text-violet-400 text-[11px]">
                    {profile.referral_url}
                  </code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-violet-400">2</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  Earn Commissions
                </p>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Earn {profile.commission_rate}% recurring commission on every
                  referred customer's payment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-violet-400">3</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  Get Paid
                </p>
                <p className="text-[12px] text-[var(--text-muted)]">
                  Request withdrawal when your balance reaches $10
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === "referrals" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl overflow-hidden">
          {!referrals ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[14px] text-[var(--text-muted)]">
                No referrals yet
              </p>
              <p className="text-[12px] text-[var(--text-muted)] mt-2">
                Share your affiliate link:{" "}
                <code className="text-violet-400 text-[11px] break-all">
                  {profile.referral_url}
                </code>
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-[var(--border-default)] bg-[var(--card-muted-bg)]">
                    <tr>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Customer
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Status
                      </th>
                      <th className="text-right p-3 font-medium text-[var(--text-muted)]">
                        Commission
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Signed Up
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref) => (
                      <tr
                        key={ref.id}
                        className="border-b border-[var(--border-default)] hover:bg-[var(--card-muted-bg)]"
                      >
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">
                              {ref.full_name || "—"}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)]">
                              {ref.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={ref.status} />
                        </td>
                        <td className="p-3 text-right font-medium text-[var(--text-primary)]">
                          {formatCurrency(ref.commission_earned)}
                          {ref.commission_paid > 0 && (
                            <span className="text-[11px] text-[var(--text-muted)] ml-1">
                              (paid: {formatCurrency(ref.commission_paid)})
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[var(--text-muted)]">
                          {formatDate(ref.signed_up_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {referralsTotal > 20 && (
                <div className="flex justify-center gap-2 p-4 border-t border-[var(--border-default)]">
                  <button
                    onClick={() =>
                      setReferralsPage(Math.max(1, referralsPage - 1))
                    }
                    disabled={referralsPage === 1}
                    className="px-3 py-1 rounded-lg text-[12px] border border-[var(--border-default)] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-[12px] text-[var(--text-muted)] py-1">
                    Page {referralsPage} of {Math.ceil(referralsTotal / 20)}
                  </span>
                  <button
                    onClick={() => setReferralsPage(referralsPage + 1)}
                    disabled={referralsPage >= Math.ceil(referralsTotal / 20)}
                    className="px-3 py-1 rounded-lg text-[12px] border border-[var(--border-default)] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Clicks Tab */}
      {activeTab === "clicks" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl overflow-hidden">
          {!clicks ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
          ) : clicks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[14px] text-[var(--text-muted)]">
                No clicks yet
              </p>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">
                Share your affiliate link to start tracking clicks
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-[var(--border-default)] bg-[var(--card-muted-bg)]">
                    <tr>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Date
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        IP
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Country
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Converted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clicks.map((click) => (
                      <tr
                        key={click.id}
                        className="border-b border-[var(--border-default)] hover:bg-[var(--card-muted-bg)]"
                      >
                        <td className="p-3 text-[var(--text-muted)]">
                          {formatDate(click.created_at)}
                        </td>
                        <td className="p-3 font-mono text-[12px] text-[var(--text-muted)]">
                          {click.ip}
                        </td>
                        <td className="p-3 text-[var(--text-muted)]">
                          {click.country || "—"}
                        </td>
                        <td className="p-3">
                          {click.converted ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {clicksTotal > 20 && (
                <div className="flex justify-center gap-2 p-4 border-t border-[var(--border-default)]">
                  <button
                    onClick={() => setClicksPage(Math.max(1, clicksPage - 1))}
                    disabled={clicksPage === 1}
                    className="px-3 py-1 rounded-lg text-[12px] border border-[var(--border-default)] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-[12px] text-[var(--text-muted)] py-1">
                    Page {clicksPage} of {Math.ceil(clicksTotal / 20)}
                  </span>
                  <button
                    onClick={() => setClicksPage(clicksPage + 1)}
                    disabled={clicksPage >= Math.ceil(clicksTotal / 20)}
                    className="px-3 py-1 rounded-lg text-[12px] border border-[var(--border-default)] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Withdrawals Tab */}
      {activeTab === "withdrawals" && (
        <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-2xl overflow-hidden">
          {!withdrawals ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[14px] text-[var(--text-muted)]">
                No withdrawal requests yet
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-[var(--border-default)] bg-[var(--card-muted-bg)]">
                    <tr>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Date
                      </th>
                      <th className="text-right p-3 font-medium text-[var(--text-muted)]">
                        Amount
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Method
                      </th>
                      <th className="text-left p-3 font-medium text-[var(--text-muted)]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((wd) => (
                      <tr
                        key={wd.id}
                        className="border-b border-[var(--border-default)] hover:bg-[var(--card-muted-bg)]"
                      >
                        <td className="p-3 text-[var(--text-muted)]">
                          {formatDate(wd.created_at)}
                        </td>
                        <td className="p-3 text-right font-medium text-[var(--text-primary)]">
                          {formatCurrency(wd.amount)}
                        </td>
                        <td className="p-3 text-[var(--text-muted)] capitalize">
                          {wd.payout_method.replace("_", " ")}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={wd.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {withdrawalsTotal > 20 && (
                <div className="flex justify-center gap-2 p-4 border-t border-[var(--border-default)]">
                  <button
                    onClick={() =>
                      setWithdrawalsPage(Math.max(1, withdrawalsPage - 1))
                    }
                    disabled={withdrawalsPage === 1}
                    className="px-3 py-1 rounded-lg text-[12px] border border-[var(--border-default)] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-[12px] text-[var(--text-muted)] py-1">
                    Page {withdrawalsPage} of {Math.ceil(withdrawalsTotal / 20)}
                  </span>
                  <button
                    onClick={() => setWithdrawalsPage(withdrawalsPage + 1)}
                    disabled={
                      withdrawalsPage >= Math.ceil(withdrawalsTotal / 20)
                    }
                    className="px-3 py-1 rounded-lg text-[12px] border border-[var(--border-default)] disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <WithdrawalModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        balance={profile.pending_earnings}
        onSuccess={handleWithdrawSuccess}
      />
    </div>
  );
}
