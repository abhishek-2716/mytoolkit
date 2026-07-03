import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'

import { Section } from '@/components/layout'

import { cn } from '@/utils'
import { buildCategoryPath, ROUTES } from '@/constants'

import { upcomingTools } from '../data/home.data'

/* ─── UpcomingTools ──────────────────────────────────────────────────────── */

/**
 * UpcomingTools — grid of tools that are coming soon.
 *
 * Shown on the homepage BELOW active tools so users know what's planned.
 * Cards are non-interactive (no hover/click navigation to the tool) to
 * avoid the confusion of landing on a coming-soon page.
 */
export function UpcomingTools() {
  if (upcomingTools.length === 0) return null

  return (
    <Section container="wide" aria-labelledby="upcoming-heading">
      {/* Section header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
            <ClockIcon className="w-3.5 h-3.5" aria-hidden="true" />
            In Development
          </div>
          <h2 id="upcoming-heading" className="type-h2 text-foreground">
            Upcoming Tools
          </h2>
          <p className="mt-2 type-body-md text-foreground-secondary">
            Tools we're building — check back soon.
          </p>
        </div>
        <Link
          to={ROUTES.TOOLS}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 type-body-sm font-medium text-primary',
            'hover:gap-2.5 transition-all duration-150',
            'focus-visible:outline-none focus-visible:underline'
          )}
        >
          View all tools
          <ArrowRightIcon size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        aria-label="Upcoming tools"
      >
        {upcomingTools.map((tool, i) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.id}
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {/* Non-clickable card — no link wrapper, avoid misleading navigation */}
              <div
                className={cn(
                  'relative flex flex-col gap-3 rounded-xl border p-4 h-full',
                  'bg-card/60 border-border/50',
                  'opacity-70 cursor-default select-none'
                )}
                aria-label={`${tool.name} — coming soon`}
              >
                {/* Coming Soon badge */}
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-500/20">
                  <ClockIcon className="w-2.5 h-2.5" aria-hidden="true" />
                  Soon
                </span>

                {/* Icon */}
                <div
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-muted text-foreground-muted"
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Name + description */}
                <div className="flex-1 min-w-0">
                  <h3 className="type-h5 text-foreground">{tool.name}</h3>
                  <p className="mt-1 type-body-sm text-foreground-muted line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Category */}
                  <Link
                    to={buildCategoryPath(tool.categorySlug)}
                    className="mt-3 block type-caption text-foreground-muted hover:text-primary transition-colors"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {tool.category}
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
