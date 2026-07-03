import type { LucideIcon } from 'lucide-react'

import type { ToolCategorySlug } from '@/constants'

/**
 * ══════════════════════════════════════════════════════════════════════════
 * TOOL REGISTRY — Type Definitions
 * ══════════════════════════════════════════════════════════════════════════
 *
 * These types are the contract that every tool, page, search engine,
 * sitemap generator, and API must satisfy.
 *
 * Rules:
 *  - Never duplicate tool data outside this registry.
 *  - All tool-related display logic reads from ToolMeta.
 *  - All category-related display logic reads from ToolCategoryMeta.
 *  - Never hardcode tool titles, descriptions, or slugs in page files.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ─── Primitives ─────────────────────────────────────────────────────────── */

/**
 * Where the tool's computation runs.
 *
 *  'browser' → Runs entirely client-side. No network required.
 *              Can be implemented immediately (Sprint 4+).
 *
 *  'server'  → Requires a backend API call.
 *              Needs file upload endpoint, processing queue (Sprint 8+).
 *
 *  'hybrid'  → Core logic is browser-side; server enhancement is optional.
 *              Example: PDF viewer (browser) + PDF compression (server).
 */
export type ProcessingMode = 'browser' | 'server' | 'hybrid'

/**
 * User skill level required to use the tool.
 * Shown in the tool header and used for advanced filtering.
 */
export type ToolDifficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Lifecycle status of a tool.
 *
 *  'active'      → Fully functional. Shown in all listings.
 *  'beta'        → Available but may have edge cases. Shown with a badge.
 *  'coming-soon' → Listed in the registry; the tool page shows a preview.
 *                  Drives SEO pages before the tool is fully built.
 *  'deprecated'  → Hidden from listings. Route kept alive for redirects.
 */
export type ToolStatus = 'active' | 'beta' | 'coming-soon' | 'deprecated'

/* ─── SEO ────────────────────────────────────────────────────────────────── */

/**
 * Per-tool SEO metadata.
 * All fields are rendered into <head> tags by MetaTags + JsonLd components.
 */
export interface ToolSeoMeta {
  /**
   * Full page title — rendered as "PDF to Word Converter | ToolNest"
   * Write in action form: "Compress PDF Online — Free & Instant"
   * Keep under 60 chars to avoid truncation in SERPs.
   */
  title: string

  /**
   * Meta description — 140–160 chars.
   * Action-oriented. State what the tool does and the key benefit.
   * Example: "Convert PDF files to editable Word documents instantly.
   *           Free, secure — no registration required."
   */
  description: string

  /**
   * Additional keywords beyond the tool's title/tags.
   * Include synonyms, plurals, action phrases.
   * Example: ['compress pdf', 'reduce pdf size', 'pdf file size reducer']
   */
  keywords: string[]

  /**
   * Absolute URL to a preview image (1200×630px).
   * Used for OG and Twitter Card previews when sharing.
   * Leave undefined to fall back to the site default OG image.
   */
  ogImage?: string
}

/* ─── ToolMeta ───────────────────────────────────────────────────────────── */

/**
 * ToolMeta — the single source of truth for every tool on the platform.
 *
 * This interface is deliberately comprehensive so every consuming system
 * (tool pages, search, SEO, sitemap, API, navigation) reads from one place.
 *
 * Adding a tool to the platform = adding a ToolMeta entry to a category file.
 * No other file needs to change.
 */
export interface ToolMeta {
  /**
   * Unique stable identifier in kebab-case.
   * Example: 'pdf-to-word'
   *
   * WARNING: Never change this after launch. It is used in:
   *  - URL slug: /tools/pdf-to-word
   *  - Analytics events
   *  - Related tool references
   *  - Future API endpoints
   */
  id: string

  /**
   * URL slug — maps to the /tools/:slug route.
   * Identical to `id` in all current tools.
   * Separated in case slug conventions change independently of IDs.
   */
  slug: string

  /** Full display title: "PDF to Word Converter" */
  title: string

  /** Abbreviated title for compact layouts: "PDF to Word" */
  shortTitle: string

  /**
   * 1–2 sentence description shown in the tool page header.
   * State what it does and the primary benefit.
   */
  description: string

  /**
   * Single-sentence description for tool cards and search results.
   * Target ≤80 characters.
   */
  shortDescription: string

  /** Primary category. Maps to a ToolCategoryMeta entry. */
  category: ToolCategorySlug

  /**
   * Optional sub-grouping within a category.
   * Used for advanced filtering in large categories.
   * Example: category='pdf', subcategory='conversion'
   */
  subcategory?: string

  /** Lucide icon rendered in cards, headers, and navigation. */
  icon: LucideIcon

  /**
   * Keywords for search matching.
   * Include the tool name, synonyms, related actions, and file types.
   * Example: ['json', 'format json', 'json formatter', 'json beautifier', 'json pretty print']
   */
  keywords: string[]

