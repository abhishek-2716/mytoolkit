import { useCallback } from 'react'

import { getToolBySlug } from '@/registry'
import type { ToolMeta } from '@/registry'

import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'mytoolshub-recent-tools'
const MAX_RECENT = 8

/**
 * useRecentTools
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Tracks and retrieves the user's recently visited tools.
 * Persisted in localStorage — survives page refreshes.
 *
 * Storage: array of tool slugs (max 8), most recent first.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useRecentTools() {
  const [slugs, setSlugs] = useLocalStorage<string[]>(STORAGE_KEY, [])

  /** Add a slug to the front of the recent list (deduplicates, caps at MAX_RECENT). */
  const addRecentTool = useCallback(
    (slug: string) => {
      setSlugs((prev) => {
        const filtered = prev.filter((s) => s !== slug)
        return [slug, ...filtered].slice(0, MAX_RECENT)
      })
    },
    [setSlugs]
  )

  /** Resolved ToolMeta objects (filters out any that no longer exist in registry). */
  const recentTools: ToolMeta[] = slugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolMeta => t !== undefined && t.status === 'active')

  /** Clear all recent tools. */
  const clearRecentTools = useCallback(() => setSlugs([]), [setSlugs])

  return { recentTools, addRecentTool, clearRecentTools, hasRecent: recentTools.length > 0 }
}
