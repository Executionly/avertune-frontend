const API_URL = "https://avertuneserver.xyz/api";
const SUB_URL = "https://avertuneserver.xyz/api/v2/subscription";
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  auth_provider: string;
  is_email_verified: boolean;
  two_fa_enabled: boolean;
  two_fa_confirmed: boolean;
  plan_tier: string;
  plan_name: string;
  billing_period: string;
  billing_anchor_day?: number;
  trial_days_left: number;
  credits_balance: number;
  credits_used: number;
  credits_limit: number;
  credits_remaining: number;
  word_limit?: number;
  features: string[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface TwoFARequired {
  requires_2fa: true;
  temp_token: string;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResponse | TwoFARequired> {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Invalid credentials");
  }
  return res.json();
}

export async function signUp(
  email: string,
  password: string,
  full_name: string,
  referral_code?: string,
): Promise<void> {
  const body: any = { email, password, full_name };
  if (referral_code) body.referral_code = referral_code;
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Signup failed");
  }
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
}

export async function signOut(token: string): Promise<void> {
  await fetch(`${API_URL}/auth/signout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateProfile(
  token: string,
  data: { full_name?: string; avatar_url?: string },
): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to send reset email");
}

export async function resetPassword(
  access_token: string,
  new_password: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token, new_password }),
  });
  if (!res.ok) throw new Error("Failed to reset password");
}

export async function refreshToken(
  refresh_token: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) throw new Error("Token refresh failed");
  return res.json();
}

export async function validate2FA(
  temp_token: string,
  code: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/2fa/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temp_token, code }),
  });
  if (!res.ok) throw new Error("Invalid 2FA code");
  return res.json();
}

export async function setup2FA(token: string): Promise<{ qr_code: string }> {
  const res = await fetch(`${API_URL}/auth/2fa/setup`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to setup 2FA");
  return res.json();
}

export async function verifySetup2FA(
  token: string,
  code: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/2fa/verify-setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Invalid code");
}

export async function disable2FA(token: string, code: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/2fa/disable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Failed to disable 2FA");
}

export async function get2FAStatus(
  token: string,
): Promise<{ enabled: boolean }> {
  const res = await fetch(`${API_URL}/auth/2fa/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get 2FA status");
  return res.json();
}

// ── SUBSCRIPTION (v2) ──────────────────────────────────────────────

export async function getSubscription(token: string): Promise<any> {
  const res = await fetch(`${SUB_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return res.json();
}

export async function getPlans(): Promise<any> {
  const res = await fetch(`${SUB_URL}/plans`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

export async function createCheckout(
  token: string,
  plan: string,
  billing_period: string,
): Promise<{ url: string }> {
  const res = await fetch(`${SUB_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ tier: plan, billing_period }),
  });
  if (!res.ok) throw new Error("Failed to create checkout");
  return res.json();
}

export async function getPortalUrl(token: string): Promise<{ url: string }> {
  const res = await fetch(`${SUB_URL}/portal`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get portal URL");
  return res.json();
}

export async function cancelSubscription(
  token: string,
  reason?: string,
): Promise<void> {
  const res = await fetch(`${SUB_URL}/cancel`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error("Failed to cancel subscription");
}

export interface AddonPack {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  price_id?: string;
}

export async function getAddons(): Promise<{ addons: AddonPack[] }> {
  const res = await fetch(`${SUB_URL}/addons`);
  if (!res.ok) throw new Error("Failed to fetch addons");
  return res.json();
}

export async function buyAddon(
  token: string,
  addonId: string,
): Promise<{ url: string }> {
  const res = await fetch(`${SUB_URL}/addon/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ addon_id: addonId }),
  });
  if (!res.ok) throw new Error("Failed to purchase addon");
  return res.json();
}
