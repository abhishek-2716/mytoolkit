import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils'

import { useCardContext } from './cardContext'
import { CARD_HEADER_PADDING } from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Slot rendered to the right of title/subtitle row.
   * Ideal for a badge, action button, or menu trigger.
   */
  action?: ReactNode
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardHeader — top area of a Card with optional action slot.
 *
 * Reads `padding` from the nearest Card context so horizontal spacing
 * always matches CardContent and CardFooter.
 *
 * @example
 * <CardHeader action={<IconButton icon={MoreVerticalIcon} aria-label="More" />}>
 *   <CardTitle>Analytics</CardTitle>
 *   <CardSubtitle>Last 30 days</CardSubtitle>
 * </CardHeader>
 */
export function CardHeader({ action, className, children, ...props }: CardHeaderProps) {
  const { padding } = useCardContext()

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3',
        CARD_HEADER_PADDING[padding],
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {action != null && <div className="shrink-0">{action}</div>}
    </div>
  )
}

CardHeader.displayName = 'CardHeader'
