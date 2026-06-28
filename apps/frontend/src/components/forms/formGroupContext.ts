import { createContext, useContext } from 'react'

import type { InputSize, InputVariant } from './inputVariants'

/* ─── Context shape ──────────────────────────────────────────────────────── */

/**
 * Values automatically provided to Label, Input, HelperText, and ErrorMessage
 * when they are rendered inside a `FormGroup`.
 *
 * All values are optional — components fall back gracefully when used
 * outside a FormGroup.
 */
export interface FormGroupContextValue {
  /** The `id` to apply to the input element */
  inputId: string
  /** The `id` of the error message element (for aria-describedby) */
  errorId: string
  /** The `id` of the helper text element (for aria-describedby) */
  helperId: string
  /** Whether an error is currently present */
  hasError: boolean
  /** Whether the field is disabled */
  disabled: boolean
  /** Whether the field is required */
  required: boolean
  /** Size propagated from FormGroup to child components */
  size: InputSize
  /** Variant propagated from FormGroup */
  variant: InputVariant
}

/* ─── Context + hook ─────────────────────────────────────────────────────── */

export const FormGroupContext = createContext<FormGroupContextValue | null>(null)

/**
 * useFormGroup — reads the nearest FormGroup context.
 *
 * Returns `null` when used outside a FormGroup — all consumers must
 * fall back gracefully. Only FormGroup itself should ever provide context.
 */
export function useFormGroup(): FormGroupContextValue | null {
  return useContext(FormGroupContext)
}
