import { appConfig } from './app.config'

export const seoConfig = {
  siteName: appConfig.name,
  /** e.g. "PDF to Word | ToolNest" */
  titleTemplate: `%s | ${appConfig.name}`,
  defaultTitle: `${appConfig.name} — Free Online Productivity Tools`,
  defaultDescription:
    'Free online tools for PDF, images, documents, text, and more. Fast, secure, no registration required.',
  defaultKeywords: [
    'online tools',
    'free tools',
    'pdf tools',
    'image tools',
    'productivity tools',
    'web tools',
  ],
  siteUrl: appConfig.url,
  locale: 'en_US',
  twitterHandle: '@toolnest',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: appConfig.name,
  },

  twitter: {
    card: 'summary_large_image',
    site: '@toolnest',
  },

  /** JSON-LD organization schema defaults */
  organization: {
    type: 'Organization',
    name: appConfig.name,
    url: appConfig.url,
  },
} as const
