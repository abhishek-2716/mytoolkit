import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { appConfig, seoConfig } from '@/config'

/** BlogArticlePage — Single article. Full implementation in Task-005. */
export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const title = slug?.replace(/-/g, ' ') ?? 'Article'
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1)
  const canonical = `${appConfig.url}/blog/${slug ?? ''}`
  const description = `Read: ${capitalizedTitle} — Tips, tutorials and guides on using free online tools for PDF, images, text, and more.`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: capitalizedTitle,
    description,
    url: canonical,
    inLanguage: seoConfig.language,
    author: {
      '@type': 'Organization',
      name: appConfig.name,
      url: appConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: appConfig.name,
      url: appConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${appConfig.url}/logo.png`,
      },
    },
    isPartOf: {
      '@type': 'Blog',
      name: `${appConfig.name} Blog`,
      url: `${appConfig.url}/blog`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: appConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${appConfig.url}/blog` },
      { '@type': 'ListItem', position: 3, name: capitalizedTitle, item: canonical },
    ],
  }

  return (
    <>
      <Helmet>
        <html lang={seoConfig.language} />
        <title>{`${capitalizedTitle} | ${appConfig.name}`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${title}, online tools guide, free tools tutorial, how to use online tools`} />
        <meta name="robots" content={seoConfig.defaultRobots} />
        <meta name="author" content={appConfig.name} />
        <meta name="publisher" content={appConfig.name} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={capitalizedTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={seoConfig.defaultOgImage} />
        <meta property="og:image:width" content={seoConfig.ogImageWidth} />
        <meta property="og:image:height" content={seoConfig.ogImageHeight} />
        <meta property="og:site_name" content={appConfig.name} />
        <meta property="og:locale" content={seoConfig.locale} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={seoConfig.twitter.site} />
        <meta name="twitter:creator" content={seoConfig.twitter.creator} />
        <meta name="twitter:title" content={capitalizedTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={seoConfig.defaultOgImage} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold capitalize">{slug?.replace(/-/g, ' ')}</h1>
        <p className="mt-4" style={{ color: 'var(--color-muted-foreground)' }}>
          Article content — implementation in Task-005.
        </p>
      </section>
    </>
  )
}
