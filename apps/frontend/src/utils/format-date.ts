/**
 * Format a date string or Date into a human-readable long form.
 *
 * @example formatDate('2025-01-15T10:30:00Z') → 'January 15, 2025'
 */
export function formatDate(date: Date | string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format a date into a short numeric form.
 *
 * @example formatDateShort('2025-01-15') → '01/15/2025'
 */
export function formatDateShort(date: Date | string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

/**
 * Format a date relative to now (e.g. "3 days ago").
 * Falls back to formatDate() for dates older than 1 year.
 */
export function formatRelativeDate(date: Date | string, locale = 'en-US'): string {
  const then = new Date(date)
  const diffMs = Date.now() - then.getTime()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr = Math.round(diffMin / 60)
  const diffDay = Math.round(diffHr / 24)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffSec < 60) return rtf.format(-diffSec, 'second')
  if (diffMin < 60) return rtf.format(-diffMin, 'minute')
  if (diffHr < 24) return rtf.format(-diffHr, 'hour')
  if (diffDay < 7) return rtf.format(-diffDay, 'day')
  if (diffDay < 30) return rtf.format(-Math.round(diffDay / 7), 'week')
  if (diffDay < 365) return rtf.format(-Math.round(diffDay / 30), 'month')

  return formatDate(then, locale)
}
