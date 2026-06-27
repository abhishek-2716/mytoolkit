import { useEffect } from 'react'
import { useThemeStore } from '@/store'

/** Access and control the application theme */
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useThemeStore()

  // Listen for OS-level theme changes when user prefers "system"
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = mediaQuery.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return { theme, resolvedTheme, setTheme, isDark: resolvedTheme === 'dark' }
}
