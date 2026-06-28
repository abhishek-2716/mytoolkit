import type { HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { useCardContext } from './cardContext'
import { CARD_FOOTER_PADDING } from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CardFooterAlign = 'start' | 'center' | 'end' | 'between'

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Horizontal alignment of footer content.
   * @default 'start'
   */
  align?: CardFooterAlign
  /**
   * Render a top divider separating the footer from body.
   * @default false
   */
  divider?: boolean
}

const ALIGN_MAP: Record<CardFooterAlign, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardFooter — bottom section of a Card, typically for actions or metadata.
 *
 * @example
 * <CardFooter align="end" divider>
 *   <Button variant="ghost">Cancel</Button>
 *   <Button>Save changes</Button>
 * </CardFooter>
 */
export function CardFooter({
  align = 'start',
  divider = false,
  className,
  children,
  ...props
}: CardFooterProps) {
  const { padding } = useCardContext()

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        ALIGN_MAP[align],
        CARD_FOOTER_PADDING[padding],
        divider && 'border-t border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

CardFooter.displayName = 'CardFooter'
