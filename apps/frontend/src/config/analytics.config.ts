/**
 * Analytics Configuration — MyToolsHub
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Placeholders for Google Analytics 4, Google Tag Manager, and
 * Microsoft Clarity. Replace the empty strings with real IDs when ready.
 *
 * All tracking is opt-in via feature flags. No scripts are injected
 * unless the corresponding ID is set.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

export const analyticsConfig = {
  /** Google Analytics 4 Measurement ID — e.g. 'G-XXXXXXXXXX' */
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID ?? '',

  /** Google Tag Manager Container ID — e.g. 'GTM-XXXXXXX' */
  gtmContainerId: import.meta.env.VITE_GTM_CONTAINER_ID ?? '',

  /** Microsoft Clarity Project ID */
  clarityProjectId: import.meta.env.VITE_CLARITY_PROJECT_ID ?? '',

  /** Whether any analytics is currently active */
  get isEnabled() {
    return !!(this.ga4MeasurementId || this.gtmContainerId || this.clarityProjectId)
  },
} as const

/* ─── Event names (type-safe) ────────────────────────────────────────────── */

export type AnalyticsEvent =
  | 'tool_view'
  | 'tool_process'
  | 'tool_download'
  | 'tool_copy'
  | 'tool_share'
  | 'tool_error'
  | 'search_query'
  | 'category_view'
  | 'newsletter_signup'
  | 'contact_form_submit'

export interface AnalyticsEventPayload {
  event: AnalyticsEvent
  tool_id?: string
  tool_slug?: string
  category?: string
  query?: string
  error_code?: string
  [key: string]: string | number | boolean | undefined
}
