import { Helmet } from 'react-helmet-async'

import { appConfig, seoConfig } from '@/config'

import type { ToolMeta } from '@/registry'

interface ToolSEOHeadProps {
  tool: ToolMeta
}

/**
 * ToolSEOHead
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Full enterprise SEO head for every tool page:
 *  - title, description, keywords, canonical
 *  - robots: index, follow
 *  - author, publisher
 *  - Open Graph (with image dimensions)
 *  - Twitter Card (with creator)
 *  - hreflang (en + x-default)
 *  - JSON-LD: SoftwareApplication schema
 *  - JSON-LD: BreadcrumbList schema
 *  - JSON-LD: Organization schema
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolSEOHead({ tool }: ToolSEOHeadProps) {
  const siteUrl = appConfig.url
  const siteName = appConfig.name
  const canonicalUrl = `${siteUrl}/tools/${tool.slug}`
  const ogImage = tool.seo.ogImage ?? seoConfig.defaultOgImage

  /* ─── Category label for breadcrumb ─────────────────────────────────── */
  const categoryLabel = tool.category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const categoryUrl = `${siteUrl}/category/${tool.category}`

  /* ─── JSON-LD: SoftwareApplication ──────────────────────────────────── */
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.seo.title,
    description: tool.seo.description,
    url: canonicalUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    inLanguage: seoConfig.language,
    isAccessibleForFree: !tool.isPremium,
    offers: {
      '@type': 'Offer',
      price: tool.isPremium ? '5.00' : '0',
      priceCurrency: 'USD',
    },
    featureList: tool.tags.join(', '),
    keywords: tool.seo.keywords.join(', '),
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  }

  /* ─── JSON-LD: BreadcrumbList ────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${categoryLabel} Tools`,
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.title,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <Helmet>
      {/* ── Primary ── */}
      <html lang={seoConfig.language} />
      <title>{tool.seo.title} | {siteName}</title>
      <meta name="description" content={tool.seo.description} />
      {tool.seo.keywords.length > 0 && (
        <meta name="keywords" content={tool.seo.keywords.join(', ')} />
      )}
      <meta name="robots" content={seoConfig.defaultRobots} />
      <meta name="author" content={siteName} />
      <meta name="publisher" content={siteName} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Hreflang ── */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={tool.seo.title} />
      <meta property="og:description" content={tool.seo.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={tool.seo.title} />
      <meta property="og:image:width" content={seoConfig.ogImageWidth} />
      <meta property="og:image:height" content={seoConfig.ogImageHeight} />
      <meta property="og:image:type" content={seoConfig.ogImageType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={seoConfig.locale} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.creator} />
      <meta name="twitter:title" content={tool.seo.title} />
      <meta name="twitter:description" content={tool.seo.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={tool.seo.title} />

      {/* ── JSON-LD ── */}
      <script type="application/ld+json">
        {JSON.stringify(softwareAppSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  )
}
