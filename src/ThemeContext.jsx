import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('av-theme') || 'system' } catch { return 'system' }
  })

  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  useEffect(() => {
    try { localStorage.setItem('av-theme', theme) } catch {}
    document.documentElement.setAttribute('data-theme', resolved)
  }, [theme, resolved])

  // Listen for system changes
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return <ThemeCtx.Provider value={{ theme, setTheme, resolved }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
