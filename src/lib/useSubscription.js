import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "./subscriptionApi";
import { useAuth } from "../AuthContext";

export const SUB_KEYS = {
  plans: ["subscription", "plans"],
  me: ["subscription", "me"],
};

export function usePlans() {
  return useQuery({
    queryKey: SUB_KEYS.plans,
    queryFn: subscriptionApi.getPlans,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useMySubscription() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: SUB_KEYS.me,
    queryFn: subscriptionApi.getMySubscription,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export function useCheckout() {
  const { isAuthenticated } = useAuth();
  return useMutation({
    mutationFn: subscriptionApi.checkout,
    onSuccess: (data) => {
      console.log("Checkout response:", data);
      const checkoutUrl = data?.url;
      if (checkoutUrl) {
        window.location.replace(checkoutUrl); // use replace for immediate redirect
      } else {
        throw new Error("No checkout URL returned");
      }
    },
  });
}

export function usePortal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.getPortal,
    onSuccess: (data) => {
      const portalUrl = data?.url;
      if (portalUrl) {
        window.open(portalUrl, "_blank");
      } else {
        throw new Error("No portal URL returned");
      }
    },
    onError: (error) => {
      if (error.message?.includes("404") || error.response?.status === 404) {
        throw new Error("No active subscription found. Please upgrade first.");
      }
      throw error;
    },
  });
}

export function useCancel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUB_KEYS.me });
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function getPlanLabel(tier) {
  const map = {
    free: "Free",
    starter: "Starter",
    daily: "Daily",
    pro: "Pro",
    trial: "Trial",
  };
  return map[(tier || "").toLowerCase()] || tier || "Free";
}
