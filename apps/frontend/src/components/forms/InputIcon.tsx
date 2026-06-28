import type { LucideIcon } from 'lucide-react'

import { cn } from '@/utils'

import {
  INPUT_ICON_LEFT_POS,
  INPUT_ICON_RIGHT_POS,
  INPUT_ICON_SIZE,
  type InputSize,
} from './inputVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface InputIconProps {
  icon: LucideIcon
  /** Which side of the input to anchor to */
  position: 'left' | 'right'
  /** Inherits the parent input's size for consistent scaling */
  size?: InputSize
  /**
   * When true, renders as a clickable button instead of a decorative element.
   * Requires `aria-label` and `onClick`.
   */
  interactive?: boolean
  onClick?: () => void
  'aria-label'?: string
  className?: string
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * InputIcon — an icon absolutely positioned inside an `InputWrapper`.
 *
 * Two modes:
 *  - Decorative (`interactive=false`): `aria-hidden`, no pointer events
 *  - Interactive (`interactive=true`):  clickable button (`aria-label` required)
 *
 * Always used as a child of `InputWrapper`.
 *
 * @example
 * // Decorative search icon
 * <InputIcon icon={SearchIcon} position="left" size="md" />
 *
 * @example
 * // Clickable clear button
 * <InputIcon
 *   icon={XIcon}
 *   position="right"
 *   size="md"
 *   interactive
 *   onClick={handleClear}
 *   aria-label="Clear input"
 * />
 */
export function InputIcon({
  icon: Icon,
  position,
  size = 'md',
  interactive = false,
  onClick,
  'aria-label': ariaLabel,
  className,
}: InputIconProps) {
  const iconSize = INPUT_ICON_SIZE[size]
  const posClass = position === 'left' ? INPUT_ICON_LEFT_POS[size] : INPUT_ICON_RIGHT_POS[size]

  const sharedClasses = cn(
    'absolute top-1/2 -translate-y-1/2 flex items-center justify-center',
    posClass,
    className
  )

  if (interactive) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className={cn(
          sharedClasses,
          'rounded-sm text-foreground-muted',
          'hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
        )}
      >
        <Icon size={iconSize} strokeWidth={1.75} aria-hidden="true" />
      </button>
    )
  }

  return (
    <span className={cn(sharedClasses, 'pointer-events-none text-foreground-muted')}>
      <Icon size={iconSize} strokeWidth={1.75} aria-hidden="true" />
    </span>
  )
}
