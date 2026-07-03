/**
 * Tool Collections
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Named collections drive the "Popular", "New", "Trending" sections
 * on discovery pages.
 *
 * Architecture: collections currently derive from registry flags.
 * When the backend is live, each collection can be replaced with an
 * API call without changing any UI component — the component only
 * consumes the ToolCollection interface.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

import {
  getDiscoverableTools,
  getFeaturedTools,
  getNewTools,
  getPopularTools,
  getTrendingTools,
} from './index'
import type { ToolMeta } from './types'

/* ─── Collection Type ────────────────────────────────────────────────────── */

export interface ToolCollection {
  /** Unique stable identifier. */
  id: CollectionId
  /** Display title for the section heading. */
  title: string
  /** Short description shown under the section heading. */
  description: string
  /** The tools in this collection. */
  tools: ToolMeta[]
  /** View-all link target. */
  viewAllHref?: string
}

export type CollectionId =
  | 'featured'
  | 'popular'
  | 'new'
  | 'trending'
  | 'recommended'
  | 'recently-updated'
  | 'browser-only'
  | 'all-tools'

/* ─── Collection Factory ─────────────────────────────────────────────────── */

/**
 * Get a named tool collection by id.
 * Returns the collection or null if the id is unknown.
 *
 * @example
 * const collection = getCollection('popular')
 * if (collection) {
 *   // collection.tools = ToolMeta[]
 * }
 */
export function getCollection(id: CollectionId, limit?: number): ToolCollection | null {
  const collections: Record<CollectionId, () => Omit<ToolCollection, 'id'>> = {
    featured: () => ({
      title: 'Featured Tools',
      description: 'Hand-picked tools for the most common tasks',
      tools: getFeaturedTools().slice(0, limit ?? 12),
      viewAllHref: '/tools',
    }),
    popular: () => ({
      title: 'Most Popular',
      description: 'Tools loved by millions of users',
      tools: getPopularTools().slice(0, limit ?? 12),
      viewAllHref: '/tools?sort=popular',
    }),
    new: () => ({
      title: 'New Tools',
      description: 'Recently launched tools — try them first',
      tools: getNewTools().slice(0, limit ?? 12),
      viewAllHref: '/tools?sort=new',
    }),
    trending: () => ({
      title: 'Trending Now',
      description: 'Tools getting the most attention right now',
      tools: getTrendingTools().slice(0, limit ?? 12),
      viewAllHref: '/tools?sort=trending',
    }),
    recommended: () => ({
      // For now, recommended = featured + popular merged and deduplicated
      title: 'Recommended',
      description: 'Curated picks for productivity and creativity',
      tools: deduplicate([...getFeaturedTools(), ...getPopularTools()]).slice(0, limit ?? 12),
      viewAllHref: '/tools',
    }),
    'recently-updated': () => ({
      title: 'Recently Updated',
      description: 'Tools that have been improved recently',
      tools: getDiscoverableTools()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, limit ?? 12),
      viewAllHref: '/tools?sort=updated',
    }),
    'browser-only': () => ({
      title: 'Instant Tools',
      description: 'No upload required — works entirely in your browser',
      tools: getDiscoverableTools()
        .filter((t) => t.processingMode === 'browser')
        .slice(0, limit ?? 12),
      viewAllHref: '/tools?mode=browser',
    }),
    'all-tools': () => ({
      title: 'All Tools',
      description: `${getDiscoverableTools().length} free tools for productivity`,
      tools: getDiscoverableTools().slice(0, limit ?? 100),
      viewAllHref: '/tools',
    }),
  }

  const factory = collections[id]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!factory) return null

  return { id, ...factory() }
}

/**
 * Get multiple collections at once.
 * Undefined entries are filtered out automatically.
 */
export function getCollections(
  ids: CollectionId[],
  limitPerCollection = 12
): ToolCollection[] {
  return ids
    .map((id) => getCollection(id, limitPerCollection))
    .filter((c): c is ToolCollection => c !== null)
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function deduplicate(tools: ToolMeta[]): ToolMeta[] {
  const seen = new Set<string>()
  return tools.filter((t) => {
    if (seen.has(t.id)) return false
    seen.add(t.id)
    return true
  })
}
