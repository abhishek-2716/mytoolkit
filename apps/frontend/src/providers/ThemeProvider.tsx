import { type ReactNode, useEffect } from 'react'

import { themeConfig } from '@/config'

import { useThemeStore } from '@/store'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * ThemeProvider — global appearance manager.
 *
 * Responsibilities:
 *  1. Syncs the Zustand resolved theme to the DOM `data-theme` attribute on
 *     mount and whenever the user changes their preference.
 *  2. Listens for OS preference changes (prefers-color-scheme media query)
 *     and calls `syncSystemTheme` when the user has selected "System" mode.
 *
 * This is the ONLY place in the codebase that registers an OS change listener.
 * Components should never register their own OS listeners — consume `useTheme` instead.
 *
 * Note: The no-flash inline script in index.html handles the initial theme
 * application before React mounts. This provider takes over from there.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((s) => s.theme)
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const syncSystemTheme = useThemeStore((s) => s.syncSystemTheme)

  // ── Sync DOM attribute whenever the resolved theme changes ──
  useEffect(() => {
    document.documentElement.setAttribute(themeConfig.attribute, resolvedTheme)
  }, [resolvedTheme])

  // ── Listen for OS preference changes when the user has selected "system" ──
  useEffect(() => {
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    // Call once immediately to correct any mismatch after hydration
    syncSystemTheme()

    mq.addEventListener('change', syncSystemTheme)
    return () => {
      mq.removeEventListener('change', syncSystemTheme)
    }
  }, [theme, syncSystemTheme])

  return <>{children}</>
}
