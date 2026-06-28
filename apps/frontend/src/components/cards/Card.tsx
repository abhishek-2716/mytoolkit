import type { HTMLAttributes } from 'react'

import { CardContext } from './cardContext'
import {
  type CardPadding,
  type CardRadius,
  cardVariants,
  type SurfaceVariant,
} from './cardVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual surface treatment.
   * @default 'default'
   */
  variant?: SurfaceVariant
  /**
   * Internal spacing scale.
   * When 'none', sub-components (CardHeader, CardContent, CardFooter) manage
   * their own padding — the recommended composition pattern.
   * @default 'none'
   */
  padding?: CardPadding
  /**
   * Border-radius scale.
   * @default 'lg'
   */
  radius?: CardRadius
  /** Renders as the given HTML element. @default 'div' */
  as?: 'div' | 'article' | 'section' | 'aside' | 'li'
  /** Disables all interaction and dims the card */
  disabled?: boolean
  /** Stretch card to full container width */
  fullWidth?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Card — the universal content container.
 *
 * Composes with CardHeader, CardContent, CardFooter, CardMedia, etc.
 * The context it provides auto-aligns padding across all sub-components.
 *
 * @example
 * // Recommended: composition pattern with sub-components
 * <Card variant="elevated" padding="none">
 *   <CardHeader>
 *     <CardTitle>Hello World</CardTitle>
 *   </CardHeader>
 *   <CardContent>Body text</CardContent>
 *   <CardFooter>
 *     <CardActions>
 *       <Button>Action</Button>
 *     </CardActions>
 *   </CardFooter>
 * </Card>
 *
 * @example
 * // Simple: flat card with built-in padding
 * <Card variant="outlined" padding="lg">
 *   Simple content
 * </Card>
 *
 * @example
 * // Clickable card
 * <Card variant="interactive" as="article" onClick={handleClick}>
 *   …
 * </Card>
 */
export function Card({
  variant = 'default',
  padding = 'none',
  radius = 'lg',
  as: Tag = 'div',
  disabled = false,
  fullWidth = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <CardContext.Provider value={{ variant, padding, radius, disabled }}>
      <Tag
        className={cardVariants({ variant, padding, radius, disabled, fullWidth, className })}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </Tag>
    </CardContext.Provider>
  )
}

Card.displayName = 'Card'
