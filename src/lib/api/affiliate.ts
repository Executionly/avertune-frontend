// FILE: src/lib/api/affiliate.ts
const API_URL = "https://avertuneserver.xyz/api";

export interface AffiliateProfile {
  is_affiliate: boolean;
  id: string;
  referral_code: string;
  referral_url: string;
  status: "active" | "pending" | "suspended";
  commission_rate: number;
  total_referrals: number;
  paid_referrals: number;
  total_earnings: number;
  paid_out: number;
  pending_earnings: number;
  created_at: string;
}

export interface AffiliateStats {
  total_earnings: number;
  pending_earnings: number;
  paid_out: number;
  total_clicks: number;
  clicks_30d: number;
  total_referrals: number;
  paid_referrals: number;
  conversion_rate: string;
  monthly_earnings: Array<{
    month: string;
    amount: number;
  }>;
}

export interface Referral {
  id: string;
  plan: string;
  amount_paid: number;
  commission: number;
  status: string;
  created_at: string;
  user_email: string;
  user_fullname: string;
  user_joined: string;
}

export interface ReferralsResponse {
  data: Referral[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface Click {
  id: string;
  ip: string;
  country: string | null;
  device: string | null;
  referrer: string | null;
  converted: boolean;
  created_at: string;
}

export interface ClicksResponse {
  clicks: Click[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface WithdrawalRequest {
  amount: number;
  payout_method: string;
  bank_name?: string;
  bank_account?: string;
  bank_account_name?: string;
  bank_country?: string;
  bank_swift?: string;
  bank_routing?: string;
  paypal_email?: string;
  wise_email?: string;
  payoneer_email?: string;
  mobile_number?: string;
  mobile_provider?: string;
  mobile_country?: string;
  usdt_address?: string;
  usdt_network?: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  payout_method: string;
  payout_details: Record<string, any>;
  created_at: string;
  processed_at: string | null;
  failure_reason: string | null;
}

export interface WithdrawalsResponse {
  data: Withdrawal[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface JoinRequest {
  first_name: string;
  last_name: string;
  email: string;
  country?: string;
  linkedin_url?: string;
  promotion_methods: string[];
  primary_audience: string;
  audience_size: string;
  promotion_plan: string;
}

// ── API Functions ──────────────────────────────────────────────────────────────

async function authFetch(url: string, token: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `API error ${res.status}`);
  }
  return res.json();
}

/** Join affiliate program (public - no auth required) */
export async function joinAffiliate(data: JoinRequest): Promise<void> {
  const res = await fetch(`${API_URL}/affiliate/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || "Failed to join affiliate program");
  }
}

/** Get affiliate profile (requires auth + approved status) */
export async function getAffiliateProfile(
  token: string,
): Promise<AffiliateProfile> {
  return authFetch(`${API_URL}/affiliate/profile`, token);
}

/** Get affiliate stats and earnings chart */
export async function getAffiliateStats(
  token: string,
): Promise<AffiliateStats> {
  return authFetch(`${API_URL}/affiliate/stats`, token);
}

/** Get referrals with pagination */
export async function getReferrals(
  token: string,
  page = 1,
  limit = 20,
): Promise<ReferralsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return authFetch(`${API_URL}/affiliate/referrals?${params}`, token);
}

/** Get click history */
export async function getClicks(
  token: string,
  page = 1,
  limit = 20,
): Promise<ClicksResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return authFetch(`${API_URL}/affiliate/clicks?${params}`, token);
}

/** Request a withdrawal */
export async function requestWithdrawal(
  token: string,
  data: WithdrawalRequest,
): Promise<{ id: string; status: string }> {
  return authFetch(`${API_URL}/affiliate/withdraw`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Get withdrawal history */
export async function getWithdrawals(
  token: string,
  page = 1,
  limit = 20,
): Promise<WithdrawalsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return authFetch(`${API_URL}/affiliate/withdrawals?${params}`, token);
}
