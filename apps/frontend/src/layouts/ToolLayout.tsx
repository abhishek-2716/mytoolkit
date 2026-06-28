import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/components/layout'
import { AppHeader } from '@/components/navigation'

import { appConfig } from '@/config'

/**
 * ToolLayout — shell for individual tool pages.
 *
 * Uses 'solid' header mode (no transparency) so the tool UI
 * always has a clearly defined top boundary.
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

      {/* ── Header — solid mode; tool UI needs defined top boundary ── */}
      <AppHeader mode="solid" />

      {/* ── Main content ── */}
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── Minimal footer ── */}
      <footer role="contentinfo" className="border-t border-border bg-background py-4">
        <div className="container text-center type-caption text-foreground-muted">
          © {new Date().getFullYear()} {appConfig.name}
        </div>
      </footer>
    </div>
  )
}
