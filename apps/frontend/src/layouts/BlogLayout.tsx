import { Outlet } from 'react-router-dom'

import { MinimalFooter, ScrollToTop } from '@/components/layout'
import { AppHeader } from '@/components/navigation'

/**
 * BlogLayout — shell for blog listing and article pages.
 *
 * Optimized for reading with a sticky header that stays
 * visible while scrolling through long articles.
 *
 * Used by: /blog, /blog/:slug
 */
export function BlogLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Accessibility: skip navigation ── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Header ── */}
      <AppHeader mode="sticky" />

      {/* ── Main content ── */}
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <MinimalFooter />
    </div>
  )
}
