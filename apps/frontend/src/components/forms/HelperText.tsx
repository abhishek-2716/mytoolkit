import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils'

import { useFormGroup } from './formGroupContext'
import { HELPER_SIZE, type InputSize } from './inputVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface HelperTextProps extends ComponentPropsWithoutRef<'p'> {
  /** Size scale for text. Defaults to FormGroup size or 'md'. */
  size?: InputSize
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * HelperText — supplementary hint shown below a form field.
 *
 * When used inside `FormGroup`, the `id` and `size` are automatically
 * derived from context so that the associated input's `aria-describedby`
 * is wired correctly.
 *
 * Hidden automatically by `FormGroup` when an error message is present
 * (error takes priority).
 *
 * @example
 * <HelperText>Must be at least 8 characters.</HelperText>
 */
export function HelperText({ id, size, className, children, ...props }: HelperTextProps) {
  const ctx = useFormGroup()
  const effectiveId = id ?? ctx?.helperId
  const effectiveSize = size ?? ctx?.size ?? 'md'

  return (
    <p
      id={effectiveId}
      className={cn('text-foreground-muted', HELPER_SIZE[effectiveSize], className)}
      {...props}
    >
      {children}
    </p>
  )
}
