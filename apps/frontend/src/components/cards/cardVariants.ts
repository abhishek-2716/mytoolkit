/**
 * Card & Surface Design System — Shared Variant Engine
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for all card and surface styles.
 * Pattern mirrors buttonVariants.ts and inputVariants.ts.
 *
 * Surface variants (visual treatment):
 *   default     — subtle border on surface-bg (standard card)
 *   elevated    — shadow depth, no border
 *   outlined    — strong border, transparent background
 *   filled      — solid muted/tinted background
 *   glass       — backdrop-blur + semi-transparent (future-ready)
 *   muted       — desaturated muted background
 *   interactive — default + hover/focus lift (for clickable cards)
 *   transparent — no background, no border, no shadow
 *
 * Card padding sizes (used by CardContent / Card):
 *   none | xs | sm | md | lg | xl
 * ══════════════════════════════════════════════════════════════════════════
 */

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

/** Visual treatment of a card or surface container. */
export type SurfaceVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'filled'
  | 'glass'
  | 'muted'
  | 'interactive'
  | 'transparent'

/** Spacing scale for card internal padding. */
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Border-radius scale for cards. */
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface CardVariantsOptions {
  variant?: SurfaceVariant
  padding?: CardPadding
  radius?: CardRadius
  /** Disables all pointer events and reduces opacity */
  disabled?: boolean
  /** Full-width (stretch to container) */
  fullWidth?: boolean
  className?: string
}

/* ─── Variant styles ─────────────────────────────────────────────────────── */

const SURFACE_VARIANTS: Record<SurfaceVariant, string> = {
  default: 'bg-surface border border-border',
  elevated: 'bg-surface-raised shadow-md border-0',
  outlined: 'bg-transparent border-2 border-border-strong',
  filled: 'bg-background-muted border border-border-subtle',
  glass:
    'bg-surface/70 backdrop-blur-md border border-border-subtle shadow-sm supports-[backdrop-filter]:bg-surface/50',
  muted: 'bg-muted border border-border-subtle',
  interactive:
    'bg-surface border border-border cursor-pointer transition-all duration-fast hover:shadow-md hover:-translate-y-px hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
  transparent: 'bg-transparent border-0 shadow-none',
}

const PADDING_SIZES: Record<CardPadding, string> = {
  none: '',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
}

const RADIUS_SIZES: Record<CardRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
}

/* ─── cardVariants ───────────────────────────────────────────────────────── */

export function cardVariants({
  variant = 'default',
  padding = 'none',
  radius = 'lg',
  disabled = false,
  fullWidth = false,
  className,
}: CardVariantsOptions = {}): string {
  return cn(
    // Base structure
    'relative overflow-hidden',
    // Variant
    SURFACE_VARIANTS[variant],
    // Padding
    PADDING_SIZES[padding],
    // Radius
    RADIUS_SIZES[radius],
    // Disabled state
    disabled && 'pointer-events-none opacity-[var(--opacity-disabled)]',
    // Width
    fullWidth && 'w-full',
    className
  )
}

/* ─── Sub-component size constants ───────────────────────────────────────── */

/** Padding for CardHeader / CardFooter (horizontal is always px-{n}) */
export const CARD_HEADER_PADDING: Record<CardPadding, string> = {
  none: '',
  xs: 'px-2 py-1.5',
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
  xl: 'px-8 py-5',
}

export const CARD_CONTENT_PADDING: Record<CardPadding, string> = {
  none: '',
  xs: 'px-2 py-1.5',
  sm: 'px-3 py-2',
  md: 'px-4 py-4',
  lg: 'px-6 py-5',
  xl: 'px-8 py-6',
}

export const CARD_FOOTER_PADDING: Record<CardPadding, string> = {
  none: '',
  xs: 'px-2 py-1.5',
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
  xl: 'px-8 py-5',
}

/* ─── CardSize context (used by sub-components via context) ──────────────── */
export type CardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
