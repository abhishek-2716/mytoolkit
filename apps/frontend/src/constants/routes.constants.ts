/**
 * Application route path constants.
 * Use these instead of hardcoding strings in <Link> or navigate().
 */
export const ROUTES = {
  HOME: '/',
  TOOLS: '/tools',
  ACTIVE_TOOLS: '/active-tools',
  TOOL_DETAIL: '/tools/:slug',
  CATEGORY: '/category/:slug',
  SEARCH: '/search',
  BLOG: '/blog',
  BLOG_ARTICLE: '/blog/:slug',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  COOKIES: '/cookies',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
} as const

/** Build a dynamic tool page path */
export function buildToolPath(slug: string): string {
  return `/tools/${slug}`
}

/** Build a dynamic category page path */
export function buildCategoryPath(slug: string): string {
  return `/category/${slug}`
}

/** Build a dynamic blog article path */
export function buildBlogPath(slug: string): string {
  return `/blog/${slug}`
}
