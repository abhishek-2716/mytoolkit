import { useEffect } from 'react'
import { History, X } from 'lucide-react'

import {
  CategoryFilterTabs,
  SearchPageSEO,
  ToolGrid,
  ToolSearchBar,
  ToolsEmptyState,
  useRecentSearches,
  useToolSearch,
} from '@/features/tools/discovery'

import { registryStats } from '@/registry'

/**
 * SearchPage
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Dedicated search experience at /search
 *
 * Layout:
 *  1. Search bar (large, auto-focused)
 *  2. Recent searches (when query is empty)
 *  3. Category filter (always shown)
 *  4. Results grid or empty state
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export default function SearchPage() {

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

  const { searches: recentSearches, addSearch, removeSearch, clearAll: clearRecent } =
    useRecentSearches()

  // Save to recent searches when a result is visible
  useEffect(() => {
    if (query.trim().length >= 2 && totalCount > 0) {
      const t = setTimeout(() => { addSearch(query.trim()); }, 1000)
      return () => { clearTimeout(t); }
    }
  }, [query, totalCount, addSearch])

  const showRecentSearches = !query && recentSearches.length > 0

  return (
    <>
      <SearchPageSEO query={query || undefined} resultCount={totalCount} />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

          {/* ─── Search input ─────────────────────────────────────────── */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Search Tools</h1>
            <p className="text-sm text-foreground-muted">
              Search {registryStats.activeTools}+ free tools
            </p>
          </div>

          <ToolSearchBar
            value={query}
            onChange={setQuery}
            onClear={clearAll}
            isSearching={isSearching}
            placeholder="What tool are you looking for?"
            focusOnMount
            size="lg"
          />

          {/* ─── Category filter ──────────────────────────────────────── */}
          <CategoryFilterTabs
            selected={selectedCategory}
            onChange={setSelectedCategory}
            showCounts={false}
          />

          {/* ─── Recent searches ──────────────────────────────────────── */}
          {showRecentSearches && (
            <section aria-label="Recent searches">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" aria-hidden="true" />
                  Recent searches
                </h2>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear recent searches"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <span key={s} className="flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full bg-muted text-sm text-foreground">
                    <button
                      type="button"
                      onClick={() => { setQuery(s); }}
                      className="hover:text-primary transition-colors focus:outline-none focus-visible:underline"
                      aria-label={`Search for ${s}`}
                    >
                      {s}
                    </button>
                    <button
                      type="button"
                      onClick={() => { removeSearch(s); }}
                      className="p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors"
                      aria-label={`Remove "${s}" from recent searches`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ─── Results ──────────────────────────────────────────────── */}
          {hasActiveFilter && (
            <section aria-live="polite" aria-atomic="false" aria-label="Search results">
              {totalCount === 0 ? (
                <ToolsEmptyState
                  query={query || undefined}
                  onClear={clearAll}
                  onSearch={setQuery}
                />
              ) : (
                <>
                  <p className="text-sm text-foreground-muted mb-4" aria-live="polite">
                    {totalCount} result{totalCount !== 1 ? 's' : ''}
                    {query ? ` for "${query}"` : ''}
                    {selectedCategory ? ` in ${selectedCategory}` : ''}
                  </p>
                  <ToolGrid
                    tools={results}
                    columns={3}
                    variant="compact"
                    showCategory
                  />
                </>
              )}
            </section>
          )}

          {/* ─── Empty initial state ──────────────────────────────────── */}
          {!hasActiveFilter && !showRecentSearches && (
            <div className="text-center py-12 text-foreground-muted">
              <p className="text-base font-medium">Start typing to find a tool</p>
              <p className="text-sm mt-1">Try &ldquo;json&rdquo;, &ldquo;pdf&rdquo;, &ldquo;uuid&rdquo;, &ldquo;compress&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
