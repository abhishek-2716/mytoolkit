import type { ComponentPropsWithoutRef } from 'react'
import { AlertCircleIcon } from 'lucide-react'

import { cn } from '@/utils'

import { useFormGroup } from './formGroupContext'
import { HELPER_SIZE, INPUT_ICON_SIZE, type InputSize } from './inputVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ErrorMessageProps extends ComponentPropsWithoutRef<'p'> {
  /** Size scale for text. Defaults to FormGroup size or 'md'. */
  size?: InputSize
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * ErrorMessage — validation error displayed below a form field.
 *
 * Rendered as a live region (`role="alert"`) so screen readers announce
 * it immediately when it appears or changes.
 *
 * When used inside `FormGroup`, the `id` is derived from context so the
 * associated input's `aria-describedby` is wired automatically.
 *
 * @example
 * // Standalone
 * <ErrorMessage>Email address is required.</ErrorMessage>
 *
 * @example
 * // With RHF
 * {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
 */
export function ErrorMessage({ id, size, className, children, ...props }: ErrorMessageProps) {
  const ctx = useFormGroup()
  const effectiveId = id ?? ctx?.errorId
  const effectiveSize = size ?? ctx?.size ?? 'md'
  const iconSize = INPUT_ICON_SIZE[effectiveSize]

  if (!children) return null

  return (
    <p
      id={effectiveId}
      role="alert"
      aria-live="polite"
      className={cn('flex items-center gap-1.5 text-danger', HELPER_SIZE[effectiveSize], className)}
      {...props}
    >
      <AlertCircleIcon size={iconSize} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      <span>{children}</span>
    </p>
  )
}
