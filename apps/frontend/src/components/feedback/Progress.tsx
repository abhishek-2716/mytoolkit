import { cn } from '@/utils'

export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger'
export type ProgressSize = 'sm' | 'md' | 'lg'

const VARIANT_TRACK: Record<ProgressVariant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

const SIZE_MAP: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

interface ProgressProps {
  /** Current value, 0–100. */
  value: number
  /** Visual style. @default 'default' */
  variant?: ProgressVariant
  /** Bar height. @default 'md' */
  size?: ProgressSize
  /** Whether to show the numeric percentage label. */
  showLabel?: boolean
  /** Label text prefix (e.g. "Uploading"). Appended with the percent. */
  label?: string
  /** When true, adds a shimmer animation (used during indeterminate states). */
  indeterminate?: boolean
  className?: string
}

/**
 * Progress
 * ══════════════════════════════════════════════════════════════════════════
 *
 * An accessible progress bar using the native <progress> element semantics
 * implemented via role="progressbar" for full styling control.
 *
 * @example
 * <Progress value={45} label="Uploading" showLabel />
 * <Progress value={0} indeterminate label="Processing…" />
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Progress({
  value,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  indeterminate = false,
  className,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5 text-xs text-muted-foreground">
          {label && <span>{label}</span>}
          {showLabel && <span className="font-medium tabular-nums">{clamped}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        aria-busy={indeterminate}
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          SIZE_MAP[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            VARIANT_TRACK[variant],
            indeterminate && 'animate-pulse w-full opacity-70'
          )}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
