import type { ReactNode } from 'react'

import { DefaultErrorFallback, type ErrorFallbackProps } from '@/components/layout'

interface ErrorLayoutProps {
  error?: Error
  onReset?: () => void
  /** Custom children — replaces the default error fallback */
  children?: ReactNode
}

/**
 * ErrorLayout — safe, minimal layout for use as an error boundary fallback.
 *
 * Intentionally avoids importing other layouts, the router, or any complex
 * component that might itself fail. This layout must be robust enough to
 * render even when most of the application has crashed.
 *
 * Used by: ErrorBoundary default fallback, global error pages
 */
export function ErrorLayout({ error, onReset, children }: ErrorLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Minimal header — no Navbar dependency */}
      <header className="border-b border-border px-6 py-4">
        <a href="/" className="type-label font-bold text-foreground hover:text-primary">
          ToolNest
        </a>
      </header>

      {/* Error content */}
      <main
        id="main-content"
        role="main"
        className="flex flex-1 items-start justify-center outline-none"
        tabIndex={-1}
      >
        {children ?? (
          <DefaultErrorFallback
            error={error ?? new Error('An unknown error occurred')}
            onReset={
              onReset ??
              (() => {
                window.location.reload()
              })
            }
          />
        )}
      </main>
    </div>
  )
}

/**
 * ErrorLayoutFallback — React component adapter for ErrorBoundary render-prop.
 *
 * Usage in routes:
 *   <ErrorBoundary fallback={ErrorLayoutFallback} />
 */
export function ErrorLayoutFallback({ error, onReset }: ErrorFallbackProps) {
  return <ErrorLayout error={error} onReset={onReset} />
}
