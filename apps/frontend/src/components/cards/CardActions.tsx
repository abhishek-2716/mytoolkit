import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CardActionsLayout = 'row' | 'col' | 'row-reverse'

export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Layout direction of actions.
   * @default 'row'
   */
  layout?: CardActionsLayout
  /**
   * Gap between action items.
   * @default 'sm'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Horizontal alignment of the action group.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end' | 'between' | 'stretch'
}

const GAP_MAP: Record<NonNullable<CardActionsProps['gap']>, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

const ALIGN_MAP: Record<NonNullable<CardActionsProps['align']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  stretch: '[&>*]:flex-1',
}

const LAYOUT_MAP: Record<CardActionsLayout, string> = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardActions — a flex container for buttons and action controls.
 *
 * Designed to live inside CardFooter but can also be placed in CardContent.
 *
 * @example
 * <CardActions align="end">
 *   <Button variant="ghost">Dismiss</Button>
 *   <Button>Confirm</Button>
 * </CardActions>
 *
 * @example
 * // Full-width stacked actions on mobile
 * <CardActions layout="col" align="stretch">
 *   <Button>Primary action</Button>
 *   <Button variant="outline">Secondary</Button>
 * </CardActions>
 */
export function CardActions({
  layout = 'row',
  gap = 'sm',
  align = 'start',
  className,
  children,
  ...props
}: CardActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center',
        LAYOUT_MAP[layout],
        GAP_MAP[gap],
        ALIGN_MAP[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

CardActions.displayName = 'CardActions'
