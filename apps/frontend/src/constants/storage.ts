/** All localStorage / sessionStorage keys used by the application.
 *  Import from here instead of using string literals. */
export const STORAGE_KEYS = {
  /** Active theme preference: 'light' | 'dark' | 'system' */
  THEME: 'toolnest-theme',
  /** Recent tool search queries */
  RECENT_SEARCHES: 'toolnest-recent-searches',
  /** Recently used tools (slugs) */
  RECENT_TOOLS: 'toolnest-recent-tools',
  /** User's preferred UI language */
  LANGUAGE: 'toolnest-language',
  /** Cookie consent status */
  COOKIE_CONSENT: 'toolnest-cookie-consent',
  /** JWT auth token — Phase 2 */
  AUTH_TOKEN: 'toolnest_token',
  /** JWT refresh token — Phase 2 */
  REFRESH_TOKEN: 'toolnest_refresh_token',
  /** Number of recent searches to persist */
  MAX_RECENT_SEARCHES: 'toolnest-max-recent',
} as const

/** Maximum items to store in recent searches list */
export const MAX_RECENT_SEARCHES = 8

/** Maximum items to store in recent tools list */
export const MAX_RECENT_TOOLS = 10

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
