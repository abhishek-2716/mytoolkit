import { Outlet } from 'react-router-dom'

/**
 * PublicLayout — wraps all public-facing pages.
 * Includes placeholder Navbar and Footer (implemented in Task-002).
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navbar placeholder — Task-002 ─────────────────── */}
      <header
        className="sticky top-0 z-50 border-b bg-[var(--color-background)]"
        style={{ borderColor: 'var(--color-border)' }}
        aria-label="Site navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-lg font-bold tracking-tight">ToolNest</span>
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────── */}
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      {/* ── Footer placeholder — Task-002 ─────────────────── */}
      <footer
        className="border-t bg-[var(--color-surface)]"
        style={{ borderColor: 'var(--color-border)' }}
        aria-label="Site footer"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            © {new Date().getFullYear()} ToolNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
