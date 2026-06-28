import { Link, useMatch, useResolvedPath } from 'react-router-dom'

import { cn } from '@/utils'
import type { NavItem } from '@/config'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NavigationItemProps {
  item: NavItem
  /**
   * Layout context controls visual style.
   *
   * | Context  | Style                              |
   * |----------|------------------------------------|
   * | desktop  | Subtle text link with hover bg      |
   * | mobile   | Full-width row with icon + label    |
   * | dropdown | Compact row inside a panel          |
   * | footer   | Minimal text link                  |
   */
  context?: 'desktop' | 'mobile' | 'dropdown' | 'footer'
  /** Called after the item is clicked (e.g. to close the mobile drawer) */
  onNavigate?: () => void
  className?: string
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Determine whether this nav item should be considered "active".
 *
 * Rules:
 *  - Exact match for home ("/")
 *  - Prefix match for all other routes so that "/blog/my-post"
 *    keeps "/blog" active
 */
function useIsActive(href: string): boolean {
  const resolved = useResolvedPath(href)
  const isExact = href === '/'
  const match = useMatch({ path: resolved.pathname, end: isExact })
  return match !== null
}

/* ─── Context styles ──────────────────────────────────────────────────────── */

const baseItemClasses =
  'group inline-flex items-center gap-2 rounded-md outline-none transition-colors'

const contextClasses: Record<NonNullable<NavigationItemProps['context']>, string> = {
  desktop:
    'px-3 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary',
  mobile:
    'w-full px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary',
  dropdown:
    'w-full px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary',
  footer:
    'text-sm text-foreground-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary',
}

const activeClasses: Record<NonNullable<NavigationItemProps['context']>, string> = {
  desktop: 'text-foreground bg-muted',
  mobile: 'text-primary bg-primary/10 font-semibold',
  dropdown: 'text-foreground bg-muted',
  footer: 'text-foreground',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NavigationItem — a single navigation link.
 *
 * Automatically highlights when the current route matches `item.href`.
 * Reads from `NavItem` config: supports icons, badges, and external links.
 *
 * @example
 * <NavigationItem item={navConfig.visibleNavItems[0]} context="desktop" />
 */
export function NavigationItem({
  item,
  context = 'desktop',
  onNavigate,
  className,
}: NavigationItemProps) {
  const isActive = useIsActive(item.href)
  const ItemIcon = item.icon

  const linkClasses = cn(
    baseItemClasses,
    contextClasses[context],
    isActive && activeClasses[context],
    className
  )

  const content = (
    <>
      {/* Icon — shown in mobile and dropdown contexts */}
      {ItemIcon && (context === 'mobile' || context === 'dropdown') && (
        <ItemIcon
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn(
            'shrink-0',
            isActive ? 'text-primary' : 'text-foreground-muted group-hover:text-foreground'
          )}
        />
      )}

      <span>{item.label}</span>

      {/* Badge */}
      {item.badge && (
        <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary leading-none">
          {item.badge}
        </span>
      )}
    </>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        onClick={onNavigate}
        aria-label={`${item.label} (opens in new tab)`}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      to={item.href}
      className={linkClasses}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  )
}
