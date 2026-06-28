import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/components/layout'
import { AppHeader } from '@/components/navigation'

import { appConfig } from '@/config'

/**
 * PublicLayout — shell for all general public-facing pages.
 *
 * Used by: Home, Tools listing, Category, Search, About, Contact, FAQ
 */
export function PublicLayout() {
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
