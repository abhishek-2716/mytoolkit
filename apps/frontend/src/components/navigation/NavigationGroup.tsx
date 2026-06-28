import { cn } from '@/utils'
import type { NavGroup } from '@/config'

import { NavigationDivider } from './NavigationDivider'
import { NavigationItem } from './NavigationItem'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NavigationGroupProps {
  group: NavGroup
  /** Renders the group label as a section heading */
  showLabel?: boolean
  context?: 'mobile' | 'footer'
  onNavigate?: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NavigationGroup — a labeled section of navigation items.
 *
 * Used in the mobile drawer to organize items into sections (Navigation,
 * More, Legal). Each group has an optional visible label.
 *
 * @example
 * <NavigationGroup
 *   group={mobileNavGroups[0]}
 *   showLabel
 *   onNavigate={closeMobileMenu}
 * />
 */
export function NavigationGroup({
  group,
  showLabel = true,
  context = 'mobile',
  onNavigate,
  className,
}: NavigationGroupProps) {
  const visibleItems = group.items.filter((item) => item.visible)

  if (visibleItems.length === 0) return null

  return (
    <div className={cn('flex flex-col', className)}>
      {showLabel && (
        <>
          <NavigationDivider className="mx-4" />
          <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            {group.label}
          </p>
        </>
      )}

      <ul className="flex flex-col gap-0.5 px-2">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <NavigationItem item={item} context={context} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  )
}
