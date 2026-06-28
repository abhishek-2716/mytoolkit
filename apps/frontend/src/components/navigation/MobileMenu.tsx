import { MenuIcon, XIcon } from 'lucide-react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface MobileMenuProps {
  /** Whether the mobile navigation drawer is currently open */
  isOpen: boolean
  /** Called when the button is clicked */
  onToggle: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * MobileMenu — the hamburger/close toggle button for the mobile drawer.
 *
 * Visible only on <lg viewports. The animated icon transitions between
 * a hamburger (closed) and an X (open).
 *
 * Accessibility:
 *  - `aria-expanded` reflects the open state
 *  - `aria-controls` links to the mobile navigation panel
 *  - `aria-label` updates to describe the action ("Open menu" / "Close menu")
 *
 * @example
 * <MobileMenu isOpen={isOpen} onToggle={toggleMenu} />
 */
export function MobileMenu({ isOpen, onToggle, className }: MobileMenuProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      onClick={onToggle}
      className={cn(
        'lg:hidden inline-flex items-center justify-center rounded-md p-2',
        'text-foreground-muted hover:text-foreground hover:bg-muted',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'transition-colors',
        className
      )}
    >
      <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center">
        {/* Hamburger icon */}
        <MenuIcon
          size={20}
          strokeWidth={1.75}
          className={cn(
            'absolute transition-all duration-200',
            isOpen ? 'opacity-0 rotate-45 scale-50' : 'opacity-100 rotate-0 scale-100'
          )}
        />
        {/* Close icon */}
        <XIcon
          size={20}
          strokeWidth={1.75}
          className={cn(
            'absolute transition-all duration-200',
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'
          )}
        />
      </span>
    </button>
  )
}
