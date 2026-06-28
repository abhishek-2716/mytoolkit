import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/utils'
import type { NavItem } from '@/config'

import { NavigationItem } from './NavigationItem'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NavigationDropdownProps {
  /** Parent nav item — its label becomes the trigger button text */
  item: NavItem
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NavigationDropdown — accessible hover + keyboard dropdown panel.
 *
 * The trigger button opens a floating panel of child `NavItem`s.
 *
 * Interaction model:
 *  - Mouse:    hover to open, mouse-leave to close (with 150ms delay)
 *  - Keyboard: Enter/Space/ArrowDown to open, Escape/Tab to close
 *  - Outside click closes the panel
 *
 * Accessibility:
 *  - `role="navigation"` on the wrapper
 *  - Trigger has `aria-haspopup="true"` and `aria-expanded`
 *  - Panel has `role="menu"`; items have `role="menuitem"`
 *  - Escape returns focus to the trigger
 *
 * @example
 * <NavigationDropdown item={toolsNavItem} />
 */
export function NavigationDropdown({ item, className }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ItemIcon = item.icon

  const visibleChildren = item.children?.filter((c) => c.visible) ?? []

  /* ── Close helpers ── */

  const open = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setIsOpen(true)
  }

  const close = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  const closeImmediate = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setIsOpen(false)
  }

  /* ── Outside click ── */

  useEffect(() => {
    if (!isOpen) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        closeImmediate()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen])

  /* ── Keyboard: panel navigation ── */

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      open()
      // Focus first menu item after paint
      requestAnimationFrame(() => {
        const first = panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')
        first?.focus()
      })
    }
    if (e.key === 'Escape') {
      closeImmediate()
    }
  }

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    )
    const current = document.activeElement as HTMLElement
    const idx = items.indexOf(current)

    if (e.key === 'Escape') {
      e.preventDefault()
      closeImmediate()
      triggerRef.current?.focus()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(idx + 1) % items.length]?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(idx - 1 + items.length) % items.length]?.focus()
    }
    if (e.key === 'Tab') {
      closeImmediate()
    }
  }

  if (visibleChildren.length === 0) {
    // No children — render as a plain NavigationItem
    return <NavigationItem item={item} context="desktop" className={className} />
  }

  return (
    <div className={cn('relative', className)} onMouseEnter={open} onMouseLeave={close}>
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'group inline-flex items-center gap-1.5 rounded-md px-3 py-1.5',
          'text-sm font-medium outline-none transition-colors',
          'text-foreground-muted hover:text-foreground hover:bg-muted',
          'focus-visible:ring-2 focus-visible:ring-primary',
          isOpen && 'text-foreground bg-muted'
        )}
      >
        {ItemIcon && <ItemIcon size={14} strokeWidth={1.75} aria-hidden="true" />}
        <span>{item.label}</span>
        <ChevronDownIcon
          size={12}
          strokeWidth={2}
          aria-hidden="true"
          className={cn('ml-0.5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          id={panelId}
          ref={panelRef}
          role="menu"
          tabIndex={-1}
          aria-label={`${item.label} submenu`}
          onKeyDown={handlePanelKeyDown}
          className={cn(
            'absolute left-0 top-full z-[var(--z-dropdown)] mt-1',
            'min-w-[200px] rounded-lg border border-border bg-surface',
            'shadow-lg py-1.5',
            'animate-in fade-in slide-in-from-top-1 duration-150'
          )}
        >
          {visibleChildren.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              context="dropdown"
              onNavigate={closeImmediate}
              // Announce role to screen readers
              className="[&]:focus-visible:ring-inset"
            />
          ))}
        </div>
      )}
    </div>
  )
}
