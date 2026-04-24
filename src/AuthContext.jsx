import { createContext, useContext, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./lib/authApi";
import { getTokens, clearTokens } from "./lib/apiClient";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const qc = useQueryClient();

  // Track token in state so useQuery's `enabled` is reactive
  const [hasToken, setHasToken] = useState(() =>
    Boolean(getTokens().accessToken),
  );

  // ── Current user ──────────────────────────────────────────────────────────
  const { data: user = null, isLoading: authLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // ── Sign in ───────────────────────────────────────────────────────────────
  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      // authApi.signIn already stored the tokens; now tell React about it
      setHasToken(true);
      // Seed the cache directly from the signin response so no extra /me call needed
      qc.setQueryData(["auth", "me"], data.user);
    },
  });

  // ── Sign up ───────────────────────────────────────────────────────────────
  // ✅ signUpMutation now passes the entire payload (including referral_code) to authApi.signUp
  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    // No tokens returned on signup — user just gets a confirmation email
  });

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSettled: () => {
      setHasToken(false);
      qc.setQueryData(["auth", "me"], null);
      qc.clear();
    },
  });

  // ── Forgot password ───────────────────────────────────────────────────────
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  // ── Reset password ────────────────────────────────────────────────────────
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      qc.setQueryData(["auth", "me"], (prev) => ({ ...prev, ...data }));
    },
  });

  // ── Handle OAuth / email callback ─────────────────────────────────────────
  const handleAuthCallback = useCallback(
    async (hash) => {
      const result = await authApi.handleCallback(hash);
      if (result.user) {
        setHasToken(true);
        qc.setQueryData(["auth", "me"], result.user);
      }
      return result;
    },
    [qc],
  );

  const value = {
    user,
    authLoading,
    isAuthenticated: Boolean(user),
    login: signInMutation.mutateAsync,
    loginLoading: signInMutation.isPending,
    signup: signUpMutation.mutateAsync,
    signupLoading: signUpMutation.isPending,
    logout: signOutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    forgotLoading: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    resetLoading: resetPasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    googleSignIn: authApi.googleSignIn, // ✅ now accepts a referral code
    handleAuthCallback,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
