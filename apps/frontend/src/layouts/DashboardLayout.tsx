import { Outlet } from 'react-router-dom'

/**
 * DashboardLayout — placeholder for Phase 2 (authenticated user dashboard).
 *
 * ⚠️  NOT YET IMPLEMENTED — Phase 2 placeholder only.
 *
 * Phase 2 will add:
 *  - Authentication guard (redirect to /login if unauthenticated)
 *  - Collapsible sidebar navigation
 *  - Dashboard-specific header (user menu, notifications)
 *  - Breadcrumb navigation
 *  - Content area with sidebar layout
 *  - Mobile-responsive drawer
 *
 * Routes using this layout (Phase 2):
 *  - /dashboard
 *  - /dashboard/tools
 *  - /dashboard/history
 *  - /dashboard/settings
 *  - /dashboard/billing (Phase 5)
 */
export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background-subtle text-foreground">
      <main id="main-content" role="main" className="flex-1 outline-none" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
