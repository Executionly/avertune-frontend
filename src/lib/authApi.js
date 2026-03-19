import { api, BASE_URL, getTokens, setTokens, clearTokens, STORAGE } from './apiClient'

// Normalize the /auth/me response into a consistent shape.
// Actual API response fields:
// { id, email, full_name, avatar_url, plan_tier, auth_provider,
//   is_email_verified, trial_days_left, usage_today, limit_today, replies_remaining }
function normalizeUser(raw) {
  if (!raw) return null
  const meta = raw.user_metadata || raw.raw_user_meta_data || {}
  return {
    ...raw,
    // safe display name — prefer full_name from top-level, fallback to metadata or email prefix
    full_name:
      raw.full_name ||
      meta.full_name ||
      meta.name ||
      raw.email?.split('@')[0] ||
      'User',
    email: raw.email || meta.email || '',
    avatar_url: raw.avatar_url || meta.avatar_url || meta.picture || null,
    // plan_tier comes back as 'trial' | 'free' | 'pro' etc.
    plan_tier: raw.plan_tier || 'free',
    trial_days_left: raw.trial_days_left ?? null,
    usage_today: raw.usage_today ?? 0,
    limit_today: raw.limit_today ?? 5,
    replies_remaining: raw.replies_remaining ?? (raw.limit_today ?? 5) - (raw.usage_today ?? 0),
    is_email_verified: raw.is_email_verified ?? false,
    auth_provider: raw.auth_provider || 'email',
  }
}

export const authApi = {
  signIn: async ({ email, password }) => {
    const { data } = await api.post('/auth/signin', { email, password })
    setTokens(data.access_token, data.refresh_token, data.expires_in || 3600)
    return { ...data, user: normalizeUser(data.user) }
  },

  signUp: async ({ email, password, full_name }) => {
    const { data } = await api.post('/auth/signup', { email, password, full_name })
    return data
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return normalizeUser(data)
  },

  signOut: async () => {
    const { accessToken } = getTokens()
    if (accessToken) {
      await api.post('/auth/signout').catch(() => {})
    }
    clearTokens()
  },

  forgotPassword: async ({ email }) => {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async ({ access_token, new_password }) => {
    const { data } = await api.post('/auth/reset-password', { access_token, new_password })
    return data
  },

  updateProfile: async (profile) => {
    const { data } = await api.patch('/auth/me', profile)
    return normalizeUser(data)
  },

  handleCallback: async (hash) => {
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (!type) throw new Error('Invalid callback — missing type.')

    if (type === 'signup' || type === 'google') {
      if (!accessToken || !refreshToken)
        throw new Error('Missing tokens from callback.')
      setTokens(accessToken, refreshToken, 3600)
      const { data } = await api.get('/auth/me')
      return { type, user: normalizeUser(data) }
    }

    if (type === 'recovery') {
      if (!accessToken) throw new Error('Missing recovery token.')
      localStorage.setItem(STORAGE.recoveryToken, accessToken)
      return { type: 'recovery' }
    }

    throw new Error('Unknown callback type.')
  },

  googleSignIn: () => {
    window.location.href = `${BASE_URL}/auth/google`
  },
}