  /** Short labels for tag chips in tool cards and detail pages. */
  tags: string[]

  /** Difficulty level shown in the tool header. */
  difficulty: ToolDifficulty

  /** Lifecycle status. Determines visibility and UI treatment. */
  status: ToolStatus

  /** Where computation happens. Drives Sprint planning and infrastructure needs. */
  processingMode: ProcessingMode

  /**
   * Show a "New" badge in listings.
   * Set true for ~30 days after a tool launches, then remove.
   */
  isNew?: boolean

  /**
   * Show a "Popular" badge.
   * Set based on real usage metrics once analytics is live.
   */
  isPopular?: boolean

  /**
   * Include in homepage FeaturedGrid and CategoryGrid highlights.
   * Limit to ≤12 tools total to maintain visual quality.
   */
  isFeatured?: boolean

  /**
   * Requires a premium subscription.
   * Free users see the tool but hit a paywall at the processing step.
   */
  isPremium?: boolean

  /**
   * Accepted input file extensions.
   * Example: ['.pdf', '.docx', '.doc']
   * Empty/undefined = no file input required (text-based tools).
   */
  supportedInputFormats?: string[]

  /**
   * Output file extensions the tool produces.
   * Example: ['.pdf', '.jpg', '.png']
   */
  supportedOutputFormats?: string[]

  /**
   * Maximum file size in megabytes.
   * Enforced on the upload UI and validated by the backend.
   * undefined = not applicable (browser-only text tools).
   */
  maxFileSizeMb?: number

  /** SEO metadata for this tool's page. */
  seo: ToolSeoMeta

  /**
   * Slugs of related tools for the "You might also like" section.
   * Keep to 4–6 entries. Prefer same-category tools.
   */
  relatedToolSlugs?: string[]

  /**
   * Whether this tool is currently trending (high search volume or viral).
   * Set based on real analytics once tracking is live.
   * Drive the "Trending Now" collection on discovery pages.
   */
  isTrending?: boolean

  /**
   * Hide from all discovery pages (tool grid, search, category pages).
   * The route still works — used for incomplete tools in active development.
   * Different from `status: 'deprecated'` which is a permanent removal.
   */
  isHidden?: boolean

  /**
   * Display order within a category grid.
   * Lower numbers appear first. Tools without sortOrder appear after sorted ones.
   * Used to promote flagship tools to the top of their category.
   */
  sortOrder?: number

  /** ISO date: when this tool was first added to the registry. */
  createdAt: string

  /** ISO date: when this tool entry was last updated. */
  updatedAt: string

  /* ── Registry V2 fields (TASK-011) ─────────────────────────────────────── */

  /**
   * Semantic version of the tool's implementation.
   * Increment MINOR when adding new output fields.
   * Increment PATCH for bug fixes.
   * @default '1.0.0'
   */
  version?: string

  /**
   * Typical processing time shown in the tool header.
   * Helps users set expectations before running the tool.
   * Example: 2 → shown as "~2 seconds"
   */
  estimatedTimeSec?: number

  /**
   * Minimum browser requirement.
   *  'all'            → Works in all modern browsers + Safari
   *  'modern'         → Chrome, Firefox, Edge, Safari 14+
   *  'chromium-only'  → Chrome, Edge only (e.g., File System Access API)
   * @default 'all'
   */
  browserSupport?: 'all' | 'modern' | 'chromium-only'

  /**
   * Feature flag key from feature-flags.ts.
   * When set, the tool is only active when the flag is enabled.
   * Used to gate AI tools, premium tools, or experimental features.
   */
  featureFlag?: string
}

/* ─── ToolCategoryMeta ───────────────────────────────────────────────────── */

/**
 * ToolCategoryMeta — display and styling metadata for a tool category.
 *
 * Used by: CategoryGrid, CategoryPage hero, navigation dropdowns,
 *          footer columns, sitemap generation.
 */
export interface ToolCategoryMeta {
  /** Must match one of the ToolCategorySlug values. */
  slug: ToolCategorySlug

  /** Full display name: "PDF Tools" */
  name: string

  /** Compact name for tight layouts: "PDF" */
  shortName: string

  /** Full description for the category page hero (2–3 sentences). */
  description: string

  /** Short description for category cards (≤80 chars). */
  shortDescription: string

  /** Lucide icon component. */
  icon: LucideIcon

  /**
   * Tailwind utility classes for the icon container.
   * Pattern: 'bg-{color}-100 text-{color}-600'
   * Must work in both light and dark modes via CSS variable tokens.
   */
  colorClass: string

  /** Display order in category grids (lower numbers appear first). */
  order: number

  /**
   * Controls visibility in category listings.
   * false = category exists but is not surfaced (e.g. 'ai' before Phase 5).
   */
  isActive: boolean
}
