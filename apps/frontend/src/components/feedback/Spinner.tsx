import { cn } from '@/utils'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerVariant = 'ring' | 'dots' | 'pulse'

const SIZE_MAP: Record<SpinnerSize, { box: string; border: string }> = {
  xs:  { box: 'w-3 h-3',   border: 'border-[2px]' },
  sm:  { box: 'w-4 h-4',   border: 'border-2' },
  md:  { box: 'w-6 h-6',   border: 'border-2' },
  lg:  { box: 'w-8 h-8',   border: 'border-[3px]' },
  xl:  { box: 'w-12 h-12', border: 'border-4' },
}

interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  /** Accessible label. Defaults to "Loading". */
  label?: string
  /** Additional class names. */
  className?: string
  /** When false, the spinner is decorative only (aria-hidden). Defaults to true. */
  announceLoading?: boolean
}

/**
 * Spinner
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Accessible loading indicator.
 *
 * Variants:
 *  - ring   → spinning ring (default, smallest bundle)
 *  - dots   → three bouncing dots (softer, mid-content)
 *  - pulse  → pulsing circle (minimal, inline contexts)
 *
 * @example
 * <Spinner size="md" label="Uploading file…" />
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Spinner({
  size = 'md',
  variant = 'ring',
  label = 'Loading',
  className,
  announceLoading = true,
}: SpinnerProps) {
  const { box, border } = SIZE_MAP[size]

  if (variant === 'dots') {
    const dotSize = size === 'xs' || size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
    return (
      <span
        role={announceLoading ? 'status' : undefined}
        aria-label={announceLoading ? label : undefined}
        aria-hidden={!announceLoading}
        className={cn('inline-flex items-center gap-1', className)}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              dotSize,
              'rounded-full bg-current animate-bounce',
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
        {announceLoading && <span className="sr-only">{label}</span>}
      </span>
    )
  }

  if (variant === 'pulse') {
    return (
      <span
        role={announceLoading ? 'status' : undefined}
        aria-label={announceLoading ? label : undefined}
        aria-hidden={!announceLoading}
        className={cn(box, 'rounded-full bg-current animate-pulse inline-block', className)}
      >
        {announceLoading && <span className="sr-only">{label}</span>}
      </span>
    )
  }

  // Default: ring
  return (
    <span
      role={announceLoading ? 'status' : undefined}
      aria-label={announceLoading ? label : undefined}
      aria-hidden={!announceLoading}
      className={cn(
        box,
        border,
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        className
      )}
    >
      {announceLoading && <span className="sr-only">{label}</span>}
    </span>
  )
}
