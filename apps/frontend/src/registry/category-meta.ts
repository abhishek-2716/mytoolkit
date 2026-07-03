import {
  AlignLeft,
  BarChart2,
  Brain,
  Calculator,
  Code,
  FileText,
  Image,
  Sparkles,
  Wand2,
  Wrench,
  Zap,
} from 'lucide-react'

import type { ToolCategoryMeta } from './types'

/**
 * Category Metadata Registry
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for every tool category's display information.
 *
 * Consumed by:
 *  - CategoryGrid (homepage)
 *  - CategoryPage (hero section)
 *  - Navigation dropdown menus
 *  - Footer category columns
 *  - Sitemap generation
 *  - Search result grouping
 *
 * Rules:
 *  - slug must match a ToolCategorySlug value
 *  - colorClass must use Tailwind token-based classes (no hardcoded hex)
 *  - order controls the display sequence in all category grids
 *  - isActive: false = hidden from listings, routes still work
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

export const categoryMeta: ToolCategoryMeta[] = [
  {
    slug: 'pdf',
    name: 'PDF Tools',
    shortName: 'PDF',
    description:
      'Complete PDF management toolkit. Merge, split, compress, convert, protect, and edit PDF files — all without installing software. Fast, secure, and free.',
    shortDescription: 'Merge, split, compress, and convert PDF files.',
    icon: FileText,
    colorClass: 'bg-danger-light text-danger',
    order: 1,
    isActive: true,
  },
  {
    slug: 'image',
    name: 'Image Tools',
    shortName: 'Images',
    description:
      'Powerful image processing tools for everyone. Compress, resize, crop, convert, and enhance images. Remove backgrounds, add watermarks, and more.',
    shortDescription: 'Compress, resize, crop, and convert images.',
    icon: Image,
    colorClass: 'bg-primary-subtle text-primary',
    order: 2,
    isActive: true,
  },
  {
    slug: 'developer',
    name: 'Developer Tools',
    shortName: 'Developer',
    description:
      'Essential utilities for web developers and engineers. Format and validate JSON, decode JWTs, encode URLs and Base64, generate UUIDs, test regex, and more.',
    shortDescription: 'JSON, JWT, Base64, UUID, regex, and more.',
    icon: Code,
    colorClass: 'bg-info-light text-info',
    order: 3,
    isActive: true,
  },
  {
    slug: 'text',
    name: 'Text Tools',
    shortName: 'Text',
    description:
      'Transform, analyze, and clean text with precision. Count words, convert cases, compare documents, remove duplicates, sort lines, and more.',
    shortDescription: 'Count, convert, compare, and transform text.',
    icon: AlignLeft,
    colorClass: 'bg-muted text-foreground-secondary',
    order: 4,
    isActive: true,
  },
  {
    slug: 'seo',
    name: 'SEO Tools',
    shortName: 'SEO',
    description:
      'Improve your search engine rankings with our SEO toolkit. Generate meta tags, Open Graph code, robots.txt files, sitemaps, and analyze keyword density.',
    shortDescription: 'Meta tags, OG generator, robots.txt, and sitemaps.',
    icon: BarChart2,
    colorClass: 'bg-success-light text-success',
    order: 5,
    isActive: true,
  },
  {
    slug: 'calculator',
    name: 'Calculators',
    shortName: 'Calculators',
    description:
      'Quick and accurate calculators for everyday use. Calculate percentages, age, BMI, loan EMIs, tips, GST, and many other everyday computations.',
    shortDescription: 'Percentage, age, BMI, loan, and GST calculators.',
    icon: Calculator,
    colorClass: 'bg-warning-light text-warning',
    order: 6,
    isActive: true,
  },
  {
    slug: 'generator',
    name: 'Generators',
    shortName: 'Generate',
    description:
      'Generate passwords, QR codes, color palettes, CSS gradients, favicons, and more. Everything you need to create digital assets in seconds.',
    shortDescription: 'Passwords, QR codes, color palettes, and more.',
    icon: Wand2,
    colorClass: 'bg-accent-light text-accent',
    order: 7,
    isActive: true,
  },
  {
    slug: 'ai',
    name: 'AI Tools',
    shortName: 'AI',
    description:
      'Harness the power of artificial intelligence. Summarize articles, rewrite content, translate languages, upscale images, and generate text with AI.',
    shortDescription: 'AI-powered summarizer, translator, and image tools.',
    icon: Sparkles,
    colorClass: 'bg-accent-light text-accent',
    order: 8,
    isActive: true,
  },
  {
    slug: 'converter',
    name: 'Converters',
    shortName: 'Convert',
    description:
      'Convert between units, file formats, number systems, and more. Unit converter, number base converter, and other essential conversion tools.',
    shortDescription: 'Unit, number, and format converters.',
    icon: Zap,
    colorClass: 'bg-primary-subtle text-primary',
    order: 9,
    isActive: false, // No tools in this category yet — enabled in a later sprint
  },
  {
    slug: 'office',
    name: 'Office Tools',
    shortName: 'Office',
    description:
      'Productivity tools for office work. Work with spreadsheets, documents, presentations, and other office file formats efficiently.',
    shortDescription: 'Spreadsheets, documents, and office utilities.',
    icon: Wrench,
    colorClass: 'bg-warning-light text-warning',
    order: 10,
    isActive: false, // Enabled in Sprint 11+
  },
  {
    slug: 'writing',
    name: 'Writing Tools',
    shortName: 'Writing',
    description:
      'Tools to improve your writing. Grammar checker, readability scorer, plagiarism detector, and writing style improver.',
    shortDescription: 'Grammar, readability, and writing tools.',
    icon: AlignLeft,
    colorClass: 'bg-muted text-foreground-secondary',
    order: 11,
    isActive: false, // Enabled when writing tools are built
  },
  {
    slug: 'security',
    name: 'Security Tools',
    shortName: 'Security',
    description:
      'Essential security tools for developers and users. Password strength checkers, hash generators, encryption tools, and more.',
    shortDescription: 'Password, hash, and encryption tools.',
    icon: Brain,
    colorClass: 'bg-danger-light text-danger',
    order: 12,
    isActive: false, // Enabled when security tools are built
  },
]

/** O(1) slug → category lookup map. */
export const categoryMetaMap = new Map(categoryMeta.map((c) => [c.slug, c]))

/** Returns only actively listed categories, sorted by order. */
export const activeCategories: ToolCategoryMeta[] = categoryMeta
  .filter((c) => c.isActive)
  .sort((a, b) => a.order - b.order)

/** Retrieve a single category's metadata by slug. Returns undefined if not found. */
export function getCategoryMeta(slug: string): ToolCategoryMeta | undefined {
  return categoryMetaMap.get(slug as ToolCategoryMeta['slug'])
}
