import { Outlet } from 'react-router-dom'

/**
 * MinimalLayout — distraction-free shell for error, maintenance, and splash pages.
 *
 * No header or footer. Content is vertically and horizontally centered.
 * Background uses the standard background token for theme compatibility.
 *
 * Used by: /404, /500, /maintenance (future), /coming-soon (future)
 */
export function MinimalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Back to home — always accessible even without a Navbar */}
      <div className="p-4">
        <a
          href="/"
          className="type-label text-foreground-muted hover:text-primary transition-colors"
        >
          ← ToolNest
        </a>
      </div>

      <main
        id="main-content"
        role="main"
        className="flex flex-1 items-center justify-center p-6"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  )
}
