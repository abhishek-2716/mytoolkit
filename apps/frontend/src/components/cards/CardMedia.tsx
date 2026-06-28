import type { HTMLAttributes, ImgHTMLAttributes } from 'react'

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CardMediaAspect = '16/9' | '4/3' | '3/2' | '1/1' | 'auto'
export type CardMediaPosition = 'top' | 'bottom' | 'left' | 'right'

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `src` of the image to display.
   * If omitted, renders the `children` slot (e.g. a map, video, illustration).
   */
  src?: string
  /** Alt text — required when `src` is provided */
  alt?: string
  /**
   * Aspect ratio of the media container.
   * @default '16/9'
   */
  aspect?: CardMediaAspect
  /**
   * Bleed position inside the card — adds negative margin to remove border-radius
   * on that edge so the image bleeds to the card edge.
   * @default 'top'
   */
  bleed?: CardMediaPosition | 'none'
  /** CSS `object-fit` value for the image. @default 'cover' */
  objectFit?: ImgHTMLAttributes<HTMLImageElement>['loading'] extends string
    ? 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    : 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  /** Lazy-load the image. @default 'lazy' */
  loading?: 'lazy' | 'eager'
}

const ASPECT_MAP: Record<CardMediaAspect, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '1/1': 'aspect-square',
  auto: '',
}

const BLEED_MAP: Record<CardMediaPosition | 'none', string> = {
  none: '',
  top: '-mx-px -mt-px',
  bottom: '-mx-px -mb-px',
  left: '-ml-px -my-px',
  right: '-mr-px -my-px',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * CardMedia — a visual region inside a Card for images or rich media.
 *
 * When `bleed="top"`, the image overflows the card's padding so it touches
 * the top border — the typical "card image" pattern.
 *
 * @example
 * // Standard top image
 * <Card variant="elevated" padding="none">
 *   <CardMedia src="/img/hero.jpg" alt="Tool hero" />
 *   <CardContent>…</CardContent>
 * </Card>
 *
 * @example
 * // Custom media slot (e.g. a map or video)
 * <CardMedia aspect="16/9">
 *   <iframe src="…" className="w-full h-full" title="Map" />
 * </CardMedia>
 */
export function CardMedia({
  src,
  alt = '',
  aspect = '16/9',
  bleed = 'top',
  objectFit = 'cover',
  loading = 'lazy',
  className,
  children,
  ...props
}: CardMediaProps) {
  return (
    <div
      className={cn('overflow-hidden bg-muted', ASPECT_MAP[aspect], BLEED_MAP[bleed], className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn(
            'w-full h-full',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down'
          )}
        />
      ) : (
        children
      )}
    </div>
  )
}

CardMedia.displayName = 'CardMedia'
