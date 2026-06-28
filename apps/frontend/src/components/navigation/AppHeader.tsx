import { useState } from 'react'

import { cn } from '@/utils'

import { DesktopNavigation } from './DesktopNavigation'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { MobileNavigation } from './MobileNavigation'
import { NavigationActions } from './NavigationActions'
import { type HeaderMode, NavigationContainer } from './NavigationContainer'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface AppHeaderProps {
  /**
   * Visual behavior of the header.
   * @default 'sticky'
   */
  mode?: HeaderMode
  /**
   * Called when the search trigger is activated.
   * Wire to a command palette or search modal.
   */
  onSearchOpen?: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * AppHeader — the primary application header.
 *
 * Assembles all navigation pieces into a cohesive header bar.
 *
 * Layout (left → right):
 *  [Logo] [DesktopNavigation]          [NavigationActions] [MobileMenu]
 *
 * Responsive behavior:
 *  - ≥lg: Logo + DesktopNavigation + NavigationActions
 *  - <lg:  Logo + NavigationActions (icon-only) + MobileMenu button
 *  - MobileNavigation slides in as an overlay when MobileMenu is triggered
 *
 * Height:
 *  - h-16 (64px) on all viewports
 *
 * Scroll behavior:
 *  - Controlled by `NavigationContainer` (sticky + backdrop blur + shadow)
 *
 * @example
 * // Standard usage in a layout
 * <AppHeader />
 *
 * @example
 * // Transparent mode for hero pages
 * <AppHeader mode="transparent" />
 *
 * @example
 * // With search integration
 * <AppHeader onSearchOpen={openCommandPalette} />
 */
export function AppHeader({ mode = 'sticky', onSearchOpen, className }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
  }
  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <>
      <NavigationContainer mode={mode} className={className}>
        <div className={cn('container flex h-16 items-center justify-between gap-4')}>
          {/* ── Left: Logo ── */}
          <Logo variant="full" size="md" />

          {/* ── Center: Desktop navigation ── */}
          <DesktopNavigation className="flex-1 justify-center" />

          {/* ── Right: Actions + Mobile toggle ── */}
          <div className="flex items-center gap-1">
            <NavigationActions onSearchOpen={onSearchOpen} />
            <MobileMenu isOpen={isMobileMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>
      </NavigationContainer>

      {/* ── Mobile drawer — rendered outside header to avoid z-index nesting ── */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
        onSearchOpen={() => {
          closeMenu()
          onSearchOpen?.()
        }}
      />
    </>
  )
}
