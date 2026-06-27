import { Outlet } from 'react-router-dom'

/** MinimalLayout — used for standalone pages like 404, maintenance, coming soon */
export function MinimalLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  )
}
