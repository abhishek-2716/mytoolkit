import { useToolStoreContext } from '../store/ToolStoreContext'
import type { ToolState, ToolStatusFlags } from '../types/tool-state.types'
import { deriveStatusFlags } from '../types/tool-state.types'

/**
 * useToolState
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Primary state accessor for engine components.
 * Returns the full tool state + all derived boolean flags in one call.
 *
 * Each field is individually subscribed — components only re-render
 * when the specific fields they use change.
 * (Zustand's selector optimization handles this automatically.)
 *
 * @example
 * const { isLoading, result, error, progress } = useToolState()
 */
export function useToolState<TInput = unknown, TResult = unknown>(): ToolState<TInput, TResult> &
  ToolStatusFlags {
  const useStore = useToolStoreContext<TInput, TResult>()

  const status = useStore((s) => s.status)
  const input = useStore((s) => s.input)
  const result = useStore((s) => s.result)
  const error = useStore((s) => s.error)
  const progress = useStore((s) => s.progress)
  const abortController = useStore((s) => s.abortController)

  const flags = deriveStatusFlags(status)

  return {
    status,
    input,
    result,
    error,
    progress,
    abortController,
    ...flags,
  }
}
