import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import type { ToolCollection } from '@/registry/collections'

import type { ToolCardVariant } from './ToolCard'
import { ToolGrid } from './ToolGrid'

interface CollectionSectionProps {
  collection: ToolCollection
  columns?: 2 | 3 | 4
  cardVariant?: ToolCardVariant
  showCategory?: boolean
  maxVisible?: number
}

/**
 * CollectionSection
 * ══════════════════════════════════════════════════════════════════════════
 *
 * A titled section with a tool grid and optional "View all" link.
 * Used for Popular, New, Trending, and Featured sections.
 *
 * Architecture: receives a ToolCollection object, not raw arrays.
 * When the backend is live, the ToolCollection can come from an API
 * without changing this component.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function CollectionSection({
  collection,
  columns = 3,
  cardVariant = 'default',
  showCategory = false,
  maxVisible,
}: CollectionSectionProps) {
  const tools = maxVisible ? collection.tools.slice(0, maxVisible) : collection.tools

  if (tools.length === 0) return null

  return (
    <section aria-labelledby={`collection-${collection.id}`} className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id={`collection-${collection.id}`}
            className="text-xl font-bold text-foreground"
          >
            {collection.title}
          </h2>
          {collection.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{collection.description}</p>
          )}
        </div>

        {collection.viewAllHref && (
          <Link
            to={collection.viewAllHref}
            className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            aria-label={`View all ${collection.title}`}
          >
            View all
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Grid */}
      <ToolGrid
        tools={tools}
        columns={columns}
        variant={cardVariant}
        showCategory={showCategory}
      />
    </section>
  )
}
