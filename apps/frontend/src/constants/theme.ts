import type { ThemeValue } from '@/config'

/** Theme system constants — mirrors themeConfig for non-config contexts */
export const THEME = {
  /** All valid theme values */
  VALUES: ['light', 'dark', 'system'] as const satisfies ThemeValue[],
  /** Default theme applied on first visit */
  DEFAULT: 'system' as const satisfies ThemeValue,
  /** localStorage key for persistence */
  STORAGE_KEY: 'toolnest-theme',
  /** HTML attribute applied to <html> element */
  ATTRIBUTE: 'data-theme',
  /** Light theme identifier */
  LIGHT: 'light' as const,
  /** Dark theme identifier */
  DARK: 'dark' as const,
  /** System theme identifier */
  SYSTEM: 'system' as const,
} as const
