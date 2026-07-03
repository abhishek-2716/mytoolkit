import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

import { Section } from '@/components/layout'

import { cn } from '@/utils'
import { buildCategoryPath } from '@/constants'

import type { HomeCategory } from '../data/home.data'
import { homeCategories } from '../data/home.data'

/* ─── Single category card ───────────────────────────────────────────────── */

interface CategoryCardProps {
  category: HomeCategory
  index: number
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={buildCategoryPath(category.slug)}
        aria-label={`Browse ${category.name} — ${category.toolCount} tools`}
        className={cn(
          'group flex flex-col items-center gap-3 rounded-xl p-5 text-center',
          'border border-border bg-surface',
          'hover:border-primary/30 hover:bg-background-subtle hover:shadow-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'focus-visible:ring-offset-2',
          'transition-all duration-200'
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            'transition-transform duration-200 group-hover:scale-110',
            category.colorClass
          )}
          aria-hidden="true"
        >
          <Icon size={22} />
        </div>

        {/* Name */}
        <span className="type-label font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
          {category.name}
        </span>

        {/* Tool count */}
        <span className="type-caption text-foreground-muted">
          {category.toolCount} tools
        </span>
      </Link>
    </motion.div>
  )
}

/* ─── CategoryGrid ───────────────────────────────────────────────────────── */

/**
 * CategoryGrid — displays all tool categories in a responsive grid.
 *
 * 2 columns on mobile, 3 on tablet, 5 on desktop.
 */
export function CategoryGrid() {
  return (
    <Section container="wide" aria-labelledby="categories-heading">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 id="categories-heading" className="type-h2 text-foreground">
          Browse by Category
        </h2>
        <p className="mt-3 type-body-md text-foreground-secondary max-w-xl mx-auto">
          Over 150 tools organized into categories. Find exactly what you need in seconds.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        role="list"
        aria-label="Tool categories"
      >
        {homeCategories.map((category, i) => (
          <div key={category.id} role="listitem">
            <CategoryCard category={category} index={i} />
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-8 text-center">
        <Link
          to="/tools"
          className={cn(
            'inline-flex items-center gap-1.5 type-body-sm font-medium text-primary',
            'hover:gap-2.5 transition-all duration-150',
            'focus-visible:outline-none focus-visible:underline'
          )}
        >
          View all tools
          <ArrowRightIcon size={15} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  )
}
