import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import {
  CategoryPageSEO,
  ToolGrid,
  ToolSearchBar,
  ToolsEmptyState,
  useToolSearch,
} from '@/features/tools/discovery'
import { CategoryCard } from '@/features/tools/discovery/components/CategoryCard'

import type { ToolCategorySlug } from '@/constants'
import { ROUTES } from '@/constants'

import {
  activeCategories,
  getCategoryMeta,
  getCategoryToolCount,
  getSortedToolsByCategory,
} from '@/registry'

/**
 * CategoryPage
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *
 * Displays all tools in a single category at /category/:slug
 *
 * Layout:
 *  1. Category hero â€” icon, name, description, stats
 *  2. In-category search
 *  3. Popular tools (when not searching)
 *  4. Active tools grid
 *  5. Coming-soon tools (when present)
 *  6. Related categories
 *
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */
export default function CategoryPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  const category = getCategoryMeta(slug)

  // All hooks must be called before any conditional return (Rules of Hooks)
  const allTools = useMemo(
    () => (category ? getSortedToolsByCategory(slug as ToolCategorySlug) : []),
    [category, slug]
  )

  // In-category search
  const { query, setQuery, results, isSearching, hasActiveFilter } = useToolSearch({
    defaultCategory: slug as ToolCategorySlug,
    syncUrl: false,
  })

  // Related categories: other active categories, exclude current
  const relatedCategories = useMemo(
    () => activeCategories.filter((c) => c.slug !== slug).slice(0, 6),
    [slug]
  )

  // Unknown category â†’ 404 (after all hooks)
  if (!category) {
    return <Navigate to={ROUTES.NOT_FOUND} replace />
  }

  const Icon = category.icon
  const toolCount = getCategoryToolCount(slug as ToolCategorySlug)
  const activeToolCount = getCategoryToolCount(slug as ToolCategorySlug, true)
  const comingSoonCount = toolCount - activeToolCount

  const visibleTools = allTools.filter((t) => !t.isHidden && t.status !== 'deprecated')
  const activeTools = visibleTools.filter((t) => t.status !== 'coming-soon')
  const comingSoonTools = visibleTools.filter((t) => t.status === 'coming-soon')
  const popularTools = activeTools.filter((t) => t.isPopular)

  const displayedTools = hasActiveFilter ? results : activeTools

  return (
    <>
      <CategoryPageSEO category={category} toolCount={toolCount} tools={activeTools} />

      <div className="min-h-screen bg-background">
        {/* â”€â”€â”€ Category hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="border-b border-border bg-card/50">
          <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-start gap-5">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${category.colorClass}`}
                aria-hidden="true"
              >
                <Icon className="w-8 h-8" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Breadcrumb */}
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-1.5 text-xs text-foreground-muted mb-2"
                >
                  <Link
                    to={ROUTES.TOOLS}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    Tools
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-foreground font-medium" aria-current="page">
                    {category.name}
                  </span>
                </nav>

                <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  {category.name}
                </h1>
                <p className="mt-2 text-base text-foreground-secondary max-w-2xl">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-foreground-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    <strong className="text-foreground font-semibold">{activeToolCount}</strong>{' '}
                    active tool{activeToolCount !== 1 ? 's' : ''}
                  </span>
                  {comingSoonCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                      <strong className="text-foreground font-semibold">{comingSoonCount}</strong>{' '}
                      coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* In-category search */}
            <div className="mt-6 max-w-xl">
              <ToolSearchBar
                value={query}
                onChange={setQuery}
                onClear={() => { setQuery('') }}
                isSearching={isSearching}
                placeholder={`Search in ${category.shortName}...`}
                size="md"
              />
            </div>
          </div>
        </section>

        {/* â”€â”€â”€ Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

          {hasActiveFilter ? (
            /* â”€â”€ Search results â”€â”€ */
            <section aria-label={`Search results in ${category.name}`}>
              {displayedTools.length === 0 ? (
                <ToolsEmptyState
                  query={query || undefined}
                  categoryName={category.name}
                  onClear={() => { setQuery('') }}
                  onSearch={setQuery}
                />
              ) : (
                <ToolGrid tools={displayedTools} columns={3} showCount />
              )}
            </section>
          ) : (
            <>
              {/* Popular tools within category */}
              {popularTools.length > 0 && (
                <section aria-labelledby={`${slug}-popular-heading`}>
                  <h2
                    id={`${slug}-popular-heading`}
                    className="text-lg font-bold text-foreground mb-4"
                  >
                    Popular in {category.shortName}
                  </h2>
                  <ToolGrid tools={popularTools} columns={3} />
                </section>
              )}

              {/* All active tools */}
              {activeTools.length > 0 && (
                <section aria-labelledby={`${slug}-all-heading`}>
                  <div className="flex items-end justify-between mb-4">
                    <h2
                      id={`${slug}-all-heading`}
                      className="text-lg font-bold text-foreground"
                    >
                      {popularTools.length > 0 ? 'All Tools' : `All ${category.shortName} Tools`}
                    </h2>
                    <span className="text-sm text-foreground-muted">{activeTools.length} tools</span>
                  </div>
                  <ToolGrid tools={activeTools} columns={3} />
                </section>
              )}

              {/* Coming soon */}
              {comingSoonTools.length > 0 && (
                <section aria-labelledby={`${slug}-coming-soon-heading`}>
                  <h2
                    id={`${slug}-coming-soon-heading`}
                    className="text-lg font-bold text-foreground mb-1"
                  >
                    Coming Soon
                  </h2>
                  <p className="text-sm text-foreground-muted mb-4">
                    These tools are in development and will be available soon.
                  </p>
                  <ToolGrid tools={comingSoonTools} columns={3} />
                </section>
              )}
            </>
          )}

          {/* â”€â”€â”€ Related categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {relatedCategories.length > 0 && (
            <section aria-labelledby="related-categories-heading">
              <h2
                id="related-categories-heading"
                className="text-lg font-bold text-foreground mb-4"
              >
                Other Categories
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {relatedCategories.map((cat) => (
                  <CategoryCard
                    key={cat.slug}
                    category={cat}
                    toolCount={getCategoryToolCount(cat.slug)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
