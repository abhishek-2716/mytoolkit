import { Outlet } from 'react-router-dom'

import { MinimalFooter, ScrollToTop } from '@/components/layout'
import { AppHeader } from '@/components/navigation'

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
      <MinimalFooter tagline="" />
    </div>
  )
}
