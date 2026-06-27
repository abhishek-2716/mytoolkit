import { Outlet } from 'react-router-dom'

/** ToolLayout — dedicated layout for individual tool pages (Task-002) */
export function ToolLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
