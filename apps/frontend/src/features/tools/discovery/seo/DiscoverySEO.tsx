import { Helmet } from 'react-helmet-async'

import { appConfig, seoConfig } from '@/config'

import type { ToolCategoryMeta, ToolMeta } from '@/registry'
import { registryStats } from '@/registry'

/* ─── Tools Page SEO ──────────────────────────────────────────────────────── */

interface ToolsPageSEOProps {
  query?: string
  categoryName?: string
}

export function ToolsPageSEO({ query, categoryName }: ToolsPageSEOProps) {
  const siteName = appConfig.name
  const siteUrl = appConfig.url

  const title = query
    ? `Search: "${query}" — ${siteName}`
    : categoryName
      ? `${categoryName} | Free Online Tools — ${siteName}`
      : `Free Online Tools — ${registryStats.totalTools}+ Tools | ${siteName}`

  const description = query
    ? `Search results for "${query}" — browse free online tools`
    : `${registryStats.totalTools}+ free online tools for PDF, images, text, developer utilities, calculators, and more. No installation, no registration, works in your browser.`

  const canonical = `${siteUrl}/tools${query ? `?q=${encodeURIComponent(query)}` : ''}`

  const keywords = query
    ? [`${query} tool online free`, `${query} online`, `free ${query} tool`]
    : [
        'free online tools no signup',
        'pdf tools online free',
        'image tools online free',
        'text tools online',
        'developer tools online free',
        'free calculator online',
        'password generator free',
        'online tools 2025',
        'browser-based tools no download',
        'best free web tools',
        'tools for students free',
        'compress pdf free online',
        'resize image online free',
        'json formatter online',
      ]

  /* JSON-LD: WebSite with SiteLinksSearchBox */
  const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Helmet>
      <html lang={seoConfig.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={seoConfig.defaultRobots} />
      <meta name="author" content={siteName} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoConfig.defaultOgImage} />
      <meta property="og:image:width" content={seoConfig.ogImageWidth} />
      <meta property="og:image:height" content={seoConfig.ogImageHeight} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.creator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoConfig.defaultOgImage} />
      <script type="application/ld+json">{JSON.stringify(searchSchema)}</script>
    </Helmet>
  )
}

/* ─── Category Page SEO ───────────────────────────────────────────────────── */

interface CategoryPageSEOProps {
  category: ToolCategoryMeta
  toolCount: number
  tools?: ToolMeta[]
}

export function CategoryPageSEO({ category, toolCount, tools = [] }: CategoryPageSEOProps) {
  const siteName = appConfig.name
  const siteUrl = appConfig.url
  const canonical = `${siteUrl}/category/${category.slug}`

  const title = `Free ${category.name} Online — ${toolCount} Tools | ${siteName}`
  const description = `${toolCount} free ${category.name.toLowerCase()} tools online. ${category.description} No signup, no download — works instantly in your browser.`

  const keywords = [
    `free ${category.name.toLowerCase()} tools online`,
    `${category.name.toLowerCase()} tools no signup`,
    `best free ${category.name.toLowerCase()} tools`,
    `online ${category.name.toLowerCase()} tools 2025`,
    `${category.name.toLowerCase()} tools for free`,
    `${category.name.toLowerCase()} tool browser`,
    `${category.name.toLowerCase()} tools free no registration`,
  ]

  /* JSON-LD: CollectionPage */
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Free ${category.name} Tools Online`,
    description,
    url: canonical,
    numberOfItems: toolCount,
    inLanguage: seoConfig.language,
    isPartOf: { '@type': 'WebSite', name: siteName, url: siteUrl },
  }

  /* JSON-LD: ItemList of tools */
  const itemListSchema =
    tools.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${category.name} Tools`,
          description,
          url: canonical,
          numberOfItems: tools.length,
          itemListElement: tools.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.title,
            description: t.shortDescription,
            url: `${siteUrl}/tools/${t.slug}`,
          })),
        }
      : null

  /* JSON-LD: BreadcrumbList */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: `${category.name} Tools`, item: canonical },
    ],
  }

  return (
    <Helmet>
      <html lang={seoConfig.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={seoConfig.defaultRobots} />
      <meta name="author" content={siteName} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoConfig.defaultOgImage} />
      <meta property="og:image:width" content={seoConfig.ogImageWidth} />
      <meta property="og:image:height" content={seoConfig.ogImageHeight} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.creator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoConfig.defaultOgImage} />
      <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      {itemListSchema && (
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      )}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  )
}

/* ─── Search Page SEO ─────────────────────────────────────────────────────── */

interface SearchPageSEOProps {
  query?: string
  resultCount?: number
}

export function SearchPageSEO({ query, resultCount }: SearchPageSEOProps) {
  const siteName = appConfig.name
  const siteUrl = appConfig.url
  const canonical = `${siteUrl}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`

  const title = query
    ? `Search Results for "${query}" — ${resultCount ?? 0} tools | ${siteName}`
    : `Search Free Online Tools | ${siteName}`

  const description = query
    ? `Found ${resultCount ?? 0} free tools matching "${query}" — ${siteName}`
    : `Search ${registryStats.totalTools}+ free online tools. Find PDF converters, image tools, text utilities, developer tools, calculators and more instantly.`

  const keywords = query
    ? [`${query} free online`, `${query} tool`, `free ${query}`]
    : [
        'search free online tools',
        'find online tools free',
        'tool finder online',
        'free utility tools search',
      ]

  return (
    <Helmet>
      <html lang={seoConfig.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="noindex, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoConfig.defaultOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}

/* ─── Active Tools Page SEO ───────────────────────────────────────────────── */

interface ActiveToolsPageSEOProps {
  totalActive: number
}

export function ActiveToolsPageSEO({ totalActive }: ActiveToolsPageSEOProps) {
  const siteName = appConfig.name
  const siteUrl = appConfig.url
  const canonical = `${siteUrl}/active-tools`

  const title = `${totalActive} Active Free Online Tools | ${siteName}`
  const description = `Browse all ${totalActive} working free online tools — JSON formatter, image compressor, PDF tools, text utilities, calculators and more. Every tool works right now in your browser.`

  const keywords = [
    'working free online tools',
    'active online tools',
    'free tools that work now',
    'best free online tools 2025',
    'browser tools no download',
    'free tools no signup',
    'online utilities free',
    'free developer tools online',
    'free image tools online',
    'free text tools online',
    'free calculator tools',
    'tools that work in browser',
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Active Tools', item: canonical },
    ],
  }

  return (
    <Helmet>
      <html lang={seoConfig.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={seoConfig.defaultRobots} />
      <meta name="author" content={siteName} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoConfig.defaultOgImage} />
      <meta property="og:image:width" content={seoConfig.ogImageWidth} />
      <meta property="og:image:height" content={seoConfig.ogImageHeight} />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.creator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoConfig.defaultOgImage} />
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  )
}
