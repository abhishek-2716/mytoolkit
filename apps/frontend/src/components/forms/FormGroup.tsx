import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'

import { cn } from '@/utils'

import { ErrorMessage } from './ErrorMessage'
import { FormGroupContext, type FormGroupContextValue } from './formGroupContext'
import { HelperText } from './HelperText'
import {
  effectiveVariant,
  getErrorMessage,
  hasInputError,
  type InputError,
  type InputSize,
  type InputVariant,
} from './inputVariants'
import { Label } from './Label'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface FormGroupProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Label text displayed above the input.
   * Omit to render no label (e.g. when label is rendered separately).
   */
  label?: string
  /** Marks the field as required — shows asterisk on label */
  required?: boolean
  /** Shows "(optional)" on the label (only when not required) */
  optional?: boolean
  /**
   * Validation error. Accepts:
   *  - `string`              — error message text
   *  - `boolean`             — error state without message
   *  - `{ message?: string }` — RHF `FieldError` shape
   */
  error?: InputError
  /**
   * Supplementary hint shown below the field.
   * Hidden when `error` is present — error takes priority.
   */
  helperText?: string
  /** Visual variant forwarded to child inputs via context. @default 'default' */
  variant?: InputVariant
  /** Size forwarded to label, input, and messages via context. @default 'md' */
  size?: InputSize
  /** Propagates disabled state to child inputs via context */
  disabled?: boolean
  /** Stable `id` prefix. Auto-generated via `useId()` when omitted. */
  fieldId?: string
  children: ReactNode
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * FormGroup — the primary composition unit for form fields.
 *
 * Assembles a complete field: Label → Input → HelperText/ErrorMessage.
 * Auto-wires accessibility attributes via React context:
 *  - Label `htmlFor` → input `id`
 *  - Input `aria-describedby` → error/helper id
 *
 * Works with React Hook Form and any form library:
 *
 * @example
 * // Basic field
 * <FormGroup label="Email" required helperText="We'll never share your email.">
 *   <Input type="email" placeholder="you@example.com" />
 * </FormGroup>
 *
 * @example
 * // With RHF validation
 * <FormGroup label="Password" required error={errors.password}>
 *   <PasswordInput {...register('password')} />
 * </FormGroup>
 *
 * @example
 * // Custom layout (no built-in label)
 * <FormGroup error={errors.terms}>
 *   <Checkbox {...register('terms')} />
 *   <Label>I accept the terms</Label>
 * </FormGroup>
 */
export function FormGroup({
  label,
  required = false,
  optional = false,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  disabled = false,
  fieldId: externalFieldId,
  className,
  children,
  ...props
}: FormGroupProps) {
  const generatedId = useId()
  const fieldId = externalFieldId ?? generatedId.replace(/:/g, '')

  const inputId = `${fieldId}-input`
  const errorId = `${fieldId}-error`
  const helperId = `${fieldId}-helper`

  const errorMsg = getErrorMessage(error)
  const isError = hasInputError(error)

  const ctx: FormGroupContextValue = {
    inputId,
    errorId,
    helperId,
    hasError: isError,
    disabled,
    required,
    size,
    variant: effectiveVariant(variant, error),
  }

  return (
    <FormGroupContext.Provider value={ctx}>
      <div className={cn('flex flex-col gap-1.5', className)} {...props}>
        {/* ── Label ── */}
        {label && (
          <Label required={required} optional={optional} size={size}>
            {label}
          </Label>
        )}

        {/* ── Field (input, textarea, etc.) ── */}
        {children}

        {/* ── Messages: error takes priority over helper ── */}
        {isError && errorMsg && <ErrorMessage size={size}>{errorMsg}</ErrorMessage>}
        {!isError && helperText && <HelperText size={size}>{helperText}</HelperText>}
      </div>
    </FormGroupContext.Provider>
  )
}
