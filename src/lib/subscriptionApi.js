import { api } from "./apiClient";

export const subscriptionApi = {
  getPlans: async () => {
    const { data } = await api.get("/subscription/plans");
    return data;
  },

  getMySubscription: async () => {
    const { data } = await api.get("/subscription/me");
    return data;
  },

  checkout: async ({ plan, billing_period, ref_id }) => {
    const { data } = await api.post("/subscription/checkout", {
      plan,
      billing_period,
      ...(ref_id ? { ref_id } : {}),
    });
    return data;
  },

  getPortal: async () => {
    const { data } = await api.get("/subscription/portal");
    return data;
  },

  cancel: async ({ reason } = {}) => {
    const { data } = await api.delete("/subscription/cancel", {
      data: { reason: reason || "" },
    });
    return data;
  },
};
