import type { ChangeEvent, TextareaHTMLAttributes } from 'react'
import { forwardRef, useCallback, useEffect, useId, useRef } from 'react'

import { cn } from '@/utils'

import { useFormGroup } from './formGroupContext'
import {
  effectiveVariant,
  type InputError,
  type InputSize,
  type InputVariant,
} from './inputVariants'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Visual variant. @default 'default' */
  variant?: InputVariant
  /** Size scale. @default 'md' */
  size?: InputSize
  /**
   * Validation error. Accepts string, boolean, or RHF FieldError.
   */
  error?: InputError
  /** Validation success state */
  success?: boolean
  /**
   * When true, the textarea grows vertically as content is typed.
   * The `resize` CSS property is set to `none` to avoid conflicts.
   * Respect `minRows` and `maxRows` for height bounds.
   */
  autoResize?: boolean
  /**
   * Minimum number of visible rows.
   * Maps to `rows` attribute when `autoResize` is false.
   * @default 3
   */
  minRows?: number
  /**
   * Maximum number of rows before a scrollbar appears (autoResize only).
   * Ignored when `autoResize` is false.
   */
  maxRows?: number
  /**
   * Shows a character counter below the textarea.
   * Pair with `maxLength` for a "X / max" display.
   */
  showCount?: boolean
}

/* ─── Row height constants ───────────────────────────────────────────────── */

/** Approximate pixel height per row for each size (font-size × line-height + row spacing) */
const ROW_HEIGHT: Record<InputSize, number> = {
  xs: 18,
  sm: 20,
  md: 20,
  lg: 24,
  xl: 24,
}

const TEXTAREA_PADDING: Record<InputSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
}

/* ─── Size classes override (height → none, add vertical padding) ────────── */

/** Override SIZES: textareas use padding + rows, not fixed height */
const TEXTAREA_SIZES: Record<InputSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs rounded-md',
  sm: 'px-3   py-2   text-sm rounded-md',
  md: 'px-3.5 py-2.5 text-sm rounded-md',
  lg: 'px-4   py-3   text-base rounded-lg',
  xl: 'px-5   py-3.5 text-base rounded-lg',
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * Textarea — a multi-line text input with optional auto-resize.
 *
 * React Hook Form integration:
 * ```tsx
 * <Textarea {...register('bio')} error={errors.bio} showCount maxLength={160} />
 * ```
 *
 * @example
 * // Auto-resizing textarea
 * <Textarea autoResize minRows={3} maxRows={8} placeholder="Write something…" />
 *
 * @example
 * // Fixed 5-row textarea with character counter
 * <Textarea minRows={5} maxLength={500} showCount />
 *
 * @example
 * // Error state
 * <Textarea error="Description is required" />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    variant,
    size,
    error,
    success,
    autoResize = false,
    minRows = 3,
    maxRows,
    showCount = false,
    id,
    'aria-describedby': describedBy,
    value,
    defaultValue,
    onChange,
    className,
    disabled,
    maxLength,
    rows,
    ...props
  },
  forwardedRef
) {
  const ctx = useFormGroup()

  /* ── IDs ── */
  const generatedId = useId()
  const effectiveId = id ?? ctx?.inputId ?? generatedId

  /* ── Merge context ── */
  const effectiveSize = size ?? ctx?.size ?? 'md'
  const effectiveDisabled = disabled ?? ctx?.disabled ?? false

  const effectiveVar = effectiveVariant(
    variant ?? ctx?.variant ?? 'default',
    error ?? (ctx?.hasError ? true : undefined),
    success
  )

  const effectiveDescribedBy =
    describedBy ?? (ctx?.hasError || error ? ctx?.errorId : ctx?.helperId) ?? undefined

  /* ── Auto-resize via ref ── */
  const innerRef = useRef<HTMLTextAreaElement>(null)

  const mergeRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef]
  )

  const adjustHeight = useCallback(() => {
    const el = innerRef.current
    if (!el || !autoResize) return

    el.style.height = 'auto'
    const minH = minRows * ROW_HEIGHT[effectiveSize] + TEXTAREA_PADDING[effectiveSize]
    const contentH = el.scrollHeight
    const maxH = maxRows
      ? maxRows * ROW_HEIGHT[effectiveSize] + TEXTAREA_PADDING[effectiveSize]
      : undefined

    el.style.height = `${Math.max(minH, maxH ? Math.min(contentH, maxH) : contentH)}px`
    el.style.overflowY = maxH && contentH > maxH ? 'auto' : 'hidden'
  }, [autoResize, effectiveSize, maxRows, minRows])

  useEffect(() => {
    adjustHeight()
  }, [adjustHeight, value])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) adjustHeight()
      onChange?.(e)
    },
    [autoResize, adjustHeight, onChange]
  )

  /* ── Height bounds via style ── */
  const rowCount = rows ?? minRows
  const minHeight = autoResize
    ? minRows * ROW_HEIGHT[effectiveSize] + TEXTAREA_PADDING[effectiveSize]
    : undefined

  /* ── Character count ── */
  const charCount =
    typeof value === 'string'
      ? value.length
      : typeof defaultValue === 'string'
        ? defaultValue.length
        : 0

  const textareaEl = (
    <textarea
      ref={mergeRef}
      id={effectiveId}
      rows={autoResize ? undefined : rowCount}
      disabled={effectiveDisabled}
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      aria-invalid={effectiveVar === 'error' ? 'true' : undefined}
      aria-describedby={effectiveDescribedBy}
      style={
        autoResize
          ? { minHeight: minHeight ? `${minHeight}px` : undefined, resize: 'none' }
          : undefined
      }
      className={cn(
        // Use textarea-specific classes (no fixed height)
        'w-full font-sans outline-none ' +
          'transition-[border-color,box-shadow,background-color] duration-150 ease-out ' +
          'placeholder:text-muted-foreground ' +
          'disabled:cursor-not-allowed disabled:opacity-50 ' +
          'read-only:cursor-default read-only:bg-muted/30',
        // Variant (same as input) but without height class
        TEXTAREA_SIZES[effectiveSize],
        // Border/focus colors from inputVariants (reuse via variant-only map)
        effectiveVar === 'default' &&
          'bg-background border border-border text-foreground hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
        effectiveVar === 'filled' &&
          'bg-muted border border-transparent text-foreground hover:bg-muted/80 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
        effectiveVar === 'outlined' &&
          'bg-transparent border-2 border-border text-foreground hover:border-border-strong focus:border-primary focus:outline-none',
        effectiveVar === 'ghost' &&
          'bg-transparent border border-transparent text-foreground hover:bg-muted/40 focus:bg-background focus:border-border focus:outline-none',
        effectiveVar === 'success' &&
          'bg-background border border-success text-foreground focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none',
        effectiveVar === 'warning' &&
          'bg-background border border-warning text-foreground focus:border-warning focus:ring-2 focus:ring-warning/20 focus:outline-none',
        effectiveVar === 'error' &&
          'bg-background border border-danger text-foreground focus:border-danger focus:ring-2 focus:ring-danger/20 focus:outline-none',
        !autoResize && 'resize-y',
        className
      )}
      {...props}
    />
  )

  if (!showCount) return textareaEl

  return (
    <div className="flex flex-col gap-1">
      {textareaEl}
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

Textarea.displayName = 'Textarea'
