import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/components/layout'

/**
 * ToolLayout — shell for individual tool pages.
 *
 * Differences from PublicLayout:
 *  - Header is less prominent (tool UI takes focus)
 *  - No sticky header (tools may need full viewport height)
 *  - Main has no padding (each tool manages its own spacing)
 *  - Minimal footer
 *
 * Used by: /tools/:slug (all individual tool pages)
 */
export function ToolLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Accessibility: skip navigation ── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Header — Navbar implemented in TASK-005 ── */}
      <header role="banner" className="border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between">
          {/* Placeholder — replaced by <Navbar /> in TASK-005 */}
          <span className="type-label font-bold text-foreground">ToolNest</span>
          <nav aria-label="Primary navigation" />
        </div>
      </header>

      {/* ── Main content ── */}
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── Minimal footer ── */}
      <footer role="contentinfo" className="border-t border-border bg-background py-4">
        <div className="container text-center type-caption text-foreground-muted">
          © {new Date().getFullYear()} ToolNest
        </div>
      </footer>
    </div>
  )
}
