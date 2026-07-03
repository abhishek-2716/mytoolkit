import { useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useDebounce } from '@/hooks'

import type { ToolCategorySlug } from '@/constants'

import type { ToolMeta } from '@/registry'
import { getDiscoverableTools, getToolsByCategory,searchTools } from '@/registry'

export type SortOption = 'relevance' | 'popular' | 'new' | 'trending' | 'alpha' | 'updated'

interface UseToolSearchOptions {
  /** Pre-select a category. Overridden by URL params if syncUrl is true. */
  defaultCategory?: ToolCategorySlug | null
  /** Sync state with URL search params. Default: false */
  syncUrl?: boolean
  /** Max results. Default: 100 */
  limit?: number
}

interface UseToolSearchReturn {
  query: string
  setQuery: (q: string) => void
  debouncedQuery: string
  selectedCategory: ToolCategorySlug | null
  setSelectedCategory: (cat: ToolCategorySlug | null) => void
  sortBy: SortOption
  setSortBy: (s: SortOption) => void
  results: ToolMeta[]
  totalCount: number
  isSearching: boolean
  hasActiveFilter: boolean
  clearAll: () => void
}

/**
 * useToolSearch
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Manages tool search + filter state with optional URL synchronization.
 *
 * Architecture:
 *  1. Input → debounced 300ms → searchTools() or category filter
 *  2. Results are memoized: only recomputes when query/category/sort changes
 *  3. useTransition marks filter updates as non-urgent → no UI jank during typing
 *  4. syncUrl=true → state lives in URL search params (shareable searches)
 *  5. syncUrl=false → state is local React state (modal search)
 *
 * When the backend search API is ready:
 *  - Replace searchTools() with a useQuery() call
 *  - The rest of the hook stays the same
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useToolSearch({
  defaultCategory = null,
  syncUrl = false,
  limit = 100,
}: UseToolSearchOptions = {}): UseToolSearchReturn {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // ── State ─────────────────────────────────────────────────────────────
  const [localQuery, setLocalQuery] = useState(
    syncUrl ? (searchParams.get('q') ?? '') : ''
  )
  const [localCategory, setLocalCategory] = useState<ToolCategorySlug | null>(
    syncUrl
      ? ((searchParams.get('cat') as ToolCategorySlug | null) ?? defaultCategory)
      : defaultCategory
  )
  const [localSort, setLocalSort] = useState<SortOption>(
    syncUrl ? ((searchParams.get('sort') as SortOption | null) ?? 'relevance') : 'relevance'
  )

  const query = syncUrl ? (searchParams.get('q') ?? '') : localQuery
  const selectedCategory = syncUrl
    ? ((searchParams.get('cat') as ToolCategorySlug | null) ?? null)
    : localCategory
  const sortBy = syncUrl
    ? ((searchParams.get('sort') as SortOption | null) ?? 'relevance')
    : localSort

  // ── Debounce ───────────────────────────────────────────────────────────
  const debouncedQuery = useDebounce(query, 300)

  // ── Setters with URL sync ─────────────────────────────────────────────
  const setQuery = (q: string) => {
    if (syncUrl) {
      startTransition(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          if (q) next.set('q', q)
          else next.delete('q')
          return next
        })
      })
    } else {
      setLocalQuery(q)
    }
  }

  const setSelectedCategory = (cat: ToolCategorySlug | null) => {
    if (syncUrl) {
      startTransition(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          if (cat) next.set('cat', cat)
          else next.delete('cat')
          return next
        })
      })
    } else {
      setLocalCategory(cat)
    }
  }

  const setSortBy = (s: SortOption) => {
    if (syncUrl) {
      startTransition(() => {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev)
          if (s !== 'relevance') next.set('sort', s)
          else next.delete('sort')
          return next
        })
      })
    } else {
      setLocalSort(s)
    }
  }

  // ── Results computation ────────────────────────────────────────────────
  const results = useMemo<ToolMeta[]>(() => {
    let pool: ToolMeta[]

    if (debouncedQuery.trim()) {
      // Search mode: use scoring search
      pool = searchTools(debouncedQuery, limit, selectedCategory ?? undefined)
    } else if (selectedCategory) {
      // Category filter only
      pool = getToolsByCategory(selectedCategory).filter(
        (t) => t.status !== 'deprecated' && !t.isHidden
      )
    } else {
      // All discoverable tools
      pool = getDiscoverableTools()
    }

    // Apply sort (search already sorts by relevance)
    if (!debouncedQuery.trim() || sortBy !== 'relevance') {
      pool = sortTools(pool, sortBy)
    }

    return pool.slice(0, limit)
  }, [debouncedQuery, selectedCategory, sortBy, limit])

  const clearAll = () => {
    setQuery('')
    setSelectedCategory(null)
    setSortBy('relevance')
  }

  return {
    query,
    setQuery,
    debouncedQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    results,
    totalCount: results.length,
    isSearching: isPending || (query !== debouncedQuery && query.length > 0),
    hasActiveFilter: query.length > 0 || selectedCategory !== null || sortBy !== 'relevance',
    clearAll,
  }
}

/* ─── Sort function ──────────────────────────────────────────────────────── */

function sortTools(tools: ToolMeta[], sort: SortOption): ToolMeta[] {
  const sorted = [...tools]
  switch (sort) {
    case 'popular':
      return sorted.sort((a, b) => {
        const scoreA = (a.isPopular ? 3 : 0) + (a.isFeatured ? 2 : 0) + (a.isTrending ? 1 : 0)
        const scoreB = (b.isPopular ? 3 : 0) + (b.isFeatured ? 2 : 0) + (b.isTrending ? 1 : 0)
        return scoreB - scoreA
      })
    case 'new':
      return sorted.sort((a, b) => {
        const aNew = a.isNew ? 1 : 0
        const bNew = b.isNew ? 1 : 0
        if (aNew !== bNew) return bNew - aNew
        return b.createdAt.localeCompare(a.createdAt)
      })
    case 'trending':
      return sorted.sort((a, b) => {
        const scoreA = (a.isTrending ? 2 : 0) + (a.isPopular ? 1 : 0)
        const scoreB = (b.isTrending ? 2 : 0) + (b.isPopular ? 1 : 0)
        return scoreB - scoreA
      })
    case 'updated':
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    case 'alpha':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      // relevance + sortOrder hint
      return sorted.sort((a, b) => {
        const orderA = a.sortOrder ?? 999
        const orderB = b.sortOrder ?? 999
        return orderA - orderB
      })
  }
}
