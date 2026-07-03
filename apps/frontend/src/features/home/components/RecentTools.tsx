import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon, HistoryIcon } from 'lucide-react'

import { Section } from '@/components/layout'

import { useRecentTools } from '@/hooks'
import { cn } from '@/utils'
import { ROUTES } from '@/constants'

import { recentTools as fallbackTools, type HomeTool } from '../data/home.data'
import { ToolCard } from './ToolCard'

/* ─── helpers ───────────────────────────────────────────────────────────── */

/** Map a ToolMeta (from registry) into the HomeTool shape ToolCard expects. */
function toHomeTool(meta: import('@/registry').ToolMeta): HomeTool {
  return {
    id: meta.id,
    slug: meta.slug,
    name: meta.shortTitle,
    description: meta.shortDescription,
    icon: meta.icon,
    category: meta.category,
    categorySlug: meta.category,
    isNew: meta.isNew,
    isPopular: meta.isPopular,
  }
}

/* ─── RecentTools ────────────────────────────────────────────────────────── */

/**
 * RecentTools — shows user's recently visited tools (localStorage).
 * Falls back to "Recently Added" static list if no history yet.
 */
export function RecentTools() {
  const { recentTools: userRecentMeta, hasRecent } = useRecentTools()

  const tools: HomeTool[] = hasRecent ? userRecentMeta.map(toHomeTool) : fallbackTools
  const heading = hasRecent ? 'Recently Used' : 'Recently Added'
  const subtext = hasRecent
    ? 'Tools you visited recently.'
    : 'Fresh tools just added to the platform.'
  const ariaLabel = hasRecent ? 'Recently used tools' : 'Recently added tools'

  return (
    <Section variant="muted" container="wide" aria-labelledby="recent-heading">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {hasRecent && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
              <HistoryIcon size={18} />
            </span>
          )}
          <div>
            <h2 id="recent-heading" className="type-h2 text-foreground">
              {heading}
            </h2>
            <p className="mt-1 type-body-md text-foreground-secondary">{subtext}</p>
          </div>
        </div>
        <Link
          to={ROUTES.TOOLS}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 type-body-sm font-medium text-primary',
            'hover:gap-2.5 transition-all duration-150',
            'focus-visible:outline-none focus-visible:underline'
          )}
        >
          Browse all tools
          <ArrowRightIcon size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* Mobile: horizontal scroll */}
      <div
        className="flex gap-4 overflow-x-auto pb-2 sm:hidden"
        role="list"
        aria-label={ariaLabel}
        style={{ scrollbarWidth: 'none' }}
      >
        {tools.map((tool) => (
          <div key={tool.id} role="listitem" className="w-[260px] shrink-0">
            <ToolCard tool={tool} variant="compact" />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div
        className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        role="list"
        aria-label={ariaLabel}
      >
        {tools.map((tool, i) => (
          <motion.div
            key={tool.id}
            role="listitem"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
          >
            <ToolCard tool={tool} variant="compact" />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
