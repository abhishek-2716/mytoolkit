import type { ReactNode } from 'react'

import type { LayoutMode } from '../../types/tool-result.types'

interface ToolShellProps {
  children: ReactNode
  layoutMode: LayoutMode
}

/**
 * ToolShell
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The outer container for all tool pages.
 * Sets consistent max-width, spacing, and semantic structure.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolShell({ children }: ToolShellProps) {
  return (
    <main
      className="min-h-screen bg-background"
      aria-label="Tool page"
    >
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  )
}
