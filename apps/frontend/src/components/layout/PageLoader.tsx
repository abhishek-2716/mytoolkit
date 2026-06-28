/**
 * PageLoader — full-page and inline loading spinners for Suspense fallbacks.
 */

interface LoaderProps {
  /** 'page' fills the screen; 'inline' fills its container; 'section' fills 50vh */
  variant?: 'page' | 'section' | 'inline'
  /** Accessible label read by screen readers */
  label?: string
}

export function PageLoader({ variant = 'page', label = 'Loading…' }: LoaderProps) {
  const wrapperClass =
    variant === 'page'
      ? 'flex min-h-screen items-center justify-center bg-background'
      : variant === 'section'
        ? 'flex min-h-[50vh] items-center justify-center'
        : 'flex items-center justify-center p-8'

  return (
    <div className={wrapperClass} role="status" aria-label={label}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <span className="type-caption text-foreground-muted">{label}</span>
      </div>
    </div>
  )
}
