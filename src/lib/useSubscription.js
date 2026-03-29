import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from './subscriptionApi'
import { useAuth } from '../AuthContext'

// ── Query keys ─────────────────────────────────────────────────────────────
export const SUB_KEYS = {
  plans: ['subscription', 'plans'],
  me:    ['subscription', 'me'],
}

// ── Plans (public, no auth needed) ────────────────────────────────────────
export function usePlans() {
  return useQuery({
    queryKey: SUB_KEYS.plans,
    queryFn:  subscriptionApi.getPlans,
    staleTime: 10 * 60 * 1000, // 10 min
    retry: false,
  })
}

// ── Current subscription ────────────────────────────────────────────────────
export function useMySubscription() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: SUB_KEYS.me,
    queryFn:  subscriptionApi.getMySubscription,
    enabled:  isAuthenticated,
    staleTime: 2 * 60 * 1000,
    retry: false,
  })
}

// ── Checkout ────────────────────────────────────────────────────────────────
export function useCheckout() {
  const { isAuthenticated } = useAuth()
  return useMutation({
    mutationFn: subscriptionApi.checkout,
    onSuccess: (data) => {
      // Redirect to payment provider
      if (data?.checkout_url) {
        window.location.href = data.checkout_url
      }
    },
  })
}

// ── Portal ──────────────────────────────────────────────────────────────────
export function usePortal() {
  return useMutation({
    mutationFn: subscriptionApi.getPortal,
    onSuccess: (data) => {
      if (data?.url) window.open(data.url, '_blank')
    },
  })
}

// ── Cancel ──────────────────────────────────────────────────────────────────
export function useCancel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUB_KEYS.me })
      qc.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}

// ── Helpers ─────────────────────────────────────────────────────────────────

// Map plan_tier from backend to display label
export function getPlanLabel(tier) {
  const map = {
    free:    'Free',
    starter: 'Starter',
    daily:   'Daily',
    pro:     'Pro',
    trial:   'Trial',
  }
  return map[(tier || '').toLowerCase()] || tier || 'Free'
}

// Map billing period to request value
export function mapBillingPeriod(billingUi) {
  const map = {
    weekly:  'weekly',
    monthly: 'monthly',
    annual:  'annual',
  }
  return map[billingUi] || 'monthly'
}

// Map plan card id to request plan value
export function mapPlanId(planCardId) {
  const map = {
    starter: 'starter',
    daily:   'daily',
    pro:     'pro',
  }
  return map[planCardId] || planCardId
}
