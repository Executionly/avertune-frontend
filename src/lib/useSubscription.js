import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "./subscriptionApi";
import { useAuth } from "../AuthContext";

export const SUB_KEYS = {
  plans: ["subscription", "plans"],
  me: ["subscription", "me"],
  packs: ["subscription", "packs"],
};

// ✅ Normalize subscription response (handles both object and number formats)
function normalizeSubscription(raw) {
  if (!raw) return raw;

  // Normalize character_limits
  let charLimits = {};
  if (raw.character_limits) {
    if (typeof raw.character_limits === "object") {
      charLimits = raw.character_limits;
    } else if (typeof raw.character_limits === "number") {
      const limit = raw.character_limits;
      charLimits = {
        reply_generator: limit,
        tone_checker: limit,
        boundary_builder: limit,
        negotiation: limit,
        follow_up: limit,
        difficult_email: limit,
        intent_detector: limit,
      };
    }
  }

  // Normalize tool_limits
  let toolLimits = {};
  if (raw.tool_limits) {
    if (typeof raw.tool_limits === "object") {
      toolLimits = raw.tool_limits;
    } else if (typeof raw.tool_limits === "number") {
      const limit = raw.tool_limits;
      toolLimits = {
        reply_generator: limit,
        tone_checker: limit,
        boundary_builder: limit,
        negotiation: limit,
        follow_up: limit,
        difficult_email: limit,
        intent_detector: limit,
      };
    }
  }

  return {
    ...raw,
    character_limits: charLimits,
    tool_limits: toolLimits,
  };
}

export function usePlans() {
  return useQuery({
    queryKey: SUB_KEYS.plans,
    queryFn: subscriptionApi.getPlans,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useMySubscription() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: SUB_KEYS.me,
    queryFn: async () => {
      const data = await subscriptionApi.getMySubscription();
      return normalizeSubscription(data);
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
        window.location.replace(checkoutUrl);
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

export function usePacks() {
  return useQuery({
    queryKey: SUB_KEYS.packs,
    queryFn: subscriptionApi.getPacks,
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useBuyPack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.buyPack,
    onSuccess: (data) => {
      const checkoutUrl = data?.url;
      if (checkoutUrl) {
        window.location.replace(checkoutUrl);
      } else {
        throw new Error("No checkout URL returned");
      }
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
