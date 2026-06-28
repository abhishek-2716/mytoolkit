import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { useCardContext } from './cardContext'
import { CARD_CONTENT_PADDING } from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Remove top padding when immediately following a CardHeader.
   * The header already provides bottom spacing.
   * @default false
   */
  noTopPadding?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardContent — the primary body region of a Card.
 *
 * Inherits padding from nearest Card context.
 *
 * @example
 * <CardContent>
 *   <p>Your analytics data will appear here.</p>
 * </CardContent>
 *
 * @example
 * // After a CardHeader — remove duplicate top spacing
 * <CardContent noTopPadding>…</CardContent>
 */
export function CardContent({
  noTopPadding = false,
  className,
  children,
  ...props
}: CardContentProps) {
  const { padding } = useCardContext()

  return (
    <div
      className={cn(CARD_CONTENT_PADDING[padding], noTopPadding && 'pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

CardContent.displayName = 'CardContent'
