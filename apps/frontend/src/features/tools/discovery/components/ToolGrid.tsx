import { memo } from 'react'

import type { ToolMeta } from '@/registry'

import { ToolCard, type ToolCardVariant } from './ToolCard'

interface ToolGridProps {
  tools: ToolMeta[]
  variant?: ToolCardVariant
  showCategory?: boolean
  columns?: 2 | 3 | 4
  /** When true, renders "N tools" count above the grid */
  showCount?: boolean
  className?: string
}

/**
 * ToolGrid
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Responsive grid of ToolCards.
 * Column count adjusts at breakpoints:
 *  - columns=2: 1→2 columns (sm)
 *  - columns=3: 1→2 (sm)→3 (lg) columns
 *  - columns=4: 1→2 (sm)→3 (md)→4 (xl) columns
 *
 * Performance:
 *  - ToolCard is memoized — only re-renders when tool data changes
 *  - The grid itself is memoized — stable reference prevents cascades
 *  - Cards have consistent height via flex-col layout (virtualization-ready)
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export const ToolGrid = memo(function ToolGrid({
  tools,
  variant = 'default',
  showCategory = false,
  columns = 3,
  showCount = false,
  className,
}: ToolGridProps) {
  const colClass: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={className}>
      {showCount && (
        <p className="text-sm text-foreground-muted mb-4" aria-live="polite" aria-atomic="true">
          {tools.length === 0
            ? 'No tools found'
            : `${tools.length} tool${tools.length !== 1 ? 's' : ''}`}
        </p>
      )}
      <div
        className={`grid gap-4 ${colClass[columns]}`}
        role="list"
        aria-label="Tools"
      >
        {tools.map((tool) => (
          <div key={tool.id} role="listitem" className="flex w-full min-w-0">
            <ToolCard tool={tool} variant={variant} showCategory={showCategory} />
          </div>
        ))}
      </div>
    </div>
  )
})
