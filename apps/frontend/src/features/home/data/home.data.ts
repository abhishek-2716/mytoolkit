import type { LucideIcon } from 'lucide-react'
import {
  GlobeIcon,
  HeartIcon,
  LockIcon,
  SearchCheckIcon,
  ShieldIcon,
  UploadCloudIcon,
  ZapIcon,
} from 'lucide-react'

import {
  activeCategories,
  getCategoryMeta,
  getCategoryToolCount,
  getFeaturedTools,
  getNewTools,
  getUpcomingTools,
} from '@/registry'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface HomeCategory {
  id: string
  slug: string
  name: string
  description: string
  icon: LucideIcon
  /** Number of tools in this category */
  toolCount: number
  /**
   * Tailwind background + text classes for the icon container.
   * Keep these stable — they define the visual identity of each category.
   */
  colorClass: string
}

export interface HomeTool {
  id: string
  slug: string
  name: string
  description: string
  icon: LucideIcon
  category: string
  categorySlug: string
  isPopular?: boolean
  isNew?: boolean
}

export interface WhyFeature {
  icon: LucideIcon
  title: string
  description: string
  colorClass: string
}

export interface StatItem {
  value: number
  /** Appended after the formatted number: '+', '%', etc. */
  suffix: string
  label: string
}

export interface HowItWorksStep {
  step: number
  icon: LucideIcon
  title: string
  description: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

/* ─── Categories ─────────────────────────────────────────────────────────── */

/**
 * Derived from the registry — always reflects the real category list and
 * live tool counts. Never hardcode category data here.
 */
export const homeCategories: HomeCategory[] = activeCategories.map((cat) => ({
  id: cat.slug,
  slug: cat.slug,
  name: cat.name,
  description: cat.shortDescription,
  icon: cat.icon,
  toolCount: getCategoryToolCount(cat.slug),
  colorClass: cat.colorClass,
}))



/* ─── Featured tools ─────────────────────────────────────────────────────── */

/**
 * Derived from the registry — tools marked isFeatured: true, sorted by
 * popularity. Capped at 9 in this layer; components may slice further.
 */
export const featuredTools: HomeTool[] = getFeaturedTools()
  .slice(0, 9)
  .map((tool) => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.title,
    description: tool.shortDescription,
    icon: tool.icon,
    category: getCategoryMeta(tool.category)?.name ?? tool.category,
    categorySlug: tool.category,
    isPopular: tool.isPopular,
    isNew: tool.isNew,
  }))

/* ─── Recently added tools ───────────────────────────────────────────────── */

/**
 * Derived from the registry — tools marked isNew: true.
 * Falls back to featured tools when no new tools are registered yet.
 * Only active/beta tools — never coming-soon.
 */
export const recentTools: HomeTool[] = (getNewTools().length > 0 ? getNewTools() : getFeaturedTools())
  .slice(0, 6)
  .map((tool) => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.title,
    description: tool.shortDescription,
    icon: tool.icon,
    category: getCategoryMeta(tool.category)?.name ?? tool.category,
    categorySlug: tool.category,
    isPopular: tool.isPopular,
    isNew: tool.isNew,
  }))

/* ─── Upcoming tools ─────────────────────────────────────────────────────── */

/**
 * Derived from the registry — tools with status: 'coming-soon'.
 * Shown in a separate "Upcoming" section on the homepage.
 */
export const upcomingTools: HomeTool[] = getUpcomingTools(8).map((tool) => ({
  id: tool.id,
  slug: tool.slug,
  name: tool.title,
  description: tool.shortDescription,
  icon: tool.icon,
  category: getCategoryMeta(tool.category)?.name ?? tool.category,
  categorySlug: tool.category,
  isPopular: false,
  isNew: false,
}))

/* ─── Why Choose ─────────────────────────────────────────────────────────── */

export const whyFeatures: WhyFeature[] = [
  {
    icon: ZapIcon,
    title: 'Lightning Fast',
    description: 'Optimized processing pipeline delivers results in seconds, not minutes.',
    colorClass: 'bg-warning-light text-warning-700',
  },
  {
    icon: ShieldIcon,
    title: '100% Secure',
    description: 'Your files are processed in isolated environments and deleted immediately after.',
    colorClass: 'bg-success-light text-success-700',
  },
  {
    icon: HeartIcon,
    title: 'Always Free',
    description: 'Core tools are free forever. No hidden fees, no bait-and-switch pricing.',
    colorClass: 'bg-danger-light text-danger-700',
  },
  {
    icon: LockIcon,
    title: 'No Registration',
    description: 'Jump straight into using any tool without creating an account.',
    colorClass: 'bg-primary-light text-primary-700',
  },
  {
    icon: GlobeIcon,
    title: 'Works Everywhere',
    description: 'Access all tools from any device — desktop, tablet, or mobile.',
    colorClass: 'bg-info-light text-info-600',
  },
  {
    icon: ShieldIcon,
    title: 'Privacy First',
    description: 'We do not sell your data. Your files stay yours — we never share them.',
    colorClass: 'bg-accent-light text-accent-700',
  },
]

/* ─── Stats ──────────────────────────────────────────────────────────────── */

export const stats: StatItem[] = [
  { value: 150, suffix: '+', label: 'Free Tools' },
  { value: 2, suffix: 'M+', label: 'Monthly Users' },
  { value: 50, suffix: 'M+', label: 'Files Processed' },
  { value: 180, suffix: '+', label: 'Countries Served' },
]

/* ─── How It Works ───────────────────────────────────────────────────────── */

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    icon: SearchCheckIcon,
    title: 'Choose Your Tool',
    description: 'Browse 150+ tools by category or search for exactly what you need.',
  },
  {
    step: 2,
    icon: UploadCloudIcon,
    title: 'Upload Your File',
    description: 'Drag and drop or click to upload. Most formats are supported out of the box.',
  },
  {
    step: 3,
    icon: ZapIcon,
    title: 'Download the Result',
    description: 'Your file is processed instantly. Download the result with one click.',
  },
]

/* ─── FAQ ────────────────────────────────────────────────────────────────── */

export const homeFaqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Are all tools completely free?',
    answer:
      'Yes. All core tools are free to use with no sign-up required. We may introduce optional premium features in the future, but the essentials will always remain free.',
  },
  {
    id: 'faq-2',
    question: 'Do I need to create an account?',
    answer:
      'No. You can use any tool without registering. Simply open the tool, upload your file or enter your data, and get the result instantly.',
  },
  {
    id: 'faq-3',
    question: 'How are my files kept private?',
    answer:
      'All processing runs entirely in your browser. Your files never leave your device — nothing is uploaded to any server. Your data stays completely private.',
  },
  {
    id: 'faq-4',
    question: 'What file formats are supported?',
    answer:
      'Support varies by tool. PDF tools handle all PDF variants, image tools support JPEG, PNG, WebP, AVIF, GIF, SVG and more. Check the tool page for specific format information.',
  },
  {
    id: 'faq-5',
    question: 'How fast is the processing?',
    answer:
      'Most tools complete processing in under 10 seconds for standard file sizes. Large files (over 100 MB) may take up to a minute depending on the operation.',
  },
]

/* ─── Popular searches ───────────────────────────────────────────────────── */

export const popularSearches: string[] = [
  'PDF to Word',
  'Image Compress',
  'Background Remove',
  'JSON Format',
  'Unit Convert',
  'Password Generate',
]
