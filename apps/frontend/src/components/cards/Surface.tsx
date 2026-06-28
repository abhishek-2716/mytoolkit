import type { HTMLAttributes } from 'react'

import {
  type CardPadding,
  type CardRadius,
  cardVariants,
  type SurfaceVariant,
} from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual surface treatment.
   * @default 'default'
   */
  variant?: SurfaceVariant
  /**
   * Internal padding scale.
   * @default 'md'
   */
  padding?: CardPadding
  /**
   * Border-radius scale.
   * @default 'lg'
   */
  radius?: CardRadius
  /** Renders as the given element. @default 'div' */
  as?: 'div' | 'section' | 'aside' | 'main' | 'article' | 'nav'
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Surface — a generic visual container with the same surface variants as Card
 * but without the Card composition context.
 *
 * Use Surface when you need a styled container that does NOT require
 * CardHeader / CardContent sub-components.
 *
 * Use Card when building structured content (with header, content, footer).
 *
 * @example
 * <Surface variant="elevated" padding="lg">
 *   <p>This is a surface.</p>
 * </Surface>
 *
 * @example
 * <Surface as="aside" variant="muted" padding="md">
 *   <InfoIcon />
 *   <p>Helpful tip</p>
 * </Surface>
 */
export function Surface({
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  as: Tag = 'div',
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <Tag className={cardVariants({ variant, padding, radius, className })} {...props}>
      {children}
    </Tag>
  )
}

Surface.displayName = 'Surface'
