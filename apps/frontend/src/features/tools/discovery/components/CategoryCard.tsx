import { Link } from 'react-router-dom'

import { buildCategoryPath } from '@/constants'

import type { ToolCategoryMeta } from '@/registry'

interface CategoryCardProps {
  category: ToolCategoryMeta
  toolCount?: number
}

/**
 * CategoryCard
 * Small card linking to a category page.
 * Used in the "Browse by Category" section on the Tools page.
 */
export function CategoryCard({ category, toolCount }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <Link
      to={buildCategoryPath(category.slug)}
      className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={`${category.name} — ${toolCount ? `${toolCount} tools` : category.shortDescription}`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${category.colorClass} group-hover:scale-110`}
        aria-hidden="true"
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.shortName}
        </p>
        {toolCount !== undefined && (
          <p className="text-xs text-foreground-muted tabular-nums">
            {toolCount} tool{toolCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Arrow */}
      <svg
        className="ml-auto w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  )
}
