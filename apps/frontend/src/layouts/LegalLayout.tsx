import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/components/layout'

/**
 * LegalLayout — shell for legal and policy pages (Privacy, Terms, Cookies).
 *
 * Differences from PublicLayout:
 *  - Narrow prose width (reading-optimized)
 *  - Standard sticky header for navigation
 *  - Last updated / breadcrumb slot (added in TASK-005)
 *  - Full footer for trust signals
 *
 * Used by: /privacy, /terms, /cookies
 */
export function LegalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Accessibility: skip navigation ── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Header — Navbar implemented in TASK-005 ── */}
      <header
        role="banner"
        className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-background/95 backdrop-blur-sm"
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Placeholder — replaced by <Navbar /> in TASK-005 */}
          <span className="type-label font-bold text-foreground">ToolNest</span>
          <nav aria-label="Primary navigation" />
        </div>
      </header>

      {/* ── Main content — narrow reading width ── */}
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── Footer — implemented in TASK-005 ── */}
      <footer role="contentinfo" className="border-t border-border bg-surface">
        <div className="container py-10">
          <p className="text-center type-caption text-foreground-muted">
            © {new Date().getFullYear()} ToolNest — All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
