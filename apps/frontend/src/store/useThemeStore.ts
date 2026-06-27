import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { ResolvedTheme, ThemeValue } from '@/config'
import { themeConfig } from '@/config'

/* ────────────────────────────────────────────────────────────────────────────
   Pure helper functions — no side effects, safe to call anywhere
   ──────────────────────────────────────────────────────────────────────────── */

/** Read the OS color scheme preference. Returns 'light' as SSR fallback. */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Resolve a ThemeValue to the concrete 'light' | 'dark' that should be applied. */
function resolveTheme(theme: ThemeValue): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

/**
 * Apply the resolved theme to the DOM.
 * Called by setTheme, syncSystemTheme, and onRehydrateStorage.
 * ThemeProvider mirrors this via useEffect as a safety net.
 */
function applyThemeToDom(resolved: ResolvedTheme): void {
  document.documentElement.setAttribute(themeConfig.attribute, resolved)

  // Keep browser chrome (address bar, status bar on mobile) in sync
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) {
    meta.content = resolved === 'dark' ? '#1e1e2e' : '#ffffff'
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Store interface
   ──────────────────────────────────────────────────────────────────────────── */

export interface ThemeState {
  /** The user's stored preference — 'light' | 'dark' | 'system' */
  theme: ThemeValue
  /** The concrete theme currently applied to the DOM */
  resolvedTheme: ResolvedTheme

  /**
   * Change the user's theme preference.
   * Immediately updates state, applies to DOM, and persists to localStorage.
   */
  setTheme: (theme: ThemeValue) => void

  /**
   * Called by ThemeProvider when the OS preference changes while the user
   * has chosen 'system'. Updates resolvedTheme without touching the stored
   * preference.
   */
  syncSystemTheme: () => void
}

/* ────────────────────────────────────────────────────────────────────────────
   Store
   ──────────────────────────────────────────────────────────────────────────── */

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: themeConfig.default,
      resolvedTheme: resolveTheme(themeConfig.default),

      setTheme: (theme) => {
        const resolved = resolveTheme(theme)
        applyThemeToDom(resolved)
        set({ theme, resolvedTheme: resolved })
      },

      syncSystemTheme: () => {
        const { theme } = get()
        if (theme !== 'system') return
        const resolved = getSystemTheme()
        applyThemeToDom(resolved)
        set({ resolvedTheme: resolved })
      },
    }),
    {
      name: themeConfig.storageKey,
      /**
       * Only persist the user's preference — resolvedTheme is derived and
       * must not be persisted (it would become stale across OS changes).
       */
      partialize: (state) => ({ theme: state.theme }),

      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Re-derive resolvedTheme from the restored preference + current OS setting.
        // This is the canonical correction step after hydration.
        const resolved = resolveTheme(state.theme)
        applyThemeToDom(resolved)
        state.resolvedTheme = resolved
      },
    }
  )
)
