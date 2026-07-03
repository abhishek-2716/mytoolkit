import { Link } from 'react-router-dom'
import { ArrowRightIcon } from 'lucide-react'

import { Card, CardBadge, CardContent, CardHeader } from '@/components/cards'

import { cn } from '@/utils'
import { buildCategoryPath,buildToolPath } from '@/constants'

import type { HomeTool } from '../data/home.data'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ToolCardProps {
  tool: HomeTool
  /** 'default' shows full description; 'compact' shows 1-line description */
  variant?: 'default' | 'compact'
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * ToolCard — reusable card for displaying a tool in grids and lists.
 *
 * Used by FeaturedGrid, RecentTools, and any future tool listing.
 *
 * @example
 * <ToolCard tool={featuredTools[0]} />
 * <ToolCard tool={recentTools[0]} variant="compact" />
 */
export function ToolCard({ tool, variant = 'default', className }: ToolCardProps) {
  const ToolIcon = tool.icon

  return (
    <Link
      to={buildToolPath(tool.slug)}
      aria-label={`Open ${tool.name}`}
      className={cn(
        'group block focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl',
        className
      )}
    >
      <Card
        variant="interactive"
        padding="none"
        className={cn(
          'h-full transition-all duration-200',
          'group-hover:-translate-y-0.5 group-hover:shadow-lg'
        )}
      >
        <CardHeader
          action={
            (tool.isPopular ?? tool.isNew) && (
              <CardBadge
                variant={tool.isNew ? 'success' : 'primary'}
                size="sm"
              >
                {tool.isNew ? 'New' : 'Popular'}
              </CardBadge>
            )
          }
        >
          {/* Icon */}
          <div
            className={cn(
              'mb-3 flex h-11 w-11 items-center justify-center rounded-xl',
              'bg-primary-subtle text-primary',
              'ring-1 ring-primary/10 transition-colors duration-200',
              'group-hover:bg-primary group-hover:text-primary-foreground'
            )}
            aria-hidden="true"
          >
            <ToolIcon size={22} />
          </div>

          {/* Name */}
          <h3
            className={cn(
              'type-h5 text-foreground transition-colors duration-150',
              'group-hover:text-primary'
            )}
          >
            {tool.name}
          </h3>
        </CardHeader>

        <CardContent noTopPadding>
          {/* Description */}
          <p
            className={cn(
              'type-body-sm text-foreground-muted',
              variant === 'compact' ? 'line-clamp-1' : 'line-clamp-2'
            )}
          >
            {tool.description}
          </p>

          {/* Category + arrow */}
          <div className="mt-4 flex items-center justify-between">
            <Link
              to={buildCategoryPath(tool.categorySlug)}
              onClick={(e) => { e.stopPropagation() }}
              className={cn(
                'type-caption text-foreground-muted',
                'hover:text-primary transition-colors duration-150',
                'focus-visible:outline-none focus-visible:text-primary'
              )}
            >
              {tool.category}
            </Link>

            <ArrowRightIcon
              size={14}
              className={cn(
                'text-foreground-muted transition-all duration-200',
                'group-hover:text-primary group-hover:translate-x-0.5'
              )}
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
