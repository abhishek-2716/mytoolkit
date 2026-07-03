import { cn } from '@/utils'

interface EmptyStateProps {
  /** Icon or illustration. Lucide icon or any ReactNode. */
  icon?: React.ReactNode
  /** Main heading text. */
  title: string
  /** Supporting description. */
  description?: string
  /** Primary CTA. Render a Button or LinkButton here. */
  action?: React.ReactNode
  /** Secondary CTA or extra content below the action. */
  footer?: React.ReactNode
  className?: string
}

/**
 * EmptyState
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Generic zero-state component. Used when a list, table, or section has
 * no content to show.
 *
 * @example
 * <EmptyState
 *   icon={<FileText className="w-8 h-8" />}
 *   title="No documents yet"
 *   description="Upload your first PDF to get started."
 *   action={<Button leftIcon={Upload}>Upload PDF</Button>}
 * />
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  footer,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
      {footer && <div className="mt-1 text-xs text-muted-foreground">{footer}</div>}
    </div>
  )
}
