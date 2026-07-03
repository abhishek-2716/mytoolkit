import { cn } from '@/utils'

export type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card'

interface SkeletonProps {
  variant?: SkeletonVariant
  /** Width — Tailwind width class or inline value. */
  width?: string
  /** Height — Tailwind height class or inline value. */
  height?: string
  className?: string
  /** Number of skeleton rows (text variant only). */
  rows?: number
  /** Aria label for screen readers. */
  label?: string
}

/**
 * Skeleton
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Animated loading placeholder used while content is fetching.
 *
 * Variants:
 *  - text       → line(s) of text, last row is shorter (natural paragraph feel)
 *  - circle     → round avatar / icon placeholder
 *  - rectangle  → generic block (image, video thumbnail, etc.)
 *  - card       → compound card placeholder (header + body lines)
 *
 * Usage:
 *  <Skeleton variant="text" rows={3} />
 *  <Skeleton variant="circle" className="w-12 h-12" />
 *  <Skeleton variant="card" />
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Skeleton({
  variant = 'rectangle',
  width,
  height,
  className,
  rows = 3,
  label = 'Loading…',
}: SkeletonProps) {
  const base = 'animate-pulse bg-muted rounded'

  if (variant === 'text') {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn('space-y-2', className)}
        style={width ? { width } : undefined}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              base,
              'h-4',
              i === rows - 1 && rows > 1 ? 'w-4/5' : 'w-full'
            )}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  if (variant === 'circle') {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn(base, 'rounded-full', className)}
        style={{
          width: width ?? '2.5rem',
          height: height ?? width ?? '2.5rem',
        }}
      >
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn(
          'rounded-xl border border-border bg-card p-4 space-y-4',
          className
        )}
      >
        {/* Header row */}
        <div className="flex items-center gap-3">
          <div className={cn(base, 'rounded-lg w-10 h-10 flex-shrink-0')} />
          <div className="flex-1 space-y-2">
            <div className={cn(base, 'h-4 w-3/5')} />
            <div className={cn(base, 'h-3 w-2/5')} />
          </div>
        </div>
        {/* Body lines */}
        <div className="space-y-2">
          <div className={cn(base, 'h-3 w-full')} />
          <div className={cn(base, 'h-3 w-full')} />
          <div className={cn(base, 'h-3 w-4/5')} />
        </div>
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  // Default: rectangle
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(base, className)}
      style={{
        width: width ?? '100%',
        height: height ?? '1rem',
      }}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}
