export type ThemeValue = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

function parseTheme(value: string | undefined): ThemeValue {
  if (value === 'light' || value === 'dark' || value === 'system') return value
  return 'system'
}

export const themeConfig = {
  /** Default theme on first visit */
  default: parseTheme(import.meta.env.VITE_DEFAULT_THEME),
  /** All supported theme values */
  supported: ['light', 'dark', 'system'] as const satisfies ThemeValue[],
  /** localStorage key for persisting preference */
  storageKey: 'mytoolshub-theme',
  /** HTML attribute set on <html> to activate theme CSS */
  attribute: 'data-theme' as const,
} as const
