import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/components/layout'
import { AppHeader } from '@/components/navigation'

import { appConfig } from '@/config'

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

      {/* ── Footer — full version in TASK-006+ ── */}
      <footer role="contentinfo" className="border-t border-border bg-surface">
        <div className="container py-10">
          <p className="text-center type-caption text-foreground-muted">
            © {new Date().getFullYear()} {appConfig.name} — Free Online Productivity Tools
          </p>
        </div>
      </footer>
    </div>
  )
}
