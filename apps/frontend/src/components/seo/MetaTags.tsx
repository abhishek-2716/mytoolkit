import { Helmet } from 'react-helmet-async'

import { seoConfig } from '@/config'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface MetaTagsProps {
  /** Page-specific title. Rendered as "Title | SiteName" via titleTemplate. */
  title?: string
  /** Override the default site description. */
  description?: string
  /** Canonical URL for this page. Defaults to the site root. */
  canonical?: string
  /** Absolute URL to an image for OG / Twitter previews (1200×630). */
  ogImage?: string
  /** Open Graph content type. @default 'website' */
  ogType?: 'website' | 'article'
  /** Prevent search engines from indexing this page. @default false */
  noIndex?: boolean
  /** Additional keywords merged with seoConfig defaults. */
  keywords?: string[]
  /**
   * Full robots directive string.
   * @default seoConfig.defaultRobots when noIndex is false
   * @default 'noindex, nofollow' when noIndex is true
   */
  robots?: string
  /** Article published date (ISO 8601). Only used when ogType='article'. */
  publishedTime?: string
  /** Article modified date (ISO 8601). Only used when ogType='article'. */
  modifiedTime?: string
  /** Author name. Falls back to seoConfig.author. */
  author?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function MetaTags({
  title,
  description = seoConfig.defaultDescription,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  keywords,
  robots,
  publishedTime,
  modifiedTime,
  author = seoConfig.author,
}: MetaTagsProps) {
  const fullTitle = title
    ? seoConfig.titleTemplate.replace('%s', title)
    : seoConfig.defaultTitle

  const canonicalUrl = canonical ?? seoConfig.siteUrl
  const allKeywords = [...seoConfig.defaultKeywords, ...(keywords ?? [])]
  const resolvedRobots = noIndex
    ? 'noindex, nofollow'
    : (robots ?? seoConfig.defaultRobots)
  const resolvedOgImage = ogImage ?? seoConfig.defaultOgImage

  return (
    <Helmet>
      {/* ── Primary ── */}
      <html lang={seoConfig.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="robots" content={resolvedRobots} />
      <meta name="author" content={author} />
      <meta name="publisher" content={seoConfig.publisher} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Theme color (respects prefers-color-scheme) ── */}
      <meta name="theme-color" media="(prefers-color-scheme: light)" content={seoConfig.themeColorLight} />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content={seoConfig.themeColorDark} />

      {/* ── Hreflang ── */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={seoConfig.locale} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content={seoConfig.ogImageWidth} />
      <meta property="og:image:height" content={seoConfig.ogImageHeight} />
      <meta property="og:image:type" content={seoConfig.ogImageType} />

      {/* ── Article-specific OG ── */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && (
        <meta property="article:author" content={author} />
      )}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content={seoConfig.twitter.card} />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.creator} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
    </Helmet>
  )
}
