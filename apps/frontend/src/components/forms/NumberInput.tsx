import { forwardRef } from 'react'

import { cn } from '@/utils'

import { Input, type InputProps } from './Input'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Step increment/decrement value. @default 1 */
  step?: number
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * NumberInput — a numeric entry field.
 *
 * Renders a native `type="number"` input. Browser-native spinners are
 * hidden via CSS for a cleaner appearance; the user can still adjust the
 * value using the arrow keys or mouse wheel.
 *
 * For custom +/− button controls, wrap this component with increment/
 * decrement buttons and call `ref.current.stepUp()` / `stepDown()`.
 *
 * @example
 * // Basic number input
 * <NumberInput placeholder="0" min={0} max={100} />
 *
 * @example
 * // With step and RHF
 * <FormGroup label="Quantity">
 *   <NumberInput {...register('quantity', { valueAsNumber: true })} min={1} max={99} />
 * </FormGroup>
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { min, max, step = 1, className, ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type="number"
      min={min}
      max={max}
      step={step}
      inputMode="numeric"
      // Hide native spinners — styles applied globally via CSS
      className={cn(
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
        className
      )}
      {...props}
    />
  )
})

NumberInput.displayName = 'NumberInput'
