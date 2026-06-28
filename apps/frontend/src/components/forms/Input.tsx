import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useId, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { CheckCircleIcon, Loader2Icon, XIcon } from 'lucide-react'

import { cn } from '@/utils'

import { useFormGroup } from './formGroupContext'
import { InputIcon } from './InputIcon'
import {
  effectiveVariant,
  type InputError,
  type InputSize,
  type InputVariant,
  inputVariants,
} from './inputVariants'
import { InputWrapper } from './InputWrapper'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant. @default 'default' (or inherited from FormGroup) */
  variant?: InputVariant
  /** Size scale. @default 'md' (or inherited from FormGroup) */
  size?: InputSize
  /**
   * Validation error. Accepts string, boolean, or RHF FieldError.
   * Automatically sets variant to 'error' and wires `aria-describedby`.
   */
  error?: InputError
  /**
   * Validation success state.
   * Sets variant to 'success' and shows a check icon on the right.
   */
  success?: boolean
  /** Shows a spinning loader on the right — indicates async validation */
  loading?: boolean
  /** Lucide icon rendered on the left (decorative) */
  leftIcon?: LucideIcon
  /**
   * Lucide icon rendered on the right (decorative).
   * Overridden by `loading`, `clearable`, and `success` states.
   */
  rightIcon?: LucideIcon
  /** Custom element slot on the right (e.g. a toggle button). Highest priority. */
  rightAddon?: ReactNode
  /**
   * Shows an × button when the field has content.
   * The button calls `onClear` when clicked.
   * You must control the value and reset it in `onClear`.
   */
  clearable?: boolean
  /** Called when the × clear button is clicked */
  onClear?: () => void
  /** Text prepended outside-left of the input (e.g. "$", "https://") */
  prefix?: string
  /** Text appended outside-right of the input (e.g. ".com", "kg") */
  suffix?: string
  /**
   * Shows a character counter below the input.
   * Works for both controlled (`value`) and uncontrolled inputs.
   * Pair with `maxLength` for a "X / max" display.
   */
  showCount?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Input — the foundational form control for text entry.
 *
 * All specialised inputs (PasswordInput, SearchInput, NumberInput, etc.)
 * compose this component. Never create ad-hoc `<input>` elements.
 *
 * React Hook Form integration:
 * ```tsx
 * <Input {...register('email')} error={errors.email} />
 * ```
 *
 * @example
 * // Default
 * <Input placeholder="Enter your name" />
 *
 * @example
 * // With left icon and validation error
 * <Input leftIcon={MailIcon} error="Email is required" placeholder="Email" />
 *
 * @example
 * // Filled variant, large size, clearable
 * <Input variant="filled" size="lg" clearable onClear={() => setValue('q', '')} value={watch('q')} />
 *
 * @example
 * // With RHF and FormGroup
 * <FormGroup label="Username" error={errors.username}>
 *   <Input {...register('username')} />
 * </FormGroup>
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant,
    size,
    error,
    success,
    loading = false,
    leftIcon,
    rightIcon,
    rightAddon,
    clearable = false,
    onClear,
    prefix,
    suffix,
    showCount = false,
    id,
    'aria-describedby': describedBy,
    value,
    defaultValue,
    onChange,
    className,
    disabled,
    type = 'text',
    maxLength,
    ...props
  },
  ref
) {
  const ctx = useFormGroup()

  /* ── IDs ── */
  const generatedId = useId()
  const effectiveId = id ?? ctx?.inputId ?? generatedId

  /* ── Merge context with explicit props ── */
  const effectiveSize = size ?? ctx?.size ?? 'md'
  const effectiveDisabled = disabled ?? ctx?.disabled ?? false

  const effectiveVar = effectiveVariant(
    variant ?? ctx?.variant ?? 'default',
    error ?? (ctx?.hasError ? true : undefined),
    success
  )

  /* ── aria-describedby ── */
  const effectiveDescribedBy =
    describedBy ?? (ctx?.hasError || error ? ctx?.errorId : ctx?.helperId) ?? undefined

  /* ── Character count ── */
  const [internalCount, setInternalCount] = useState<number>(() => {
    if (typeof defaultValue === 'string') return defaultValue.length
    if (typeof defaultValue === 'number') return String(defaultValue).length
    return 0
  })
  const charCount =
    typeof value === 'string'
      ? value.length
      : typeof value === 'number'
        ? String(value).length
        : internalCount

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalCount(e.target.value.length)
      onChange?.(e)
    },
    [onChange, value]
  )

  /* ── Right slot priority: rightAddon > loading > clearable > success > rightIcon ── */
  const hasClearButton = clearable && charCount > 0 && !effectiveDisabled && !loading
  const hasSuccessIcon = success && !loading && !hasClearButton && !rightAddon

  const rightSlot: ReactNode =
    rightAddon ??
    (loading ? (
      <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none text-foreground-muted">
        <Loader2Icon size={14} strokeWidth={2} className="animate-spin" aria-hidden="true" />
      </span>
    ) : hasClearButton ? (
      <InputIcon
        icon={XIcon}
        position="right"
        size={effectiveSize}
        interactive
        onClick={onClear}
        aria-label="Clear input"
      />
    ) : hasSuccessIcon ? (
      <span className="absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none text-success">
        <CheckCircleIcon size={14} strokeWidth={2} aria-hidden="true" />
      </span>
    ) : rightIcon ? (
      <InputIcon icon={rightIcon} position="right" size={effectiveSize} />
    ) : null)

  const leftSlot = leftIcon ? (
    <InputIcon icon={leftIcon} position="left" size={effectiveSize} />
  ) : null

  const inputEl = (
    <input
      ref={ref}
      id={effectiveId}
      type={type}
      disabled={effectiveDisabled}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      aria-invalid={effectiveVar === 'error' ? 'true' : undefined}
      aria-describedby={effectiveDescribedBy}
      className={cn(
        inputVariants({
          variant: effectiveVar,
          size: effectiveSize,
          hasLeftAddon: !!leftSlot || !!prefix,
          hasRightAddon: !!rightSlot || !!suffix,
        }),
        // When prefix/suffix are present, remove the conflicting border-radius
        prefix && 'rounded-l-none',
        suffix && 'rounded-r-none',
        className
      )}
      {...props}
    />
  )

  const wrappedInput = (
    <InputWrapper
      leftAddon={leftSlot}
      rightAddon={rightSlot}
      prefix={prefix}
      suffix={suffix}
      size={effectiveSize}
      disabled={effectiveDisabled}
    >
      {inputEl}
    </InputWrapper>
  )

  if (!showCount) return wrappedInput

  return (
    <div className="flex flex-col gap-1">
      {wrappedInput}
      <div className="flex justify-end">
        <span
          aria-live="polite"
          aria-atomic="true"
          className="text-xs text-foreground-muted tabular-nums"
        >
          {charCount}
          {maxLength ? ` / ${maxLength}` : ''}
        </span>
      </div>
    </div>
  )
})

Input.displayName = 'Input'
