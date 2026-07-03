import { cn } from '@/utils'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'premium'

export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  className?: string
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:   'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline:   'border border-border text-foreground bg-transparent',
  success:   'bg-success/15 text-success border border-success/25',
  warning:   'bg-warning/15 text-warning border border-warning/25',
  error:     'bg-danger/15 text-danger border border-danger/25',
  info:      'bg-primary/10 text-primary border border-primary/20',
  premium:   'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 leading-none',
  md: 'text-xs px-2 py-0.5 leading-none',
}

/**
 * Badge
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Small label used to convey status, category, or count.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="premium" size="sm">PRO</Badge>
 * <Badge variant="info">New</Badge>
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Badge({ variant = 'default', size = 'md', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
    >
      {children}
    </span>
  )
}
