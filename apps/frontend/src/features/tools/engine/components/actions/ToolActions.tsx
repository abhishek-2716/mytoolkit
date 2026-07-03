import { Play, X } from 'lucide-react'

import { useToolState } from '../../hooks/useToolState'

interface ToolActionsProps {
  onProcess: () => void
  onCancel: () => void
  processLabel?: string
}

/**
 * ToolActions
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The primary action bar below the input zone.
 *  - Process button: triggers the state machine
 *  - Cancel button: shown only during active loading
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolActions({
  onProcess,
  onCancel,
  processLabel = 'Process',
}: ToolActionsProps) {
  const { canProcess, isLoading, canCancel } = useToolState()

  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        type="button"
        onClick={onProcess}
        disabled={!canProcess || isLoading}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label={isLoading ? 'Processing...' : processLabel}
      >
        <Play className="w-4 h-4" aria-hidden="true" />
        {isLoading ? 'Processing...' : processLabel}
      </button>

      {canCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2"
          aria-label="Cancel processing"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          Cancel
        </button>
      )}
    </div>
  )
}
