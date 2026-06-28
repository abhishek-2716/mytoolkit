import { forwardRef } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/utils'

import { ButtonSpinner } from './Button'
import {
  BUTTON_ICON_SIZE,
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
} from './buttonVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface IconButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'disabled' | 'children'
> {
  /** The Lucide icon component to render */
  icon: LucideIcon
  /**
   * Accessible label — REQUIRED.
   * Screen readers announce this when the button is focused.
   * Describe the action, not the icon: "Delete file" not "Trash icon".
   */
  'aria-label': string
  /** Visual intent. @default 'ghost' */
  variant?: ButtonVariant
  /** Size scale. @default 'md' */
  size?: ButtonSize
  /** Shows a spinner and disables the button */
  loading?: boolean
  /** Disables the button */
  disabled?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * IconButton — a square button that contains a single icon.
 *
 * Use when the action is obvious from context AND the icon alone communicates
 * it clearly (Close, Search, Menu). Always provide a descriptive `aria-label`.
 *
 * The `aria-label` prop is required — TypeScript will error without it.
 *
 * @example
 * // Close a dialog
 * <IconButton icon={XIcon} aria-label="Close dialog" />
 *
 * @example
 * // Danger delete action
 * <IconButton icon={TrashIcon} variant="danger" aria-label="Delete file" />
 *
 * @example
 * // Small compact version
 * <IconButton icon={SettingsIcon} size="sm" variant="outline" aria-label="Open settings" />
 *
 * @example
 * // Loading state while deleting
 * <IconButton icon={TrashIcon} loading aria-label="Deleting…" />
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon: Icon,
    'aria-label': ariaLabel,
    variant = 'ghost',
    size = 'md',
    loading = false,
    disabled = false,
    className,
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
      aria-label={ariaLabel}
      className={buttonVariants({ variant, size, square: true, className })}
      {...props}
    >
      {loading ? (
        <ButtonSpinner size={iconSize} />
      ) : (
        <Icon size={iconSize} strokeWidth={1.75} aria-hidden="true" className={cn('shrink-0')} />
      )}
    </button>
  )
})

IconButton.displayName = 'IconButton'
