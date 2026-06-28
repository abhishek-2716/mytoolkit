import type { ReactNode } from 'react'

import { cn } from '@/utils'

import { HELPER_SIZE, type InputSize } from './inputVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface InputWrapperProps {
  /** Inline text/content anchored to the left edge inside the input */
  leftAddon?: ReactNode
  /** Inline text/content anchored to the right edge inside the input */
  rightAddon?: ReactNode
  /**
   * Text prepended to the left of the input in a separated block
   * (uses a border-right divider). E.g., "$", "USD", "https://"
   */
  prefix?: string
  /**
   * Text appended to the right of the input in a separated block.
   * E.g., ".com", "kg", "%"
   */
  suffix?: string
  size?: InputSize
  className?: string
  /** Whether the wrapper's field is currently disabled */
  disabled?: boolean
  /** The input/textarea element */
  children: ReactNode
}

/* ─── Size maps ──────────────────────────────────────────────────────────── */

const PREFIX_SUFFIX_SIZE: Record<InputSize, string> = {
  xs: 'px-2 text-xs',
  sm: 'px-2.5 text-xs',
  md: 'px-3 text-sm',
  lg: 'px-3.5 text-base',
  xl: 'px-4 text-base',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * InputWrapper — a `relative`-positioned container for form inputs.
 *
 * Provides slots for:
 *  - Left / right addons (icons, buttons, spinners) — overlaid via absolute positioning
 *  - Prefix / suffix text blocks — visually separated dividers
 *
 * The `<input>` child must handle its own left/right padding to avoid
 * overlapping the addons — see `inputVariants({ hasLeftAddon, hasRightAddon })`.
 *
 * @example
 * // Decorative left icon
 * <InputWrapper leftAddon={<InputIcon icon={SearchIcon} position="left" />}>
 *   <input ... />
 * </InputWrapper>
 *
 * @example
 * // Currency prefix + unit suffix
 * <InputWrapper prefix="$" suffix="USD" size="lg">
 *   <input type="number" ... />
 * </InputWrapper>
 */
export function InputWrapper({
  leftAddon,
  rightAddon,
  prefix,
  suffix,
  size = 'md',
  disabled = false,
  className,
  children,
}: InputWrapperProps) {
  const hasPrefixSuffix = !!prefix || !!suffix

  if (!leftAddon && !rightAddon && !hasPrefixSuffix) {
    // No addons — render children directly (avoid extra DOM element)
    return <>{children}</>
  }

  const prefixSuffixClasses = cn(
    'inline-flex items-center shrink-0 select-none',
    'border-border bg-muted text-foreground-muted',
    PREFIX_SUFFIX_SIZE[size],
    HELPER_SIZE[size],
    disabled && 'opacity-50'
  )

  return (
    <div className={cn('relative flex w-full', className)}>
      {/* ── Text prefix (external, bordered block) ── */}
      {prefix && (
        <span
          className={cn(prefixSuffixClasses, 'border border-r-0 rounded-l-md')}
          aria-hidden="true"
        >
          {prefix}
        </span>
      )}

      {/* ── Input + absolute addons ── */}
      <div className="relative flex-1">
        {children}
        {leftAddon}
        {rightAddon}
      </div>

      {/* ── Text suffix (external, bordered block) ── */}
      {suffix && (
        <span
          className={cn(prefixSuffixClasses, 'border border-l-0 rounded-r-md')}
          aria-hidden="true"
        >
          {suffix}
        </span>
      )}
    </div>
  )
}
