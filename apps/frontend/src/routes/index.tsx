import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ErrorBoundary, PageLoader } from '@/components/layout'
import {
  BlogLayout,
  ErrorLayoutFallback,
  LegalLayout,
  MinimalLayout,
  PublicLayout,
  ToolLayout,
} from '@/layouts'

import { ROUTES } from '@/constants'

// ── Lazy-loaded pages ──────────────────────────────────────────────────────
// Public layout: Home, tools listing, category, search, about, contact, FAQ
const HomePage = lazy(() => import('@/pages/HomePage'))
const ToolsPage = lazy(() => import('@/pages/ToolsPage'))
const ActiveToolsPage = lazy(() => import('@/pages/ActiveToolsPage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const FaqPage = lazy(() => import('@/pages/FaqPage'))
// Tool layout: individual tool runner
const ToolDetailPage = lazy(() => import('@/pages/ToolDetailPage'))
// Blog layout: listing + articles
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const BlogArticlePage = lazy(() => import('@/pages/BlogArticlePage'))
// Legal layout: privacy, terms, cookies
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const CookiesPage = lazy(() => import('@/pages/CookiesPage'))
// Minimal layout: error pages
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const ServerErrorPage = lazy(() => import('@/pages/ServerErrorPage'))

/**
 * AppRouter — application routing tree.
 *
 * Layout assignment:
 *  - PublicLayout  → /, /tools, /category/:slug, /search, /about, /contact, /faq
 *  - ToolLayout    → /tools/:slug
 *  - BlogLayout    → /blog, /blog/:slug
 *  - LegalLayout   → /privacy, /terms, /cookies
 *  - MinimalLayout → /404, /500
 *  - Catch-all     → Navigate to /404
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={ErrorLayoutFallback}>
        <Suspense fallback={<PageLoader variant="page" />}>
          <Routes>
            {/* ── Public pages ── */}
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.TOOLS} element={<ToolsPage />} />
              <Route path={ROUTES.ACTIVE_TOOLS} element={<ActiveToolsPage />} />
              <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
              <Route path={ROUTES.SEARCH} element={<SearchPage />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />
              <Route path={ROUTES.CONTACT} element={<ContactPage />} />
              <Route path={ROUTES.FAQ} element={<FaqPage />} />
            </Route>

            {/* ── Tool runner ── */}
            <Route element={<ToolLayout />}>
              <Route path={ROUTES.TOOL_DETAIL} element={<ToolDetailPage />} />
            </Route>

            {/* ── Blog ── */}
            <Route element={<BlogLayout />}>
              <Route path={ROUTES.BLOG} element={<BlogPage />} />
              <Route path={ROUTES.BLOG_ARTICLE} element={<BlogArticlePage />} />
            </Route>

            {/* ── Legal ── */}
            <Route element={<LegalLayout />}>
              <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
              <Route path={ROUTES.TERMS} element={<TermsPage />} />
              <Route path={ROUTES.COOKIES} element={<CookiesPage />} />
            </Route>

            {/* ── Error pages ── */}
            <Route element={<MinimalLayout />}>
              <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
              <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
            </Route>

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
