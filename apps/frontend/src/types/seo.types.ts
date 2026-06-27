/** Props consumed by the SEO head component (implemented in Task-002) */
export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  noIndex?: boolean
  openGraph?: OpenGraphProps
  twitter?: TwitterCardProps
  /** Raw JSON-LD structured data object */
  structuredData?: Record<string, unknown>
  breadcrumbs?: BreadcrumbSchema[]
}

export interface OpenGraphProps {
  type?: 'website' | 'article' | 'product'
  title?: string
  description?: string
  /** Absolute URL to the OG image (1200×630 recommended) */
  image?: string
  imageAlt?: string
  url?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image' | 'player'
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  creator?: string
}

/** JSON-LD breadcrumb item */
export interface BreadcrumbSchema {
  name: string
  url: string
}
