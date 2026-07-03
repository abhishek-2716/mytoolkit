import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { ScrollToTop } from '@/components/layout'
import { AppHeader, Footer, GlobalSearchModal } from '@/components/navigation'

/**
 * PublicLayout — shell for all general public-facing pages.
 *
 * Used by: Home, Tools listing, Category, Search, About, Contact, FAQ
 */
export function PublicLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  /* ── Global Ctrl+K / Cmd+K shortcut ─────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('keydown', handler); }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ── Accessibility: skip navigation ── */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Header ── */}
      <AppHeader mode="sticky" onSearchOpen={() => { setIsSearchOpen(true) }} />

      {/* ── Global search modal ── */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => { setIsSearchOpen(false) }}
      />

      {/* ── Main content ── */}
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  )
}
