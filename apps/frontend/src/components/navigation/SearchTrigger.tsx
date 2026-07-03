import { SearchIcon } from 'lucide-react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SearchTriggerProps {
  /**
   * Controls the visual density of the trigger.
   *
   * | Variant | Description                                    |
   * |---------|------------------------------------------------|
   * | pill    | Input-like pill with placeholder text (desktop)|
   * | icon    | Icon-only compact button (mobile / collapsed)  |
   */
  variant?: 'pill' | 'icon'
  /**
   * Called when the trigger is activated (click or keyboard shortcut).
   *
   * ⚠️ Do NOT implement search here. Connect this to a future command
   * palette or search modal (TASK-008+).
   */
  onOpen?: () => void
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * SearchTrigger — navigation entry point for site search.
 *
 * This component is a UI trigger ONLY. It has no search logic.
 * Wire `onOpen` to a command palette or search modal when ready.
 *
 * Keyboard shortcut placeholder:
 *  - Desktop: shows ⌘K / Ctrl+K badge
 *  - Shortcut handling is NOT implemented here — connect via a global
 *    `keydown` listener in the future search provider
 *
 * @example
 * // Desktop pill in header
 * <SearchTrigger variant="pill" onOpen={openCommandPalette} />
 *
 * @example
 * // Mobile icon button
 * <SearchTrigger variant="icon" onOpen={openSearch} />
 */
export function SearchTrigger({ variant = 'pill', onOpen, className }: SearchTriggerProps) {
  if (variant === 'icon') {
    return (
      <button
        type="button"
        aria-label="Search (⌘K)"
        onClick={onOpen}
        className={cn(
          'inline-flex items-center justify-center rounded-md p-2',
          'text-foreground-muted hover:text-foreground hover:bg-muted',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'transition-colors',
          className
        )}
      >
        <SearchIcon size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Search MyToolsHub (⌘K)"
      aria-keyshortcuts="Meta+k Control+k"
      onClick={onOpen}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-full',
        'border border-border bg-muted/50 hover:bg-muted',
        'px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'transition-colors min-w-[160px]',
        className
      )}
    >
      <SearchIcon size={14} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      <span className="flex-1 text-left">Search…</span>
      {/* Keyboard shortcut badge — desktop only */}
      <kbd
        aria-hidden="true"
        className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 text-[10px] font-medium text-foreground-muted leading-none"
      >
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>
  )
}
