import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-react'

import type { ToolError } from '../../types/tool-error.types'

interface ToolErrorStateProps {
  error: ToolError
  onRetry?: () => void
  onReset: () => void
}

/**
 * ToolErrorState
 * Shown in the result zone when an error occurs.
 * Provides Retry and Reset actions based on error.retryable.
 */
export function ToolErrorState({ error, onRetry, onReset }: ToolErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4 p-8 text-center rounded-xl border border-destructive/30 bg-destructive/5"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-destructive" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{error.message}</p>
        {error.details && (
          <p className="text-xs text-muted-foreground">{error.details}</p>
        )}
        {error.statusCode && (
          <p className="text-xs text-muted-foreground/60">
            Status: {error.statusCode}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {error.retryable && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Try Again
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Start Over
        </button>
      </div>
    </div>
  )
}
