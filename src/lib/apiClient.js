import axios from 'axios'

export const BASE_URL =
  import.meta.env.VITE_API_BASE || 'https://avertune-backend.onrender.com/api'

export const STORAGE = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  expiresAt: 'token_expires_at',
  recoveryToken: 'recovery_access_token',
}

export function getTokens() {
  return {
    accessToken: localStorage.getItem(STORAGE.accessToken),
    refreshToken: localStorage.getItem(STORAGE.refreshToken),
    expiresAt: Number(localStorage.getItem(STORAGE.expiresAt) || 0),
  }
}

export function setTokens(accessToken, refreshToken, expiresInSeconds) {
  localStorage.setItem(STORAGE.accessToken, accessToken)
  localStorage.setItem(STORAGE.refreshToken, refreshToken)
  if (expiresInSeconds) {
    localStorage.setItem(
      STORAGE.expiresAt,
      String(Date.now() + expiresInSeconds * 1000),
    )
  }
}

export function clearTokens() {
  Object.values(STORAGE).forEach((k) => localStorage.removeItem(k))
}

// --- Axios instance ---
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const { accessToken } = getTokens()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

// Track if we're already refreshing to prevent loops
let isRefreshing = false
let refreshQueue = []

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  )
  refreshQueue = []
}

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const { refreshToken } = getTokens()

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        setTokens(data.access_token, data.refresh_token, data.expires_in || 3600)
        processQueue(null, data.access_token)
        original.headers.Authorization = `Bearer ${data.access_token}`
        return api(original)
      } catch (err) {
        processQueue(err, null)
        clearTokens()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    // Extract friendly error message
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong.'

    return Promise.reject(new Error(sanitize(msg)))
  },
)

function sanitize(msg) {
  if (!msg) return 'Something went wrong. Please try again.'
  const lower = String(msg).toLowerCase()
  if (
    lower.includes('internal server error') ||
    lower.includes('sql') ||
    lower.includes('database') ||
    lower.includes('stack')
  )
    return 'Something went wrong on the server. Please try again.'
  return String(msg)
}
