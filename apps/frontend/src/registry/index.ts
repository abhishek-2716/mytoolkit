/**
 * ══════════════════════════════════════════════════════════════════════════
 * TOOL REGISTRY — Unified Index
 * ══════════════════════════════════════════════════════════════════════════
 *
 * This is the single entry point for all tool and category data.
 *
 * Every page, component, search engine, sitemap generator, and API
 * must import from this file — never directly from category files.
 *
 * Architecture guarantees:
 *  - O(1) tool lookup by slug via toolRegistryMap
 *  - Category filtering is pre-indexed for performance
 *  - Search scoring is consistent across all consumers
 *  - Adding a new tool = one entry in one category file
 *  - No other file needs to change
 *
 * Usage:
 *  import { getToolBySlug, getFeaturedTools, searchTools } from '@/registry'
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

export { activeCategories, categoryMeta, categoryMetaMap, getCategoryMeta } from './category-meta'
export type { ProcessingMode, ToolCategoryMeta, ToolDifficulty, ToolMeta, ToolSeoMeta, ToolStatus } from './types'

import type { ToolCategorySlug } from '@/constants'

import { aiTools } from './categories/ai.registry'
import { calculatorTools } from './categories/calculator.registry'
import { developerTools } from './categories/developer.registry'
import { generatorTools } from './categories/generator.registry'
import { imageTools } from './categories/image.registry'
import { pdfTools } from './categories/pdf.registry'
import { seoTools } from './categories/seo.registry'
import { textTools } from './categories/text.registry'
import type { ToolMeta } from './types'

/* ─── Flat registry ──────────────────────────────────────────────────────── */

/**
 * The complete, flat list of all tools across all categories.
 *
 * Order within the array does NOT determine display order.
 * Consumers should sort by their own criteria (popularity, date, name).
 *
 * To add a new category:
 *  1. Create `src/registry/categories/{category}.registry.ts`
 *  2. Import it here and spread into the array below
 *  3. Add category metadata in `category-meta.ts`
 */
export const toolRegistry: ToolMeta[] = [
  ...pdfTools,
  ...imageTools,
  ...developerTools,
  ...textTools,
  ...seoTools,
  ...calculatorTools,
  ...generatorTools,
  ...aiTools,
]

/* ─── O(1) lookup map ────────────────────────────────────────────────────── */

/**
 * Slug-keyed Map for instant tool lookup.
 * All getToolBySlug calls go through this — never .find() the array.
 */
export const toolRegistryMap = new Map<string, ToolMeta>(
  toolRegistry.map((tool) => [tool.slug, tool])
)

/* ─── Category index ─────────────────────────────────────────────────────── */

/**
 * Pre-built category index.
 * Maps each category slug to its array of tools.
 * Avoids repeated .filter() calls across the app.
 */
const categoryIndex = new Map<ToolCategorySlug, ToolMeta[]>()

for (const tool of toolRegistry) {
  const existing = categoryIndex.get(tool.category) ?? []
  existing.push(tool)
  categoryIndex.set(tool.category, existing)
}

/* ─── Query helpers ──────────────────────────────────────────────────────── */

/**
 * Retrieve a single tool by its slug.
 * Returns undefined if the slug does not exist in the registry.
 *
 * @example
 * const tool = getToolBySlug('json-formatter')
 */
export function getToolBySlug(slug: string): ToolMeta | undefined {
  return toolRegistryMap.get(slug)
}

/**
 * Get all tools in a given category.
 * Returns an empty array if the category has no registered tools.
 *
 * @example
 * const pdfTools = getToolsByCategory('pdf')
 */
export function getToolsByCategory(category: ToolCategorySlug): ToolMeta[] {
  return categoryIndex.get(category) ?? []
}

/**
 * Get all tools with `status: 'active'` or `status: 'beta'`.
 * Excludes `coming-soon` and `deprecated` tools.
 */
export function getActiveTools(): ToolMeta[] {
  return toolRegistry.filter((t) => t.status === 'active' || t.status === 'beta')
}

/**
 * Get all tools visible on discovery pages.
 * Excludes hidden, deprecated tools.
 * Includes coming-soon so they appear in grids.
 */
export function getDiscoverableTools(): ToolMeta[] {
  return toolRegistry.filter((t) => t.status !== 'deprecated' && !t.isHidden)
}

/**
 * Get all tools for a category sorted by sortOrder, then alphabetically.
 */
export function getSortedToolsByCategory(category: ToolCategorySlug): ToolMeta[] {
  return [...(categoryIndex.get(category) ?? [])].sort((a, b) => {
    const orderA = a.sortOrder ?? 999
    const orderB = b.sortOrder ?? 999
    if (orderA !== orderB) return orderA - orderB
    return a.title.localeCompare(b.title)
  })
}

/**
 * Get all tools marked as trending.
 * Falls back to popular tools if no trending tools are marked.
 */
export function getTrendingTools(): ToolMeta[] {
  const trending = toolRegistry.filter((t) => t.isTrending && t.status !== 'deprecated')
  if (trending.length > 0) return trending
  // Fallback: popular tools as trending proxy until real analytics are live
  return getPopularTools()
}

/**
 * Get all featured tools sorted by popularity.
 * Drives the FeaturedGrid section on the homepage.
 * Only returns active/beta tools — never coming-soon.
 * Limit results in the component, not here.
 */
