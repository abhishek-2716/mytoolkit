import { useId } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react'

import { cn } from '@/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  /** Alert body content. Can be a string or rich JSX. */
  children: React.ReactNode
  /** When true, renders a dismiss button. */
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
  /** Override the default icon. Pass `null` to suppress it. */
  icon?: React.ReactNode | null
}

const VARIANT_STYLES: Record<AlertVariant, { wrapper: string; icon: string; title: string }> = {
  info: {
    wrapper: 'bg-primary/8 border-primary/20 text-foreground',
    icon:    'text-primary',
    title:   'text-primary',
  },
  success: {
    wrapper: 'bg-success/8 border-success/20 text-foreground',
    icon:    'text-success',
    title:   'text-success',
  },
  warning: {
    wrapper: 'bg-warning/8 border-warning/20 text-foreground',
    icon:    'text-warning',
    title:   'text-warning',
  },
  error: {
    wrapper: 'bg-danger/8 border-danger/20 text-foreground',
    icon:    'text-danger',
    title:   'text-danger',
  },
}

const DEFAULT_ICON: Record<AlertVariant, React.FC<{ className?: string }>> = {
  info:    Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   AlertCircle,
}

/**
 * Alert
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Inline feedback message for status, errors, warnings, and tips.
 *
 * @example
 * <Alert variant="success" title="File processed">
 *   Your file was compressed by 68%.
 * </Alert>
 *
 * <Alert variant="error" dismissible onDismiss={() => setError(null)}>
 *   Something went wrong. Please try again.
 * </Alert>
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
  icon,
}: AlertProps) {
  const titleId = useId()
  const descId = useId()
  const styles = VARIANT_STYLES[variant]
  const IconComponent = DEFAULT_ICON[variant]

  const resolvedIcon = icon === null
    ? null
    : icon ?? <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', styles.icon)} aria-hidden="true" />

  return (
    <div
      role="alert"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={descId}
      className={cn(
        'flex gap-3 rounded-xl border p-4',
        styles.wrapper,
        className
      )}
    >
      {resolvedIcon}

      <div className="flex-1 min-w-0 space-y-0.5">
        {title && (
          <p id={titleId} className={cn('text-sm font-semibold leading-snug', styles.title)}>
            {title}
          </p>
        )}
        <div id={descId} className="text-sm text-foreground/80 leading-relaxed">
          {children}
        </div>
      </div>

      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
