import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** HTML heading level. @default 3 */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardTitle — the primary heading inside a card.
 *
 * Renders as `<h3>` by default; override `level` to match document outline.
 *
 * @example
 * <CardTitle>Monthly Revenue</CardTitle>
 *
 * @example
 * // Top-level card on the page
 * <CardTitle level={2}>Dashboard</CardTitle>
 */
export function CardTitle({ level = 3, className, children, ...props }: CardTitleProps) {
  const Tag = `h${level}`

  return (
    <Tag
      className={cn('text-h5 font-semibold text-foreground leading-tight truncate', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

CardTitle.displayName = 'CardTitle'

/* ─── CardSubtitle ───────────────────────────────────────────────────────── */

export type CardSubtitleProps = HTMLAttributes<HTMLParagraphElement>

/**
 * CardSubtitle — secondary label displayed below CardTitle.
 *
 * Typically a category, date, or short qualifier.
 *
 * @example
 * <CardSubtitle>Updated 2 hours ago</CardSubtitle>
 */
export function CardSubtitle({ className, children, ...props }: CardSubtitleProps) {
  return (
    <p className={cn('text-body-sm text-foreground-muted mt-0.5 truncate', className)} {...props}>
      {children}
    </p>
  )
}

CardSubtitle.displayName = 'CardSubtitle'

/* ─── CardDescription ────────────────────────────────────────────────────── */

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>

/**
 * CardDescription — a longer prose description below the title block.
 *
 * Multi-line, wraps naturally. Prefer CardSubtitle for single-line qualifiers.
 *
 * @example
 * <CardDescription>
 *   Track your conversion rates across all active campaigns.
 * </CardDescription>
 */
export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-body-sm text-foreground-secondary mt-1 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
}

CardDescription.displayName = 'CardDescription'
