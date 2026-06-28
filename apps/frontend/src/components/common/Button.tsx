import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/utils'

import {
  BUTTON_ICON_SIZE,
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
  type ButtonVariantsOptions,
} from './buttonVariants'

/* ─── Spinner ────────────────────────────────────────────────────────────── */

/**
 * Internal spinning indicator — used by Button and LoadingButton.
 * Inherits `currentColor` so it always matches the button's text color.
 */
export function ButtonSpinner({ size }: { size: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block animate-spin rounded-full',
        'border-2 border-current border-t-transparent',
        'shrink-0'
      )}
      style={{ width: size, height: size }}
    />
  )
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ButtonProps
  extends
    Omit<ComponentPropsWithoutRef<'button'>, 'disabled'>,
    Pick<ButtonVariantsOptions, 'fullWidth'> {
  /** Visual intent. @default 'primary' */
  variant?: ButtonVariant
  /** Size scale. @default 'md' */
  size?: ButtonSize
  /**
   * Shows a spinner and disables interaction.
   * The left icon (if present) is replaced by the spinner.
   */
  loading?: boolean
  /** Disables the button */
  disabled?: boolean
  /** Lucide icon rendered before the label text */
  leftIcon?: LucideIcon
  /** Lucide icon rendered after the label text */
  rightIcon?: LucideIcon
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Button — the foundational interactive control for the ToolNest UI.
 *
 * All other button variants (IconButton, LinkButton, LoadingButton) build
 * on this component. Never create ad-hoc `<button>` elements — always use
 * one of the button system components.
 *
 * Features:
 *  - 9 visual variants, 5 sizes
 *  - Left/right icon slots with automatic size scaling
 *  - Loading state (spinner replaces left icon, prevents re-click)
 *  - Full width option
 *  - Ref forwarding (for third-party library compatibility)
 *  - Complete keyboard + ARIA accessibility
 *
 * @example
 * // Default primary button
 * <Button>Save changes</Button>
 *
 * @example
 * // Large danger button with left icon
 * <Button variant="danger" size="lg" leftIcon={TrashIcon}>
 *   Delete account
 * </Button>
 *
 * @example
 * // Loading state (async action in progress)
 * <Button variant="primary" loading>
 *   Saving…
 * </Button>
 *
 * @example
 * // Full-width ghost button
 * <Button variant="ghost" fullWidth>
 *   Cancel
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading
  const iconSize = BUTTON_ICON_SIZE[size]

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    >
      {/* Left slot: spinner while loading, icon when idle */}
      {loading ? (
        <ButtonSpinner size={iconSize} />
      ) : LeftIcon ? (
        <LeftIcon size={iconSize} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      ) : null}

      {/* Label */}
      {children}

      {/* Right icon — hidden while loading to avoid visual clutter */}
      {!loading && RightIcon && (
        <RightIcon size={iconSize} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      )}
    </button>
  )
})

Button.displayName = 'Button'
