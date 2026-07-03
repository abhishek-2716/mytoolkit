import { useMemo } from 'react'
import { Clock, Grid3X3, Zap } from 'lucide-react'

import {
  CategoryCard,
  CategoryFilterTabs,
  CollectionSection,
  ToolGrid,
  ToolSearchBar,
  ToolsEmptyState,
  ToolsPageSEO,
  useToolSearch,
} from '@/features/tools/discovery'

import type { ToolCategorySlug } from '@/constants'

import {
  activeCategories,
  getCategoryToolCount,
  getDiscoverableTools,
  registryStats,
  toolRegistry,
} from '@/registry'
import { getCollection } from '@/registry/collections'

/**
 * ToolsPage
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *
 * The primary tool discovery page at /tools
 *
 * Layout:
 *  1. Hero â€” headline + search + stats strip
 *  2. Category filter tabs
 *  3. Conditional content:
 *     a. Active search â†’ search results grid
 *     b. Category selected â†’ category grid
 *     c. Default â†’ Featured + Popular + New + All tools grid
 *  4. Browse by Category section
 *
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */
export default function ToolsPage() {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    results,
    totalCount,
    isSearching,
    hasActiveFilter,
    clearAll,
  } = useToolSearch({ syncUrl: true })

  /* â”€â”€ Pre-compute category counts (memoized) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ToolCategorySlug, number>> = {}
    for (const cat of activeCategories) {
      counts[cat.slug] = getCategoryToolCount(cat.slug)
    }
    return counts
  }, [])

  /* â”€â”€ Collections for default view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const featuredCollection = useMemo(() => getCollection('featured', 6), [])
  const popularCollection = useMemo(() => getCollection('popular', 6), [])
  const newCollection = useMemo(() => getCollection('new', 6), [])

  /* â”€â”€ Coming-soon tools (for default view) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const comingSoonTools = useMemo(
    () => toolRegistry.filter((t) => t.status === 'coming-soon').slice(0, 6),
    []
  )

  const selectedCategoryName = selectedCategory
    ? activeCategories.find((c) => c.slug === selectedCategory)?.name
    : undefined

  return (
    <>
      <ToolsPageSEO query={query || undefined} categoryName={selectedCategoryName} />

      <div className="min-h-screen bg-background">
        {/* â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="border-b border-border bg-card/50">
          <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Zap className="w-3 h-3" aria-hidden="true" />
                {registryStats.activeTools} Active Tools
              </div>
              <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Free Online Tools
              </h1>
              <p className="mt-2 text-base text-foreground-secondary">
                Everything you need for PDF, images, text, code, calculators, and generators.
                No signup. No download. Just open and use.
              </p>
            </div>

            {/* Search */}
            <div className="mt-6 max-w-2xl">
              <ToolSearchBar
                value={query}
                onChange={setQuery}
                onClear={() => { setQuery('') }}
                isSearching={isSearching}
                placeholder="Search tools â€” try 'compress', 'json', 'uuid'..."
                size="lg"
              />
            </div>

            {/* Stats strip */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                {registryStats.browserTools} instant browser tools
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                {registryStats.totalCategories} categories
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                100% free, no signup
              </span>
            </div>
          </div>
        </section>

        {/* â”€â”€â”€ Filter + content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

          {/* Category filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilterTabs
              selected={selectedCategory}
              onChange={setSelectedCategory}
              counts={categoryCounts}
            />
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="flex-shrink-0 text-sm text-foreground-muted hover:text-foreground underline underline-offset-2 transition-colors"
                aria-label="Clear all filters"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* â”€â”€ Filtered / Search results â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {hasActiveFilter ? (
            <section aria-label={query ? 'Search results' : 'Filtered tools'}>
              {totalCount === 0 ? (
                <ToolsEmptyState
                  query={query || undefined}
                  categoryName={selectedCategoryName}
                  onClear={clearAll}
                  onSearch={setQuery}
                />
              ) : (
                <ToolGrid
                  tools={results}
                  columns={4}
                  showCount
                  showCategory={!selectedCategory}
                />
              )}
            </section>
          ) : (
            /* â”€â”€ Default view: collections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
            <>
              {featuredCollection && featuredCollection.tools.length > 0 && (
                <CollectionSection collection={featuredCollection} columns={3} />
              )}

              {popularCollection && popularCollection.tools.length > 0 && (
                <CollectionSection collection={popularCollection} columns={3} showCategory />
              )}

              {newCollection && newCollection.tools.length > 0 && (
                <CollectionSection collection={newCollection} columns={3} showCategory />
              )}

              {/* Active tools */}
              <section aria-labelledby="all-tools-heading">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h2 id="all-tools-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                      Active Tools
                    </h2>
                    <p className="text-sm text-foreground-muted mt-0.5">
                      {registryStats.activeTools} ready-to-use tools across {registryStats.totalCategories} categories
                    </p>
                  </div>
                </div>
                <ToolGrid
                  tools={getDiscoverableTools().filter((t) => t.status !== 'coming-soon')}
                  columns={4}
                  showCategory
                />
              </section>

              {/* Coming soon — visually separated from active tools */}
              {comingSoonTools.length > 0 && (
                <section aria-labelledby="coming-soon-heading">
                  {/* Divider with label */}
                  <div className="relative flex items-center gap-4 my-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      Upcoming Tools
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 mt-4">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <h2 id="coming-soon-heading" className="text-xl font-bold text-foreground flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-500" aria-hidden="true" />
                          Coming Soon
                        </h2>
                        <p className="text-sm text-foreground-muted mt-0.5">
                          Tools in development — check back soon
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/25">
                        In Development
                      </span>
                    </div>
                    <ToolGrid tools={comingSoonTools} columns={4} showCategory />
                  </div>
                </section>
              )}

              {/* Browse by category */}
              <section aria-labelledby="categories-heading">
                <div className="flex items-end justify-between mb-4">
                  <h2
                    id="categories-heading"
                    className="text-xl font-bold text-foreground flex items-center gap-2"
                  >
                    <Grid3X3 className="w-5 h-5 text-primary" aria-hidden="true" />
                    Browse by Category
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {activeCategories.map((cat) => (
                    <CategoryCard
                      key={cat.slug}
                      category={cat}
                      toolCount={categoryCounts[cat.slug]}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  )
}

