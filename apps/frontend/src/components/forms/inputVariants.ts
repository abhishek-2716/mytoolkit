/**
 * Form Design System — Shared Variant Engine
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for all form input styles.
 * Pattern mirrors buttonVariants.ts — extend by adding to the maps below.
 *
 * Visual variants (how the input looks):
 *  default  — bordered on surface bg (most common)
 *  filled   — muted background, no visible border at rest
 *  outlined — heavier 2px border, transparent bg
 *  ghost    — borderless, blends into any background
 *
 * State variants (validation feedback):
 *  success  — green border/ring
 *  warning  — amber border/ring
 *  error    — red border/ring
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

import { cn } from '@/utils'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type InputVariant =
  | 'default'
  | 'filled'
  | 'outlined'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'error'

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Shared error shape — accepts plain strings or RHF FieldError objects */
export type InputError = string | boolean | { message?: string } | null | undefined

export interface InputVariantsOptions {
  variant?: InputVariant
  size?: InputSize
  /** Adds left-padding offset for a left-side icon/prefix */
  hasLeftAddon?: boolean
  /** Adds right-padding offset for a right-side icon/suffix */
  hasRightAddon?: boolean
  className?: string
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

/** Icon pixel size per input size — stays in sync with button system */
export const INPUT_ICON_SIZE: Record<InputSize, number> = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 16,
  xl: 18,
}

/** Absolute left position for left addon (icon / prefix) */
export const INPUT_ICON_LEFT_POS: Record<InputSize, string> = {
  xs: 'left-2',
  sm: 'left-2.5',
  md: 'left-3',
  lg: 'left-3.5',
  xl: 'left-4',
}

/** Absolute right position for right addon (icon / suffix / clear) */
export const INPUT_ICON_RIGHT_POS: Record<InputSize, string> = {
  xs: 'right-2',
  sm: 'right-2.5',
  md: 'right-3',
  lg: 'right-3.5',
  xl: 'right-4',
}

/** Input left padding when a left addon is present */
export const INPUT_LEFT_ADDON_PADDING: Record<InputSize, string> = {
  xs: 'pl-7',
  sm: 'pl-8',
  md: 'pl-9',
  lg: 'pl-10',
  xl: 'pl-11',
}

/** Input right padding when a right addon is present */
export const INPUT_RIGHT_ADDON_PADDING: Record<InputSize, string> = {
  xs: 'pr-7',
  sm: 'pr-8',
  md: 'pr-9',
  lg: 'pr-10',
  xl: 'pr-11',
}

/* ─── Base classes ───────────────────────────────────────────────────────── */

const BASE =
  'w-full font-sans outline-none ' +
  'transition-[border-color,box-shadow,background-color] duration-150 ease-out ' +
  'placeholder:text-muted-foreground ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'read-only:cursor-default read-only:bg-muted/30'

/* ─── Variant classes ────────────────────────────────────────────────────── */

const VARIANTS: Record<InputVariant, string> = {
  default:
    'bg-background border border-border text-foreground ' +
    'hover:border-border-strong ' +
    'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',

  filled:
    'bg-muted border border-transparent text-foreground ' +
    'hover:bg-muted/80 ' +
    'focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',

  outlined:
    'bg-transparent border-2 border-border text-foreground ' +
    'hover:border-border-strong ' +
    'focus:border-primary focus:outline-none',

  ghost:
    'bg-transparent border border-transparent text-foreground ' +
    'hover:bg-muted/40 ' +
    'focus:bg-background focus:border-border focus:outline-none',

  success:
    'bg-background border border-success text-foreground ' +
    'focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none',

  warning:
    'bg-background border border-warning text-foreground ' +
    'focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none',

  error:
    'bg-background border border-danger text-foreground ' +
    'focus:border-danger focus:ring-2 focus:ring-danger/20 focus:outline-none',
}

/* ─── Size classes ───────────────────────────────────────────────────────── */

/** Height + padding + text + radius for each size */
const SIZES: Record<InputSize, string> = {
  xs: 'h-7  px-2.5 text-xs  rounded-md',
  sm: 'h-8  px-3   text-sm  rounded-md',
  md: 'h-9  px-3.5 text-sm  rounded-md',
  lg: 'h-10 px-4   text-base rounded-lg',
  xl: 'h-12 px-5   text-base rounded-lg',
}

/* ─── Label text size ────────────────────────────────────────────────────── */

export const LABEL_SIZE: Record<InputSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base',
}

/* ─── Helper/Error text size ─────────────────────────────────────────────── */

export const HELPER_SIZE: Record<InputSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
}

/* ─── Exported function ──────────────────────────────────────────────────── */

/**
 * inputVariants — compose the complete class string for a form input element.
 *
 * Resolves padding conflicts via tailwind-merge so that addon-specific
 * padding always wins over the size default.
 *
 * @example
 * <input className={inputVariants({ variant: 'filled', size: 'lg', hasLeftAddon: true })} />
 */
export function inputVariants({
  variant = 'default',
  size = 'md',
  hasLeftAddon = false,
  hasRightAddon = false,
  className,
}: InputVariantsOptions): string {
  return cn(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    hasLeftAddon && INPUT_LEFT_ADDON_PADDING[size],
    hasRightAddon && INPUT_RIGHT_ADDON_PADDING[size],
    className
  )
}

/* ─── Utility helpers ────────────────────────────────────────────────────── */

/**
 * Extract a readable message string from the flexible error type.
 *
 * @example
 * // From RHF: errors.email → "Email is required"
 * getErrorMessage(errors.email)
 *
 * @example
 * getErrorMessage("Custom error")  // → "Custom error"
 * getErrorMessage(true)            // → undefined (state only, no message)
 */
export function getErrorMessage(error: InputError): string | undefined {
  if (!error) return undefined
  if (typeof error === 'string') return error
  if (typeof error === 'object' && 'message' in error && error.message) return error.message
  return undefined
}

/** True when any truthy error value is present */
export function hasInputError(error: InputError): boolean {
  return !!error
}

/** Compute the effective InputVariant when error/success states are set */
export function effectiveVariant(
  base: InputVariant = 'default',
  error: InputError,
  success?: boolean
): InputVariant {
  if (hasInputError(error)) return 'error'
  if (success) return 'success'
  return base
}