export function getFeaturedTools(): ToolMeta[] {
  return toolRegistry
    .filter((t) => t.isFeatured && t.status !== 'deprecated' && t.status !== 'coming-soon')
    .sort((a, b) => {
      // Popular + featured ranked highest
      const scoreA = (a.isPopular ? 2 : 0) + (a.isFeatured ? 1 : 0)
      const scoreB = (b.isPopular ? 2 : 0) + (b.isFeatured ? 1 : 0)
      return scoreB - scoreA
    })
}

/**
 * Get all tools marked as popular.
 * Used in search suggestions and category page highlights.
 * Only returns active/beta tools.
 */
export function getPopularTools(): ToolMeta[] {
  return toolRegistry.filter((t) => t.isPopular && t.status !== 'deprecated' && t.status !== 'coming-soon')
}

/**
 * Get recently added tools (isNew: true).
 * Drives the RecentTools section on the homepage.
 * Only returns active/beta tools — never coming-soon.
 */
export function getNewTools(): ToolMeta[] {
  return toolRegistry.filter((t) => t.isNew && t.status !== 'deprecated' && t.status !== 'coming-soon')
}

/**
 * Get all coming-soon tools.
 * Drives the UpcomingTools section on the homepage and ToolsPage.
 */
export function getUpcomingTools(limit?: number): ToolMeta[] {
  const tools = toolRegistry
    .filter((t) => t.status === 'coming-soon' && !t.isHidden)
    .sort((a, b) => {
      const orderA = a.sortOrder ?? 999
      const orderB = b.sortOrder ?? 999
      return orderA - orderB
    })
  return limit ? tools.slice(0, limit) : tools
}

/**
 * Get tools related to a given slug.
 * Falls back to same-category tools if no related slugs are defined.
 *
 * @param slug   - The source tool's slug
 * @param limit  - Max number of related tools to return (default: 4)
 */
export function getRelatedTools(slug: string, limit = 4): ToolMeta[] {
  const tool = getToolBySlug(slug)
  if (!tool) return []

  if (tool.relatedToolSlugs && tool.relatedToolSlugs.length > 0) {
    const related = tool.relatedToolSlugs
      .map((s) => getToolBySlug(s))
      .filter((t): t is ToolMeta => t !== undefined && t.status !== 'deprecated')
    return related.slice(0, limit)
  }

  // Fallback: same category, excluding the current tool
  return getToolsByCategory(tool.category)
    .filter((t) => t.slug !== slug && t.status !== 'deprecated')
    .slice(0, limit)
}

/**
 * Search tools by query string.
 *
 * Scoring model (higher = more relevant):
 *  3 — Title starts with query
 *  2 — Title contains query
 *  2 — Exact keyword match
 *  1 — Tag match
 *  1 — Description contains query
 *
 * The scoring is intentionally simple for a client-side search.
 * When the backend is live, replace with a proper full-text search.
 *
 * @param query     - Raw search string from the user
 * @param limit     - Max results to return (default: 20)
 * @param category  - Optional category filter
 */
export function searchTools(
  query: string,
  limit = 20,
  category?: ToolCategorySlug
): ToolMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const pool = category ? getToolsByCategory(category) : toolRegistry

  const scored: { tool: ToolMeta; score: number }[] = []

  for (const tool of pool) {
    if (tool.status === 'deprecated') continue

    let score = 0
    const titleLower = tool.title.toLowerCase()
    const descLower = tool.description.toLowerCase()

    if (titleLower.startsWith(q)) score += 3
    else if (titleLower.includes(q)) score += 2

    if (tool.keywords.some((k) => k.toLowerCase() === q)) score += 2
    else if (tool.keywords.some((k) => k.toLowerCase().includes(q))) score += 1

    if (tool.tags.some((t) => t.toLowerCase().includes(q))) score += 1

    if (descLower.includes(q)) score += 1

    if (score > 0) scored.push({ tool, score })
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.tool)
}

/* ─── Statistics ─────────────────────────────────────────────────────────── */

/**
 * Registry-level statistics.
 * Used by the StatsBanner on the homepage and the About page.
 *
 * Note: These are the actual counts from the registry.
 * The inflated numbers shown in the UI (e.g., "150+ tools") reflect
 * the planned tool count, not the current count. Use the registry
 * count for real data once all tools are built.
 */
export const registryStats = {
  /** Total tools registered (includes coming-soon). */
  totalTools: toolRegistry.length,

  /** Total active tools (status: 'active' | 'beta'). */
  activeTools: toolRegistry.filter((t) => t.status === 'active' || t.status === 'beta').length,

  /** Tools available in the browser without a backend. */
  browserTools: toolRegistry.filter((t) => t.processingMode === 'browser').length,

  /** Distinct category count. */
  totalCategories: new Set(toolRegistry.map((t) => t.category)).size,
} as const

/* ─── Category tool counts ───────────────────────────────────────────────── */

/**
 * Get the number of tools in a category.
 * Used by CategoryGrid to show live tool counts.
 */
export function getCategoryToolCount(
  category: ToolCategorySlug,
  activeOnly = false
): number {
  const tools = getToolsByCategory(category)
  if (!activeOnly) return tools.length
  return tools.filter((t) => t.status === 'active' || t.status === 'beta').length
}
