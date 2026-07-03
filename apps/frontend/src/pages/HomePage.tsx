import { JsonLd, MetaTags } from '@/components/seo'
import {
  ActiveToolsSection,
  CategoryGrid,
  FaqPreview,
  FeaturedGrid,
  HeroBanner,
  HowItWorks,
  NewsletterBanner,
  RecentTools,
  StatsBanner,
  UpcomingTools,
  WhyChooseUs,
} from '@/features/home'

import { appConfig, seoConfig } from '@/config'

/* ─── Structured data ────────────────────────────────────────────────────── */

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: appConfig.name,
  url: appConfig.url,
  description: seoConfig.defaultDescription,
  inLanguage: seoConfig.language,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${appConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: appConfig.name,
  url: appConfig.url,
  logo: {
    '@type': 'ImageObject',
    url: `${appConfig.url}/logo.png`,
    width: '200',
    height: '60',
  },
  description: seoConfig.defaultDescription,
  sameAs: seoConfig.organization.sameAs,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${appConfig.url}/contact`,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are all tools on MyToolsHub free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all tools on MyToolsHub are completely free to use. No registration, no credit card, no hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account to use the tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Every tool on MyToolsHub works without creating an account. Just visit the tool page and start using it instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my files safe? Do you store uploaded files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All processing happens entirely in your browser. No files are ever uploaded to our servers. Your data stays private.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which browsers are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyToolsHub works in all modern browsers including Chrome, Firefox, Safari, and Edge. No plugins or extensions needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many tools are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyToolsHub currently has 52+ active tools across categories including Developer Tools, Image Tools, Text Tools, SEO Tools, Calculators, and Generators.',
      },
    },
  ],
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

/**
 * HomePage — the main landing page of ToolNest.
 *
 * Sections (top → bottom):
 *  1. HeroBanner       — headline, search, CTAs
 *  2. CategoryGrid     — browse all tool categories
 *  3. FeaturedGrid     — most popular tools
 *  4. WhyChooseUs      — six platform advantages
 *  5. StatsBanner      — animated counters
 *  6. HowItWorks       — three-step explainer
 *  7. RecentTools      — recently added tools
 *  8. FaqPreview       — top 5 FAQ with accordion
 *  9. NewsletterBanner — email signup form
 *
 * Business logic: none — this page only composes feature components.
 */
export default function HomePage() {
  return (
    <>
      {/* ── SEO head tags ── */}
      <MetaTags
        title="Free Online Tools — PDF, Image, Text, Developer & More"
        description="MyToolsHub offers 52+ free online tools for PDF, images, text, developers, calculators & generators. No signup. No download. Works instantly in your browser."
        canonical={appConfig.url}
        keywords={[
          'free online pdf tools',
          'image resize compress online free',
          'text tools online no signup',
          'developer tools json formatter online',
          'free calculator online',
          'password generator online free',
          'online tools for students',
          'free tools for work',
          'best free online productivity tools',
          'tools online free no registration',
          'how to compress pdf online free',
          'how to resize image online free',
          'free tools for mac windows linux',
          'online tools that work in browser',
          'json formatter online free',
          'qr code generator free online',
          'sitemap generator free',
          'markdown preview online',
          'image to base64 converter',
          'color palette generator free',
        ]}
      />
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />

      {/* ── Page sections ── */}
      <HeroBanner />
      <CategoryGrid />
      <FeaturedGrid />
      <ActiveToolsSection />
      <WhyChooseUs />
      <StatsBanner />
      <HowItWorks />
      <RecentTools />
      <UpcomingTools />
      <FaqPreview />
      <NewsletterBanner />
    </>
  )
}
