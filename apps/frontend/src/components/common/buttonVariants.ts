/**
 * buttonVariants — core variant/size engine for the Button system.
 *
 * All button components share this single source of truth for styles.
 * The pattern mirrors CVA (class-variance-authority) without the dependency.
 *
 * Adding a new variant:
 *  1. Add the key to `ButtonVariant`
 *  2. Add a class string to `VARIANTS`
 *  3. Done — all button components inherit it automatically
 *
 * Adding a new size:
 *  1. Add the key to `ButtonSize`
 *  2. Add entries to `SIZES`, `SQUARE_SIZES`, and `BUTTON_ICON_SIZE`
 */

import { cn } from '@/utils'

/* ─── Public types ───────────────────────────────────────────────────────── */

/**
 * Visual intent variants.
 *
 * | Variant   | Use case                                      |
 * |-----------|-----------------------------------------------|
 * | primary   | Primary CTA — one per section                 |
 * | secondary | Secondary actions, grouped with primary       |
 * | outline   | Tertiary, less prominent than secondary       |
 * | ghost     | Low-emphasis, menu items, toolbars            |
 * | soft      | Tinted primary bg — softer than primary       |
 * | success   | Confirm, save, complete                       |
 * | warning   | Proceed with caution, continue, acknowledge   |
 * | danger    | Delete, remove, destructive actions           |
 * | link      | Inline hyperlink-style — no bg, no border     |
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'soft'
  | 'success'
  | 'warning'
  | 'danger'
  | 'link'

/**
 * T-shirt size scale.
 *
 * | Size | Height | Touch target | Use case                    |
 * |------|--------|--------------|------------------------------|
 * | xs   | 28px   | OK for UI    | Compact tables, tags         |
 * | sm   | 32px   | Borderline   | Secondary controls, sidebars |
 * | md   | 36px   | WCAG 2.5.5   | Default in most contexts     |
 * | lg   | 40px   | Comfortable  | Primary CTAs, forms          |
 * | xl   | 48px   | Touch-first  | Hero CTAs, mobile emphasis   |
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Options accepted by `buttonVariants()` */
export interface ButtonVariantsOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Stretch to fill parent width */
  fullWidth?: boolean
  /** Equal width/height (for icon-only buttons) */
  square?: boolean
  className?: string
}

/* ─── Icon size constants ────────────────────────────────────────────────── */

/**
 * Icon pixel size for each button size.
 * Consumed by Button, IconButton, and LoadingButton for consistent icon scaling.
 */
export const BUTTON_ICON_SIZE: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
}

/* ─── Base classes ───────────────────────────────────────────────────────── */

/**
 * Classes applied to every button regardless of variant or size.
 * Encapsulates layout, typography, interaction, and accessibility baseline.
 */
const BASE =
  'inline-flex items-center justify-center ' +
  'whitespace-nowrap font-medium leading-none select-none ' +
  'outline-none transition-all duration-150 ease-out ' +
  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50'

/* ─── Variant classes ────────────────────────────────────────────────────── */

/**
 * Per-variant Tailwind class strings.
 * All colors reference design tokens — no hardcoded values.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm ' +
    'hover:bg-primary-hover ' +
    'active:bg-primary-active active:scale-[0.98]',

  secondary:
    'bg-secondary text-secondary-foreground border border-border ' +
    'hover:bg-secondary-hover hover:border-border-strong ' +
    'active:bg-secondary-active active:scale-[0.98]',

  outline:
    'border border-border bg-transparent text-foreground ' +
    'hover:bg-muted hover:border-border-strong ' +
    'active:bg-muted active:scale-[0.98]',

  ghost:
    'bg-transparent text-foreground ' + 'hover:bg-muted ' + 'active:bg-muted active:scale-[0.98]',

  soft:
    'bg-primary/10 text-primary ' +
    'hover:bg-primary/20 ' +
    'active:bg-primary/30 active:scale-[0.98]',

  success:
    'bg-success text-success-foreground shadow-sm ' +
    'hover:bg-success-hover ' +
    'active:bg-success-hover active:scale-[0.98]',

  warning:
    'bg-warning text-warning-foreground shadow-sm ' +
    'hover:bg-warning-hover ' +
    'active:bg-warning-hover active:scale-[0.98]',

  danger:
    'bg-danger text-danger-foreground shadow-sm ' +
    'hover:bg-danger-hover ' +
    'active:bg-danger-hover active:scale-[0.98]',

  // Link: no bg, no border, no height/padding — overrides size classes
  link:
    'bg-transparent text-primary ' + 'underline-offset-4 hover:underline ' + 'active:opacity-80',
}

/* ─── Size classes ───────────────────────────────────────────────────────── */

/** Height, horizontal padding, text size, border radius, gap for each size */
const SIZES: Record<ButtonSize, string> = {
  xs: 'h-7  min-w-7  px-2.5 rounded-md   text-xs   gap-1',
  sm: 'h-8  min-w-8  px-3   rounded-md   text-sm   gap-1.5',
  md: 'h-9  min-w-9  px-4   rounded-md   text-sm   gap-2',
  lg: 'h-10 min-w-10 px-5   rounded-lg   text-base gap-2',
  xl: 'h-12 min-w-12 px-6   rounded-lg   text-base gap-2.5',
}

/** Square variant — equal dimensions, no horizontal padding (icon-only) */
const SQUARE_SIZES: Record<ButtonSize, string> = {
  xs: 'h-7  w-7  p-0 rounded-md',
  sm: 'h-8  w-8  p-0 rounded-md',
  md: 'h-9  w-9  p-0 rounded-md',
  lg: 'h-10 w-10 p-0 rounded-lg',
  xl: 'h-12 w-12 p-0 rounded-lg',
}

/* ─── Exported function ──────────────────────────────────────────────────── */

/**
 * buttonVariants — compose the complete class string for a button element.
 *
 * Tailwind-merge (via `cn`) resolves any class conflicts safely, so you can
 * pass a `className` override and it will win over defaults without duplication.
 *
 * @example
 * // Inside a component
 * <button className={buttonVariants({ variant: 'outline', size: 'lg' })}>
 *   Click me
 * </button>
 *
 * @example
 * // With className override
 * buttonVariants({ variant: 'ghost', size: 'sm', className: 'w-full' })
 */
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  square = false,
  className,
}: ButtonVariantsOptions): string {
  const isLink = variant === 'link'

  return cn(
    BASE,
    VARIANTS[variant],
    // Link variant ignores size classes — it's inline by nature
    isLink ? 'h-auto min-w-0 p-0' : square ? SQUARE_SIZES[size] : SIZES[size],
    !isLink && fullWidth && 'w-full',
    className
  )
}
