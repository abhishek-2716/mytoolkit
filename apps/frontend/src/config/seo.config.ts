import { appConfig } from './app.config'

export const seoConfig = {
  siteName: appConfig.name,
  /** e.g. "PDF to Word | MyToolsHub" */
  titleTemplate: `%s | ${appConfig.name}`,
  defaultTitle: `${appConfig.name} — Free Online Productivity Tools`,
  defaultDescription:
    'MyToolsHub offers 52+ free online tools for PDF, images, text, developers, calculators & generators. No signup. Works instantly in your browser.',
  defaultKeywords: [
    'online tools',
    'free tools',
    'pdf tools',
    'image tools',
    'productivity tools',
    'web tools',
    'developer tools',
    'free online tools no signup',
    'browser based tools',
    'free utilities online',
  ],
  siteUrl: appConfig.url,
  locale: 'en_US',
  language: 'en',
  twitterHandle: '@mytoolshub',

  /** Default OG image (1200×630). Override per page. */
  defaultOgImage: `${appConfig.url}/og-default.png`,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageType: 'image/png',

  /** Theme color for browser chrome. */
  themeColorLight: '#ffffff',
  themeColorDark: '#0f172a',

  /** Author / publisher shown in meta tags. */
  author: appConfig.name,
  publisher: appConfig.name,

  /** Default robots directive for indexable pages. */
  defaultRobots:
    'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: appConfig.name,
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mytoolshub',
    creator: '@mytoolshub',
  },

  /** JSON-LD organization schema defaults */
  organization: {
    type: 'Organization',
    name: appConfig.name,
    url: appConfig.url,
    logo: `${appConfig.url}/logo.png`,
    sameAs: ['https://twitter.com/mytoolshub'],
  },
} as const
