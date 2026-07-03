import { Outlet } from 'react-router-dom'

import { MinimalFooter, ScrollToTop } from '@/components/layout'
import { AppHeader } from '@/components/navigation'

/**
 * LegalLayout — shell for legal and policy pages (Privacy, Terms, Cookies).
 *
 * Uses standard sticky header. Legal page content uses ContainerNarrow
 * internally for reading-optimized line length.
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

      {/* ── Header ── */}
      <AppHeader mode="sticky" />

      {/* ── Main content — pages manage their own container width ── */}
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <MinimalFooter tagline="All rights reserved." />
    </div>
  )
}
