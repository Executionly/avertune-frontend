import { api } from './apiClient'

export const subscriptionApi = {
  // GET /api/subscription/plans
  getPlans: async () => {
    const { data } = await api.get('/subscription/plans')
    return data
  },

  // GET /api/subscription/me
  getMySubscription: async () => {
    const { data } = await api.get('/subscription/me')
    return data
  },

  // POST /api/subscription/checkout
  // plan: 'starter' | 'daily' | 'pro'
  // billing_period: 'weekly' | 'monthly' | 'annual'
  checkout: async ({ plan, billing_period, ref_id }) => {
    const { data } = await api.post('/subscription/checkout', {
      plan,
      billing_period,
      ...(ref_id ? { ref_id } : {}),
    })
    return data // { checkout_url, provider }
  },

  // GET /api/subscription/portal
  getPortal: async () => {
    const { data } = await api.get('/subscription/portal')
    return data // { url }
  },

  // DELETE /api/subscription/cancel
  cancel: async ({ reason } = {}) => {
    const { data } = await api.delete('/subscription/cancel', {
      data: { reason: reason || '' },
    })
    return data
  },
}
