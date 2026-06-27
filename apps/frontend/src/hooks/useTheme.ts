import type { ResolvedTheme, ThemeValue } from '@/config'

import { useThemeStore } from '@/store'

export interface UseThemeReturn {
  /**
   * The user's stored preference.
   * 'light' | 'dark' | 'system'
   */
  theme: ThemeValue

  /**
   * The concrete theme currently applied to the DOM.
   * Always 'light' or 'dark' — never 'system'.
   */
  resolvedTheme: ResolvedTheme

  /** Change the user's theme preference and immediately apply it. */
  setTheme: (theme: ThemeValue) => void

  /**
   * Toggle between light and dark.
   * Ignores the 'system' preference and sets an explicit value.
   * Useful for simple toggle buttons in the header.
   */
  toggle: () => void

  /**
   * Cycle through all three options: light → dark → system → light.
   * Useful for a single-button cycle control.
   */
  cycle: () => void

  /** True when the active (resolved) theme is dark. */
  isDark: boolean

  /** True when the active (resolved) theme is light. */
  isLight: boolean

  /** True when the user's preference is set to follow the OS. */
  isSystem: boolean
}

/**
 * useTheme — primary hook for reading and changing the application theme.
 *
 * All components that need theme information should use this hook.
 * Never read from localStorage directly, check data-theme, or use
 * window.matchMedia in components — use this hook instead.
 *
 * @example
 * const { isDark, toggle } = useTheme()
 * <button onClick={toggle}>{isDark ? 'Light mode' : 'Dark mode'}</button>
 *
 * @example
 * const { theme, setTheme } = useTheme()
 * <ThemeSwitcher value={theme} onChange={setTheme} />
 */
export function useTheme(): UseThemeReturn {
  const { theme, resolvedTheme, setTheme } = useThemeStore()

  return {
    theme,
    resolvedTheme,
    setTheme,

    toggle: () => {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    },

    cycle: () => {
      const next: Record<ThemeValue, ThemeValue> = {
        light: 'dark',
        dark: 'system',
        system: 'light',
      }
      setTheme(next[theme])
    },

    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  }
}
