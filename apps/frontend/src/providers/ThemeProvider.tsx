import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/store'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Syncs the Zustand theme store with the DOM attribute data-theme.
 * Handles both manual theme selection and OS-level preference changes.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, resolvedTheme } = useThemeStore()

  // Apply resolved theme on mount and whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  // Watch OS preference changes when theme is "system"
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [theme])

  return <>{children}</>
}
