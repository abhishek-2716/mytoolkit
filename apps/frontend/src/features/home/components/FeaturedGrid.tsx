import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

import { MutedSection } from '@/components/layout'

import { cn } from '@/utils'
import { ROUTES } from '@/constants'

import { featuredTools } from '../data/home.data'
import { ToolCard } from './ToolCard'

/* ─── FeaturedGrid ───────────────────────────────────────────────────────── */

/**
 * FeaturedGrid — responsive grid of the most popular tools.
 *
 * Displays 8 featured tools in a 2/3/4-column responsive grid.
 * Each item is rendered by the shared ToolCard component.
 */
export function FeaturedGrid() {
  return (
    <MutedSection container="wide" aria-labelledby="featured-heading">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 id="featured-heading" className="type-h2 text-foreground">
            Most Popular Tools
          </h2>
          <p className="mt-2 type-body-md text-foreground-secondary">
            The tools our users reach for most.
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
          View active tools
          <ArrowRightIcon size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        aria-label="Featured tools"
      >
        {featuredTools.map((tool, i) => (
          <motion.div
            key={tool.id}
            role="listitem"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <ToolCard tool={tool} />
          </motion.div>
        ))}
      </div>
    </MutedSection>
  )
}
