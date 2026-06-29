"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { track } from "@/lib/analytics/track";
import {
  signIn,
  signUp,
  signOut,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  validate2FA,
  User,
  TwoFARequired,
} from "@/lib/api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    requires2fa?: boolean;
    temp_token?: string;
    access_token?: string;
    refresh_token?: string;
    user?: User;
  }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    referralCode?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: {
    full_name?: string;
    avatar_url?: string;
  }) => Promise<void>;
  signInWithGoogle: () => void;
  forgotPw: (email: string) => Promise<void>;
  resetPw: (access_token: string, new_password: string) => Promise<void>;
  complete2FA: (
    temp_token: string,
    code: string,
  ) => Promise<{ access_token: string; refresh_token: string; user: User }>;
  wordLimit: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to store word_limit
const storeWordLimit = (limit: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("avertune_word_limit", String(limit));
  }
};

const getStoredWordLimit = (): number => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("avertune_word_limit");
    if (stored) return parseInt(stored, 10);
  }
  return 500; // default
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [wordLimit, setWordLimit] = useState<number>(getStoredWordLimit());
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

  // Update word_limit when user loads
  useEffect(() => {
    if (user?.word_limit) {
      setWordLimit(user.word_limit);
      storeWordLimit(user.word_limit);
    }
  }, [user]);

  const isLoading = !hydrated || (!!token && queryLoading);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const data = await signIn(email, password);
        if ("requires_2fa" in data && data.requires_2fa) {
          return { requires2fa: true, temp_token: data.temp_token };
        }
        const auth = data as import("@/lib/api/auth").AuthResponse;
        localStorage.setItem("access_token", auth.access_token);
        localStorage.setItem("refresh_token", auth.refresh_token);
        setToken(auth.access_token);
        queryClient.setQueryData(["user", auth.access_token], auth.user);

        // Store word_limit immediately from login response
        if (auth.user.word_limit) {
          setWordLimit(auth.user.word_limit);
          storeWordLimit(auth.user.word_limit);
        }

        track("signin_completed", {});
        return {
          access_token: auth.access_token,
          refresh_token: auth.refresh_token,
          user: auth.user,
        };
      } catch (err) {
        track("signin_failed", {});
        throw err;
      }
    },
    [queryClient],
  );

  const complete2FA = useCallback(
    async (temp_token: string, code: string) => {
      const data = await validate2FA(temp_token, code);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      setToken(data.access_token);
      queryClient.setQueryData(["user", data.access_token], data.user);

      // Store word_limit from 2FA response
      if (data.user.word_limit) {
        setWordLimit(data.user.word_limit);
        storeWordLimit(data.user.word_limit);
      }

      track("signin_completed", { via_2fa: true });

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      };
    },
    [queryClient],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      referralCode?: string,
    ) => {
      await signUp(email, password, fullName, referralCode);
      track("signup_completed", { has_referral: !!referralCode });
    },
    [],
  );

  const logout = useCallback(async () => {
    const currentToken = localStorage.getItem("access_token");
    if (currentToken) await signOut(currentToken).catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("avertune_word_limit");
    setToken(null);
    setWordLimit(500);
    queryClient.clear();
  }, [queryClient]);

  const updateUser = useCallback(
    async (data: { full_name?: string; avatar_url?: string }) => {
      const currentToken = localStorage.getItem("access_token");
      if (!currentToken) throw new Error("Not authenticated");
      const updated = await updateProfile(currentToken, data);
      queryClient.setQueryData(["user", currentToken], updated);

      // Update word_limit if it changed
      if (updated.word_limit) {
        setWordLimit(updated.word_limit);
        storeWordLimit(updated.word_limit);
      }
    },
    [queryClient],
  );

  const signInWithGoogle = useCallback(() => {
    window.location.href = "https://avertuneserver.xyz/api/auth/google";
  }, []);

  const forgotPw = useCallback(async (email: string) => {
    await forgotPassword(email);
  }, []);

  const resetPw = useCallback(
    async (access_token: string, new_password: string) => {
      await resetPassword(access_token, new_password);
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
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
        wordLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
