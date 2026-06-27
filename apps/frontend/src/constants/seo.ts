/** SEO character limits and conventions */
export const SEO = {
  /** Recommended max title length for Google SERPs */
  MAX_TITLE_LENGTH: 60,
  /** Recommended max meta description length */
  MAX_DESCRIPTION_LENGTH: 160,
  /** Max keywords in meta keywords tag (mostly legacy) */
  MAX_KEYWORDS: 10,
  /** Separator used in title template: "Page Title | ToolNest" */
  TITLE_SEPARATOR: '|',
  /** Default robots directive */
  DEFAULT_ROBOTS: 'index, follow',
  /** Noindex/nofollow for private or admin pages */
  NOINDEX_ROBOTS: 'noindex, nofollow',
  /** JSON-LD context URL */
  SCHEMA_CONTEXT: 'https://schema.org',
} as const
