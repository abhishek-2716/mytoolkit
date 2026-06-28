import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils'

import { useFormGroup } from './formGroupContext'
import { type InputSize, LABEL_SIZE } from './inputVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  /**
   * Shows a red asterisk (*) after the label.
   * Falls back to the `required` value from the parent FormGroup context.
   */
  required?: boolean
  /**
   * Shows a muted "(optional)" badge after the label.
   * Mutually exclusive with `required` — required takes priority.
   */
  optional?: boolean
  /** Size scale for label text. Defaults to FormGroup size or 'md'. */
  size?: InputSize
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Label — accessible form label with required/optional indicators.
 *
 * When used inside `FormGroup`, the `htmlFor` and `size` are automatically
 * derived from context — no manual wiring needed.
 *
 * @example
 * // Standalone
 * <Label htmlFor="email" required>Email address</Label>
 *
 * @example
 * // Inside FormGroup (auto-wired)
 * <FormGroup label="Email" required>
 *   <Input id="email" />
 * </FormGroup>
 */
export function Label({
  required,
  optional,
  size,
  htmlFor,
  className,
  children,
  ...props
}: LabelProps) {
  const ctx = useFormGroup()

  const effectiveSize = size ?? ctx?.size ?? 'md'
  const effectiveFor = htmlFor ?? ctx?.inputId
  const effectiveRequired = required ?? ctx?.required ?? false

  return (
    <label
      htmlFor={effectiveFor}
      className={cn(
        'inline-flex items-center gap-1.5',
        'font-medium text-foreground leading-none',
        LABEL_SIZE[effectiveSize],
        className
      )}
      {...props}
    >
      {children}

      {effectiveRequired && (
        <span aria-hidden="true" className="text-danger font-medium" title="Required">
          *
        </span>
      )}

      {!effectiveRequired && optional && (
        <span className="font-normal text-foreground-muted">(optional)</span>
      )}
    </label>
  )
}
