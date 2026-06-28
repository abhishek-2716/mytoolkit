import { ThemeSwitcher } from '@/components/common'

import { cn } from '@/utils'

import { NavigationDivider } from './NavigationDivider'
import { SearchTrigger } from './SearchTrigger'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NavigationActionsProps {
  /** Called when the search trigger is activated */
  onSearchOpen?: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NavigationActions — the right side of the header.
 *
 * Contains:
 *  - SearchTrigger (pill on ≥lg, icon on <lg)
 *  - Vertical divider
 *  - ThemeSwitcher (compact mode)
 *
 * Future slots (not yet implemented):
 *  - Notifications bell
 *  - User avatar / auth menu
 *  - Premium badge
 *
 * @example
 * <NavigationActions onSearchOpen={openCommandPalette} />
 */
export function NavigationActions({ onSearchOpen, className }: NavigationActionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label="Header actions">
      {/* ── Search trigger — pill on desktop, icon on smaller screens ── */}
      <SearchTrigger variant="pill" onOpen={onSearchOpen} className="hidden lg:inline-flex" />
      <SearchTrigger variant="icon" onOpen={onSearchOpen} className="lg:hidden" />

      {/* ── Divider ── */}
      <NavigationDivider orientation="vertical" className="h-5 mx-1 hidden sm:block" />

      {/* ── Theme switcher — compact (icon-only) in header ── */}
      <ThemeSwitcher compact />

      {/*
       * ── Future placeholders ──
       *
       * Notifications:
       * <NotificationsBell />
       *
       * Auth menu (unauthenticated):
       * <Button variant="ghost" size="sm" asChild>
       *   <Link to="/login">Sign in</Link>
       * </Button>
       * <Button size="sm" asChild>
       *   <Link to="/register">Get started</Link>
       * </Button>
       *
       * Auth menu (authenticated):
       * <UserAvatar />
       *
       * Premium badge:
       * <PremiumBadge />
       */}
    </div>
  )
}
