import { cn } from '@/utils'
import { navConfig } from '@/config'

import { NavigationDropdown } from './NavigationDropdown'
import { NavigationItem } from './NavigationItem'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface DesktopNavigationProps {
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * DesktopNavigation — horizontal navigation for ≥lg viewports.
 *
 * Reads directly from `navConfig.visibleNavItems`. Items with `children`
 * render as `NavigationDropdown`; items without render as `NavigationItem`.
 *
 * Hidden on mobile — the mobile drawer handles smaller viewports.
 *
 * @example
 * <DesktopNavigation />
 */
export function DesktopNavigation({ className }: DesktopNavigationProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className={cn('hidden lg:flex items-center gap-0.5', className)}
    >
      <ul className="flex items-center gap-0.5">
        {navConfig.visibleNavItems.map((item) => {
          const hasVisibleChildren = (item.children?.filter((c) => c.visible) ?? []).length > 0

          return (
            <li key={item.id}>
              {hasVisibleChildren ? (
                <NavigationDropdown item={item} />
              ) : (
                <NavigationItem item={item} context="desktop" />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
