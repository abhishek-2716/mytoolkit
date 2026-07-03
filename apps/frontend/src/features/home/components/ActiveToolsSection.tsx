import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronDownIcon, ZapIcon } from 'lucide-react'

import { ToolGrid } from '@/features/tools/discovery'

import { cn } from '@/utils'
import { ROUTES } from '@/constants'

import { getActiveTools, registryStats } from '@/registry'

const INITIAL_VISIBLE = 12
const LOAD_MORE_COUNT = 12

/* ─── ActiveToolsSection ─────────────────────────────────────────────────── */

/**
 * ActiveToolsSection — shows all currently usable (active + beta) tools.
 *
 * Uses the full discovery ToolCard which shows the "Instant" badge,
 * Popular/New/Beta labels, and proper hover interactions.
 *
 * Initially renders INITIAL_VISIBLE tools with a "Load more" button so
 * the page doesn't become overwhelming.
 */
export function ActiveToolsSection() {
  const allActive = useMemo(
    () =>
      getActiveTools().sort((a, b) => {
        // Popular → Featured → alphabetical
        const score = (t: typeof a) =>
          (t.isPopular ? 4 : 0) + (t.isFeatured ? 2 : 0) + (t.isNew ? 1 : 0)
        return score(b) - score(a)
      }),
    []
  )

  const [visible, setVisible] = useState(INITIAL_VISIBLE)
  const shown = allActive.slice(0, visible)
  const hasMore = visible < allActive.length

  if (allActive.length === 0) return null

  return (
    <section
      className="w-full bg-background"
      aria-labelledby="active-tools-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
              <ZapIcon className="w-3.5 h-3.5" aria-hidden="true" />
              Ready to Use
            </div>
            <h2
              id="active-tools-heading"
              className="type-h2 text-foreground"
            >
              All Active Tools
            </h2>
            <p className="mt-2 type-body-md text-foreground-secondary">
              {registryStats.activeTools} tools live and working right now — no signup, no download.
            </p>
          </div>
          <Link
            to={ROUTES.ACTIVE_TOOLS}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 type-body-sm font-medium text-primary',
              'hover:gap-2.5 transition-all duration-150',
              'focus-visible:outline-none focus-visible:underline'
            )}
          >
            View all active tools
            <ArrowRightIcon size={15} aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <ToolGrid tools={shown} columns={4} showCategory />

        {/* Load more / View all */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {hasMore && (
            <button
              type="button"
              onClick={() => { setVisible((v) => v + LOAD_MORE_COUNT) }}
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium',
                'border border-border text-foreground-muted bg-card',
                'hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors'
              )}
            >
              <ChevronDownIcon size={16} aria-hidden="true" />
              Show more ({allActive.length - visible} remaining)
            </button>
          )}
          <Link
            to={ROUTES.ACTIVE_TOOLS}
            className="text-sm text-foreground-muted hover:text-primary transition-colors underline underline-offset-2"
          >
            Browse all {registryStats.totalTools}+ tools on the tools page
          </Link>
        </div>
      </div>
    </section>
  )
}
