/**
 * Navigation Configuration — MyToolsHub
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for all navigation structure.
 *
 * Architecture:
 *  - NavItem       — a single navigable link (flat or nested)
 *  - NavGroup      — a labeled collection of items (mobile drawer sections)
 *  - mainNavItems  — top-level header navigation
 *  - mobileNavGroups — mobile drawer sections
 *
 * Adding a new link:
 *  1. Add an entry to `mainNavItems` with `visible: true`
 *  2. Add `children` for a dropdown group
 *  3. For mobile-only items, add to `mobileNavGroups` only
 *  4. For future-gated links, set `visible: false`
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

import type { LucideIcon } from 'lucide-react'
import {
  BookOpenIcon,
  HelpCircleIcon,
  HomeIcon,
  InfoIcon,
  MailIcon,
  WrenchIcon,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * A single navigation destination.
 *
 * The `children` array enables dropdown menus on desktop and
 * collapsible sections on mobile. Nesting beyond one level is
 * not currently rendered but is supported at the data layer.
 */
export interface NavItem {
  /** Unique stable identifier — used as React key and for aria-controls */
  id: string
  /** Display text */
  label: string
  /** Absolute path or full URL */
  href: string
  /** Lucide icon shown alongside the label */
  icon?: LucideIcon
  /** Shown in dropdown panels as a subtitle */
  description?: string
  /** Nested items render as a dropdown on desktop / collapsible on mobile */
  children?: NavItem[]
  /** Set false to hide without removing the entry */
  visible: boolean
  /** When true, opens in a new tab with rel="noopener noreferrer" */
  external?: boolean
  /** Short text badge: "New", "Hot", "Soon" */
  badge?: string
  /*
   * Future expansion slots — not yet consumed by any component:
   *
   * requiredPermission?: string
   * featureFlag?: FeatureFlag
   * analyticsLabel?: string
   */
}

/**
 * A labeled section of navigation items.
 * Used for the mobile drawer and future footer nav columns.
 */
export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

/* ─── Primary navigation ─────────────────────────────────────────────────── */

/**
 * Main header navigation items.
 *
 * Shown in:
 *  - Desktop: horizontal pill list in the header
 *  - Mobile: top section of the drawer
 *
 * Items with `children` render as a dropdown on desktop.
 * Set `visible: false` to hide an item without deleting the config.
 */
export const mainNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: HomeIcon,
    visible: true,
  },
  {
    id: 'tools',
    label: 'Tools',
    href: '/tools',
    icon: WrenchIcon,
    visible: true,
    // Dropdown populated as categories are built (TASK-006+)
    children: [
      // {
      //   id: 'text-tools',
      //   label: 'Text Tools',
      //   href: '/category/text',
      //   description: 'Case converters, word counters, formatters',
      //   visible: true,
      // },
      // {
      //   id: 'image-tools',
      //   label: 'Image Tools',
      //   href: '/category/image',
      //   description: 'Resize, compress, convert images',
      //   visible: true,
      // },
      // {
      //   id: 'dev-tools',
      //   label: 'Developer Tools',
      //   href: '/category/dev',
      //   description: 'JSON formatter, base64, regex tester',
      //   visible: true,
      // },
    ],
  },
  {
    id: 'blog',
    label: 'Blog',
    href: '/blog',
    icon: BookOpenIcon,
    visible: true,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    icon: InfoIcon,
    visible: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    icon: MailIcon,
    visible: true,
  },
  // ── Future items — uncomment when ready ──
  // {
  //   id: 'pricing',
  //   label: 'Pricing',
  //   href: '/pricing',
  //   visible: false,
  //   badge: 'Soon',
  // },
  {
    id: 'faq',
    label: 'FAQ',
    href: '/faq',
    icon: HelpCircleIcon,
    visible: false, // Accessible via footer; keep out of primary nav
  },
]

/** Pre-filtered list — use this in components to skip the visible check */
export const visibleNavItems: NavItem[] = mainNavItems.filter((item) => item.visible)

/* ─── Mobile drawer groups ───────────────────────────────────────────────── */

/**
 * Mobile navigation organized into labeled groups.
 *
 * The first group mirrors the primary header nav.
 * Subsequent groups are for secondary/legal links shown
 * in the drawer footer area.
 */
export const mobileNavGroups: NavGroup[] = [
  {
    id: 'main',
    label: 'Navigation',
    items: visibleNavItems,
  },
  {
    id: 'secondary',
    label: 'More',
    items: [
      {
        id: 'faq-mobile',
        label: 'FAQ',
        href: '/faq',
        icon: HelpCircleIcon,
        visible: true,
      },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    items: [
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy', visible: true },
      { id: 'terms', label: 'Terms of Service', href: '/terms', visible: true },
      { id: 'cookies', label: 'Cookie Policy', href: '/cookies', visible: true },
    ],
  },
]

/* ─── Named export ───────────────────────────────────────────────────────── */

/**
 * Aggregate config object — import this in components.
 *
 * @example
 * import { navConfig } from '@/config'
 * const items = navConfig.visibleNavItems
 */
export const navConfig = {
  mainNavItems,
  visibleNavItems,
  mobileNavGroups,
} as const
