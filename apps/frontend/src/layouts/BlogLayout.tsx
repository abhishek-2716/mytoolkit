import { Outlet } from 'react-router-dom'

/** BlogLayout — dedicated layout for blog listing and article pages (Task-002) */
export function BlogLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
