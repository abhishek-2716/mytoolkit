import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { useScrolled } from '@/hooks/useScrolled'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Visual modes for the navigation container.
 *
 * | Mode        | Description                                         |
 * |-------------|-----------------------------------------------------|
 * | sticky      | Fixed at top; gains shadow + solid bg on scroll     |
 * | transparent | Transparent initially; becomes solid on scroll      |
 * | solid       | Always solid; no scroll-aware behavior              |
 */
export type HeaderMode = 'sticky' | 'transparent' | 'solid'

export interface NavigationContainerProps extends ComponentPropsWithoutRef<'header'> {
  /** Controls sticky/transparent/solid behavior. @default 'sticky' */
  mode?: HeaderMode
  /**
   * Scroll threshold in pixels before the header transitions
   * from transparent/minimal to solid. @default 10
   */
  scrollThreshold?: number
  children: ReactNode
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NavigationContainer — scroll-aware `<header>` wrapper.
 *
 * Handles:
 *  - `position: sticky` (mode='sticky' or 'transparent')
 *  - Background opacity transition on scroll
 *  - Box shadow on scroll
 *  - Height transition on scroll (full → compact)
 *  - Announces landmark role to screen readers
 *
 * Does NOT render any navigation content — that is `AppHeader`'s job.
 * NavigationContainer is purely the positioning + visual shell.
 *
 * @example
 * <NavigationContainer mode="sticky">
 *   <AppHeaderContent />
 * </NavigationContainer>
 */
export function NavigationContainer({
  mode = 'sticky',
  scrollThreshold = 10,
  className,
  children,
  ...props
}: NavigationContainerProps) {
  const isScrolled = useScrolled({ threshold: scrollThreshold })

  return (
    <header
      role="banner"
      className={cn(
        /* ── Positioning ── */
        mode !== 'solid' && 'sticky top-0',

        /* ── Z-index ── */
        'z-[var(--z-sticky)]',

        /* ── Base styles ── */
        'w-full transition-all duration-300',

        /* ── Transparent mode: no bg/border until scrolled ── */
        mode === 'transparent' && !isScrolled
          ? 'bg-transparent border-b border-transparent'
          : 'border-b border-border',

        /* ── Background: solid below scroll, glass above ── */
        isScrolled || mode === 'solid'
          ? 'bg-background/95 backdrop-blur-sm'
          : mode === 'sticky'
            ? 'bg-background/95 backdrop-blur-sm'
            : 'bg-transparent',

        /* ── Shadow on scroll ── */
        isScrolled && 'shadow-sm',

        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}
