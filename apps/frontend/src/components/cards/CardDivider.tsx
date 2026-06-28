import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardDividerProps extends HTMLAttributes<HTMLHRElement> {
  /**
   * Orientation of the divider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Inset removes left/right margin so the divider aligns with content
   * padding rather than bleeding to the card edge.
   * @default false
   */
  inset?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardDivider — a thin rule between card sections.
 *
 * @example
 * // Between CardHeader and CardContent
 * <CardHeader>…</CardHeader>
 * <CardDivider />
 * <CardContent>…</CardContent>
 *
 * @example
 * // Inset divider that aligns with padding
 * <CardDivider inset />
 */
export function CardDivider({
  orientation = 'horizontal',
  inset = false,
  className,
  ...props
}: CardDividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-border', className)}
        {...props}
      />
    )
  }

  return (
    <hr
      className={cn('border-0 border-t border-border', inset ? 'mx-4' : 'mx-0', className)}
      {...props}
    />
  )
}

CardDivider.displayName = 'CardDivider'
