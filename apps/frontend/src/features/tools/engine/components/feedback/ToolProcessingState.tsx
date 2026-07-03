interface ToolProcessingStateProps {
  progress: number
  isUploading?: boolean
  label?: string
}

/**
 * ToolProcessingState
 * Shown in the result zone during active processing.
 */
export function ToolProcessingState({
  progress,
  isUploading = false,
  label,
}: ToolProcessingStateProps) {
  const defaultLabel = isUploading ? 'Uploading...' : 'Processing...'
  const displayLabel = label ?? defaultLabel

  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4 p-8 text-center rounded-xl border border-border bg-muted/30"
      role="status"
      aria-label={displayLabel}
      aria-live="polite"
    >
      {/* Spinner */}
      <div className="relative w-12 h-12">
        <svg
          className="w-12 h-12 -rotate-90 text-primary"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted"
          />
          {/* Progress arc */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            className="transition-all duration-300 text-primary"
          />
        </svg>
        {/* Percentage in center */}
        {progress > 0 && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-primary">
            {progress}%
          </span>
        )}
        {progress === 0 && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">{displayLabel}</p>
        {progress > 0 && progress < 100 && (
          <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
        )}
      </div>
    </div>
  )
}
