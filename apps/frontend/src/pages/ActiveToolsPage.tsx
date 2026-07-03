import { useMemo } from 'react'
import { CheckCircle2, ZapIcon } from 'lucide-react'

import {
  ActiveToolsPageSEO,
  CategoryFilterTabs,
  ToolGrid,
  ToolSearchBar,
  ToolsEmptyState,
  useToolSearch,
} from '@/features/tools/discovery'

import type { ToolCategorySlug } from '@/constants'

import {
  activeCategories,
  getActiveTools,
  getCategoryToolCount,
  registryStats,
} from '@/registry'

/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * ActiveToolsPage — /active-tools
 *
 * A dedicated page listing only tools that are live and working right now.
 * No coming-soon tools. Every card you see is clickable and functional.
 *
 * Layout:
 *  1. Hero — heading, stats strip, search bar
 *  2. Category filter tabs (only categories with active tools)
 *  3. Tools grid (filtered to active/beta only)
 */
export default function ActiveToolsPage() {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    results,
    isSearching,
    hasActiveFilter,
    clearAll,
  } = useToolSearch({ syncUrl: true, limit: 200 })

  /* ── Only active/beta tools ── */
  const activeResults = useMemo(
    () => results.filter((t) => t.status === 'active' || t.status === 'beta'),
    [results]
  )

  /* ── Category counts for active tools only ── */
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ToolCategorySlug, number>> = {}
    for (const cat of activeCategories) {
      counts[cat.slug] = getCategoryToolCount(cat.slug, true) // activeOnly=true
    }
    return counts
  }, [])


  const selectedCategoryName = selectedCategory
    ? activeCategories.find((c) => c.slug === selectedCategory)?.name
    : undefined

  const totalActive = getActiveTools().length

  return (
    <>
      {/* ── SEO ── */}
      <ActiveToolsPageSEO totalActive={totalActive} />

      <div className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="border-b border-border bg-card/50">
          <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            {/* Heading */}
            <div className="flex items-start gap-3 mb-6">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-0.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" aria-hidden="true" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
                  <ZapIcon className="w-3 h-3" aria-hidden="true" />
                  All Working • No Waiting
                </div>
                <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  Active Tools
                </h1>
                <p className="mt-1.5 text-base text-foreground-secondary max-w-xl">
                  Every tool here is live and working right now. Click any card to start — no signup, no download.
                </p>
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-foreground-muted mb-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <strong className="text-foreground">{totalActive}</strong> tools live
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <strong className="text-foreground">{registryStats.totalCategories}</strong> categories
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                100% free · no account needed
              </span>
            </div>

            {/* Search bar */}
            <div className="max-w-2xl">
              <ToolSearchBar
                value={query}
                onChange={setQuery}
                onClear={() => { setQuery('') }}
                isSearching={isSearching}
                placeholder="Search active tools — try 'json', 'word', 'base64'..."
                size="lg"
                focusOnMount
              />
            </div>
          </div>
        </section>

        {/* ── Filter + grid ── */}
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

          {/* Category filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Results */}
          <section aria-label={query ? 'Search results' : 'Active tools'}>
            {activeResults.length === 0 ? (
              <ToolsEmptyState
                query={query || undefined}
                categoryName={selectedCategoryName}
                onClear={clearAll}
                onSearch={setQuery}
              />
            ) : (
              <>
                <p className="text-sm text-foreground-muted mb-4" aria-live="polite">
                  {activeResults.length} active tool{activeResults.length !== 1 ? 's' : ''}
                  {selectedCategoryName ? ` in ${selectedCategoryName}` : ''}
                  {query ? ` matching "${query}"` : ''}
                </p>
                <ToolGrid
                  tools={activeResults}
                  columns={4}
                  showCategory={!selectedCategory}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
