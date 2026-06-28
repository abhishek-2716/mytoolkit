import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CardBadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent'
  | 'outline'

export type CardBadgeSize = 'sm' | 'md'

export interface CardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Color intent of the badge.
   * @default 'default'
   */
  variant?: CardBadgeVariant
  /**
   * Size of the badge.
   * @default 'sm'
   */
  size?: CardBadgeSize
  /**
   * When true, renders a dot indicator before the text.
   */
  dot?: boolean
}

const BADGE_VARIANTS: Record<CardBadgeVariant, string> = {
  default: 'bg-muted text-foreground-secondary border border-border',
  primary: 'bg-primary/10 text-primary border border-primary/20',
  success: 'bg-success-light text-success-700 border border-success-200',
  warning: 'bg-warning-light text-warning-700 border border-warning-200',
  danger: 'bg-danger-light text-danger-700 border border-danger-200',
  info: 'bg-info-light text-info-600 border border-info-200',
  accent: 'bg-accent-light text-accent-700 border border-accent-200',
  outline: 'bg-transparent text-foreground-secondary border border-border-strong',
}

const BADGE_SIZES: Record<CardBadgeSize, string> = {
  sm: 'text-caption px-1.5 py-0.5 gap-1',
  md: 'text-label px-2 py-0.5 gap-1.5',
}

const DOT_VARIANTS: Record<CardBadgeVariant, string> = {
  default: 'bg-foreground-muted',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  accent: 'bg-accent',
  outline: 'bg-foreground-muted',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardBadge — a compact status or category label inside a card.
 *
 * Commonly placed in the CardHeader `action` slot or floating over CardMedia.
 *
 * @example
 * <CardBadge variant="success" dot>Live</CardBadge>
 *
 * @example
 * // In header action slot
 * <CardHeader action={<CardBadge variant="primary">New</CardBadge>}>
 *   <CardTitle>Feature</CardTitle>
 * </CardHeader>
 */
export function CardBadge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}: CardBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium shrink-0',
        BADGE_VARIANTS[variant],
        BADGE_SIZES[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            'rounded-full shrink-0',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            DOT_VARIANTS[variant]
          )}
        />
      )}
      {children}
    </span>
  )
}

CardBadge.displayName = 'CardBadge'
