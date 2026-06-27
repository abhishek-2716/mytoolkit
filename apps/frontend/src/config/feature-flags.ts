/** Parse a boolean feature flag from an env var string */
function parseFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') return defaultValue
  return value === 'true'
}

/**
 * Central feature flag registry.
 *
 * Flags prefixed VITE_ENABLE_* are configurable via environment variables.
 * Flags without env counterparts are hardcoded to their current phase status.
 *
 * To enable a feature in a specific environment, set the env var in .env:
 *   VITE_ENABLE_BLOG=true
 */
export const featureFlags = {
  // ── Environment-driven flags ───────────────────────────────────
  /** Show/hide the blog section site-wide */
  enableBlog: parseFlag(import.meta.env.VITE_ENABLE_BLOG, true),
  /** Enable Google Analytics or similar tracking */
  enableAnalytics: parseFlag(import.meta.env.VITE_ENABLE_ANALYTICS, false),
  /** Enable the global search modal and search page */
  enableSearch: parseFlag(import.meta.env.VITE_ENABLE_SEARCH, true),
  /** Enable AI-powered tools (Phase 5) */
  enableAI: parseFlag(import.meta.env.VITE_ENABLE_AI, false),

  // ── Phase-gated flags (hardcoded until the phase is implemented) ─
  /** User accounts, login, registration — Phase 2 */
  enableAuthentication: false,
  /** Premium subscription features — Phase 5 */
  enablePremium: false,
  /** OCR / document scanning — Phase 5 */
  enableOCR: false,
  /** Public developer API — Phase 5 */
  enablePublicAPI: false,
  /** Browser extension support — Phase 5 */
  enableExtension: false,
} as const

export type FeatureFlag = keyof typeof featureFlags

/** Type-safe feature flag check */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag]
}
