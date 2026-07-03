import { FileQuestion } from 'lucide-react'

interface ToolEmptyStateProps {
  message?: string
  hint?: string
}

/**
 * ToolEmptyState
 * Shown in the result zone when no processing has occurred yet.
 */
export function ToolEmptyState({
  message = 'Your result will appear here',
  hint = 'Enter input and click Process to get started',
}: ToolEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-8 text-center rounded-xl border-2 border-dashed border-border/50"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <FileQuestion className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
        {hint && <p className="text-xs text-muted-foreground/60 mt-1">{hint}</p>}
      </div>
    </div>
  )
}
