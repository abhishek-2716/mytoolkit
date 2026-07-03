import { useCallback } from 'react'

import type { AnalyticsEvent, AnalyticsEventPayload } from '@/config/analytics.config'
import { analyticsConfig } from '@/config/analytics.config'

/**
 * useAnalytics
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Lightweight analytics hook. Sends events to:
 *  - Google Analytics 4 (via gtag) when GA4 ID is set
 *  - Google Tag Manager dataLayer when GTM ID is set
 *
 * Usage:
 *   const { track } = useAnalytics()
 *   track('tool_process', { tool_id: 'json-formatter' })
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useAnalytics() {
  const track = useCallback(
    (event: AnalyticsEvent, payload?: Omit<AnalyticsEventPayload, 'event'>) => {
      if (!analyticsConfig.isEnabled) return

      const fullPayload: AnalyticsEventPayload = { event, ...payload }

      // Google Analytics 4
      if (analyticsConfig.ga4MeasurementId) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const w = window as any
          if (typeof w.gtag === 'function') {
            w.gtag('event', event, payload ?? {})
          }
        } catch {
          // silently ignore if gtag is not available
        }
      }

      // Google Tag Manager dataLayer
      if (analyticsConfig.gtmContainerId) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const w = window as any
          w.dataLayer = w.dataLayer ?? []
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          w.dataLayer.push(fullPayload)
        } catch {
          // silently ignore
        }
      }
    },
    []
  )

  return { track }
}
