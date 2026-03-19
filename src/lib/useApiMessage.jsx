/**
 * useApiMessage
 *
 * A single source of truth for surfacing backend messages and errors
 * across all auth and API interactions.
 *
 * Usage:
 *   const msg = useApiMessage()
 *
 *   // On success — pull message from API response
 *   const res = await someApiCall()
 *   msg.setFromResponse(res)          // shows green success message
 *
 *   // On error — pull message from thrown error
 *   catch (err) { msg.setFromError(err) }  // shows red error message
 *
 *   // In JSX
 *   <ApiMessage state={msg.state} />
 *
 *   // Reset
 *   msg.clear()
 */

import { useState, useCallback } from 'react'

// ── Message extractor ─────────────────────────────────────────────────────────
// Pulls the most useful human-readable string out of any API response or error.

function extractMessage(source) {
  if (!source) return null

  // Axios error with response data
  if (source?.response?.data) {
    const d = source.response.data
    if (d.message) return Array.isArray(d.message) ? d.message.join(' ') : String(d.message)
    if (d.error)   return Array.isArray(d.error)   ? d.error.join(' ')   : String(d.error)
  }

  // Plain Error object or anything with .message
  if (source?.message) return String(source.message)

  // Raw API response object (success case)
  if (typeof source === 'object') {
    if (source.message) return Array.isArray(source.message) ? source.message.join(' ') : String(source.message)
    if (source.error)   return String(source.error)
  }

  if (typeof source === 'string') return source

  return null
}

// Sanitize server internals from leaking to users
function sanitize(msg) {
  if (!msg) return null
  const lower = msg.toLowerCase()
  if (
    lower.includes('internal server error') ||
    lower.includes('stack trace') ||
    lower.includes(' sql ') ||
    lower.includes('database error')
  ) {
    return 'Something went wrong on our end. Please try again.'
  }
  return msg
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApiMessage() {
  const [state, setState] = useState(null)
  // state shape: { type: 'success' | 'error', text: string } | null

  const setFromResponse = useCallback((res) => {
    const text = sanitize(extractMessage(res))
    if (text) setState({ type: 'success', text })
  }, [])

  const setFromError = useCallback((err) => {
    const text = sanitize(extractMessage(err)) || 'Something went wrong. Please try again.'
    setState({ type: 'error', text })
  }, [])

  const setSuccess = useCallback((text) => {
    setState({ type: 'success', text })
  }, [])

  const setError = useCallback((text) => {
    setState({ type: 'error', text })
  }, [])

  const clear = useCallback(() => setState(null), [])

  return { state, setFromResponse, setFromError, setSuccess, setError, clear }
}

// ── ApiMessage display component ──────────────────────────────────────────────
// Drop this anywhere in JSX — renders nothing when state is null.

export function ApiMessage({ state }) {
  if (!state?.text) return null

  const isSuccess = state.type === 'success'

  const styles = isSuccess
    ? {
        wrapper: {
          borderRadius: 10,
          background: 'rgba(34,197,94,0.07)',
          border: '1px solid rgba(34,197,94,0.22)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          marginBottom: 14,
        },
        dot: {
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--green)', flexShrink: 0, marginTop: 4,
        },
        text: { color: 'var(--green)', fontSize: 13.5, lineHeight: 1.6, fontWeight: 500 },
      }
    : {
        wrapper: {
          borderRadius: 10,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.22)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          marginBottom: 14,
        },
        dot: {
          width: 7, height: 7, borderRadius: '50%',
          background: '#ef4444', flexShrink: 0, marginTop: 4,
        },
        text: { color: '#ef4444', fontSize: 13.5, lineHeight: 1.6, fontWeight: 500 },
      }

  return (
    <div style={styles.wrapper}>
      <div style={styles.dot} />
      <p style={styles.text}>{state.text}</p>
    </div>
  )
}
