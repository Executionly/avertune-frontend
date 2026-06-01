"use client";

import {
  createContext, useContext, useEffect, useState,
  ReactNode, useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  signIn, signUp, signOut, getMe, updateProfile,
  forgotPassword, resetPassword, validate2FA,
  User, TwoFARequired,
} from "@/lib/api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ requires2fa?: boolean; temp_token?: string }>;
  register: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { full_name?: string; avatar_url?: string }) => Promise<void>;
  signInWithGoogle: () => void;
  forgotPw: (email: string) => Promise<void>;
  resetPw: (access_token: string, new_password: string) => Promise<void>;
  complete2FA: (temp_token: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start as null + hydrating=true so we never flash-redirect before localStorage is read
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem("access_token");
    if (stored) setToken(stored);
    setHydrated(true);
  }, []);

  const { data: user, isLoading: queryLoading } = useQuery({
    queryKey: ["user", token],
    queryFn: () => getMe(token!),
    enabled: !!token && hydrated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // isLoading is true until: localStorage is read AND (if token exists) the /me query resolves
  const isLoading = !hydrated || (!!token && queryLoading);

  const login = useCallback(async (email: string, password: string) => {
    const data = await signIn(email, password);
    if ("requires_2fa" in data && data.requires_2fa) {
      return { requires2fa: true, temp_token: data.temp_token };
    }
    const auth = data as import("@/lib/api/auth").AuthResponse;
    localStorage.setItem("access_token", auth.access_token);
    localStorage.setItem("refresh_token", auth.refresh_token);
    setToken(auth.access_token);
    queryClient.setQueryData(["user", auth.access_token], auth.user);
    return {};
  }, [queryClient]);

  const complete2FA = useCallback(async (temp_token: string, code: string) => {
    const data = await validate2FA(temp_token, code);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    setToken(data.access_token);
    queryClient.setQueryData(["user", data.access_token], data.user);
  }, [queryClient]);

  const register = useCallback(async (email: string, password: string, fullName: string, referralCode?: string) => {
    await signUp(email, password, fullName, referralCode);
  }, []);

  const logout = useCallback(async () => {
    const currentToken = localStorage.getItem("access_token");
    if (currentToken) await signOut(currentToken).catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  const updateUser = useCallback(async (data: { full_name?: string; avatar_url?: string }) => {
    const currentToken = localStorage.getItem("access_token");
    if (!currentToken) throw new Error("Not authenticated");
    const updated = await updateProfile(currentToken, data);
    queryClient.setQueryData(["user", currentToken], updated);
  }, [queryClient]);

  const signInWithGoogle = useCallback(() => {
    window.location.href = "https://avertuneserver.xyz/api/auth/google";
  }, []);

  const forgotPw = useCallback(async (email: string) => {
    await forgotPassword(email);
  }, []);

  const resetPw = useCallback(async (access_token: string, new_password: string) => {
    await resetPassword(access_token, new_password);
  }, []);

  return (
    <AuthContext.Provider value={{
      user: user || null,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
      signInWithGoogle,
      forgotPw,
      resetPw,
      complete2FA,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
