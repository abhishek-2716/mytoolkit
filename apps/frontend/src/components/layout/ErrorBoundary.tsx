import { Component, type ErrorInfo, type ReactNode } from 'react'

import { cn } from '@/utils'
import { appConfig } from '@/config'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ErrorFallbackProps {
  error: Error
  /** Call to unmount/remount the subtree and attempt recovery */
  onReset: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Custom fallback UI.
   * - If a ReactNode: rendered as-is.
   * - If a function: receives `{ error, onReset }` and must return ReactNode.
   */
  fallback?: ReactNode | ((props: ErrorFallbackProps) => ReactNode)
  /**
   * Called after an error is caught.
   * Use to send errors to a monitoring service (Sentry, etc.) in production.
   */
  onError?: (error: Error, info: ErrorInfo) => void
  /** Additional class name for the error container */
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/* ─── Default fallback ───────────────────────────────────────────────────── */

/**
 * DefaultErrorFallback — friendly error screen shown when no custom fallback
 * is provided. Shows the error stack in development; a safe message in production.
 */
function DefaultErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-8 text-center"
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-light"
        aria-hidden="true"
      >
        <svg
          className="h-8 w-8 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Heading */}
      <div className="max-w-md space-y-2">
        <h2 className="type-h3 text-foreground">Something went wrong</h2>
        <p className="type-body-sm text-foreground-muted">
          {appConfig.isProd
            ? 'An unexpected error occurred. Please try again or return to the home page.'
            : error.message}
        </p>
      </div>

      {/* Development diagnostics */}
      {appConfig.isDev && error.stack && (
        <details className="w-full max-w-2xl text-left">
          <summary className="type-label cursor-pointer text-foreground-muted hover:text-foreground">
            Stack trace
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 type-code text-danger">
            {error.stack}
          </pre>
        </details>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className={cn(
            'inline-flex items-center gap-2 rounded-md border border-border px-4 py-2',
            'type-button text-foreground bg-background',
            'hover:bg-muted transition-colors'
          )}
        >
          Try again
        </button>
        <a
          href="/"
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-4 py-2',
            'type-button text-primary-foreground bg-primary',
            'hover:bg-primary-hover transition-colors'
          )}
        >
          Go home
        </a>
      </div>
    </div>
  )
}

/* ─── Error Boundary class component ────────────────────────────────────── */

/**
 * ErrorBoundary — catches JavaScript errors anywhere in the child component
 * tree and renders a fallback UI instead of crashing the whole application.
 *
 * Must be a class component — React does not support error boundaries in
 * function components.
 *
 * @example
 * // With default fallback
 * <ErrorBoundary>
 *   <RiskyComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom render-prop fallback
 * <ErrorBoundary fallback={({ error, onReset }) => <CustomError {...} />}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With error reporting
 * <ErrorBoundary onError={(err, info) => Sentry.captureException(err, { extra: info })}>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Delegate to optional reporter (Sentry, DataDog, etc.)
    this.props.onError?.(error, info)

    // Always log in development so the cause is visible in the console
    if (appConfig.isDev) {
      console.error('[ErrorBoundary] Caught error:', error)
      console.error('[ErrorBoundary] Component stack:', info.componentStack)
    }
  }

  reset(): void {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (!hasError || !error) return children

    if (typeof fallback === 'function') {
      return fallback({ error, onReset: this.reset.bind(this) })
    }

    if (fallback !== undefined) return fallback

    return <DefaultErrorFallback error={error} onReset={this.reset.bind(this)} />
  }
}

export { DefaultErrorFallback }
