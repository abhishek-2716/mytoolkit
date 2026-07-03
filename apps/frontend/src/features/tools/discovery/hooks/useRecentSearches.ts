import { useCallback, useEffect, useState } from 'react'

import { MAX_RECENT_SEARCHES, STORAGE_KEYS } from '@/constants'

/**
 * useRecentSearches
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Persists recent search queries in localStorage.
 * Drives the "Recent searches" dropdown in the search UI.
 *
 * Behaviour:
 *  - Stores the last MAX_RECENT unique non-empty queries
 *  - addSearch() is a no-op for very short queries (< 2 chars)
 *  - Duplicates are moved to the top (MRU order)
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useRecentSearches() {
  const storageKey = STORAGE_KEYS.RECENT_SEARCHES

  const [searches, setSearches] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(searches))
    } catch {
      // localStorage not available (private browsing, storage full)
    }
  }, [searches, storageKey])

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return
    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed)
      return [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    })
  }, [])

  const removeSearch = useCallback((query: string) => {
    setSearches((prev) => prev.filter((s) => s !== query))
  }, [])

  const clearAll = useCallback(() => {
    setSearches([])
  }, [])

  return { searches, addSearch, removeSearch, clearAll }
}
