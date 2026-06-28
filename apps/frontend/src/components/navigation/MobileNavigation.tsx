import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/utils'
import { navConfig } from '@/config'
import { appConfig } from '@/config'

import { NavigationGroup } from './NavigationGroup'
import { SearchTrigger } from './SearchTrigger'

/* ─── Animation variants ─────────────────────────────────────────────────── */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 40 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  onSearchOpen?: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * MobileNavigation — animated slide-in drawer for <lg viewports.
 *
 * Structure:
 *  - Scrim overlay (closes on click)
 *  - Drawer panel slides in from the right
 *  - Header: brand name + close button
 *  - Search trigger
 *  - NavigationGroup sections (main nav + secondary + legal)
 *
 * Accessibility:
 *  - `role="dialog"` with `aria-modal="true"` and `aria-label`
 *  - Focus is moved to the first nav item on open
 *  - Escape key closes the drawer
 *  - Focus trap keeps keyboard users inside while open
 *  - Body scroll is locked while open
 *
 * @example
 * <MobileNavigation isOpen={isOpen} onClose={close} />
 */
export function MobileNavigation({
  isOpen,
  onClose,
  onSearchOpen,
  className,
}: MobileNavigationProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  /* ── Lock body scroll when open ── */
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isOpen])

  /* ── Keyboard: Escape closes, Tab traps focus inside drawer ── */
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  /* ── Focus first link when drawer opens ── */
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      const el = drawerRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')
      if (el) el.focus()
    }, 100)
    return () => {
      clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Scrim overlay ── */}
          <motion.div
            key="mobile-nav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-[var(--z-modal-backdrop)] overlay lg:hidden"
            aria-hidden="true"
          />

          {/* ── Drawer panel ── */}
          <motion.div
            key="mobile-nav-drawer"
            id="mobile-navigation"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed right-0 top-0 bottom-0 z-[var(--z-modal)]',
              'w-[min(320px,90vw)] bg-background border-l border-border',
              'flex flex-col overflow-hidden shadow-2xl lg:hidden',
              className
            )}
          >
            {/* ── Drawer header ── */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4 shrink-0">
              <span className="type-label font-bold text-foreground">{appConfig.name}</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className={cn(
                  'inline-flex items-center justify-center rounded-md p-1.5',
                  'text-foreground-muted hover:text-foreground hover:bg-muted',
                  'outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  'transition-colors'
                )}
              >
                {/* Inline X icon to avoid icon import dependency in this file */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Search trigger ── */}
            <div className="shrink-0 border-b border-border px-4 py-3">
              <SearchTrigger
                variant="pill"
                onOpen={() => {
                  onClose()
                  onSearchOpen?.()
                }}
                className="w-full"
              />
            </div>

            {/* ── Scrollable nav sections ── */}
            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto py-2">
              {navConfig.mobileNavGroups.map((group, index) => (
                <NavigationGroup
                  key={group.id}
                  group={group}
                  showLabel={index > 0}
                  onNavigate={onClose}
                />
              ))}
            </nav>

            {/* ── Drawer footer ── */}
            <div className="shrink-0 border-t border-border px-4 py-4">
              <p className="text-center type-caption text-foreground-muted">
                © {new Date().getFullYear()} {appConfig.name}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
