import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NavigationDividerProps {
  /** 'horizontal' divides a row; 'vertical' divides a column */
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NavigationDivider — a thin separator line for navigation sections.
 *
 * @example
 * // Between nav sections in mobile drawer
 * <NavigationDivider />
 *
 * @example
 * // Vertical pipe between header actions
 * <NavigationDivider orientation="vertical" className="h-5" />
 */
export function NavigationDivider({
  orientation = 'horizontal',
  className,
}: NavigationDividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-border', className)}
      />
    )
  }

  return (
    <hr
      aria-orientation="horizontal"
      className={cn('border-none border-t border-border my-2', className)}
    />
  )
}
