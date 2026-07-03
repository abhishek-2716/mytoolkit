import { createToolError } from '../types/tool-error.types'
import type { AdapterCallbacks, ProcessFn,ProcessingAdapter } from './adapter.types'

/**
 * Web Worker Processing Adapter
 * ══════════════════════════════════════════════════════════════════════════
 *
 * STUB — Sprint 3+ implementation
 *
 * Will execute the process function in a dedicated Web Worker,
 * keeping the UI thread responsive during heavy computation.
 *
 * Target use cases:
 *  - Client-side image compression (Squoosh WASM)
 *  - Client-side video conversion (FFmpeg.wasm)
 *  - Large JSON file processing
 *  - Any tool with > 100ms compute time
 *
 * Planned implementation:
 *  1. Serialize input via structured clone algorithm
 *  2. Post message to worker thread
 *  3. Receive progress and result via message events
 *  4. Handle cancellation via worker.terminate()
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export const workerAdapter: ProcessingAdapter = {
  type: 'worker',

  execute<TInput, TResult>(
    _processFn: ProcessFn<TInput, TResult>,
    _input: TInput,
    _signal: AbortSignal,
    _callbacks: AdapterCallbacks
  ): Promise<TResult> {
    // TODO: Sprint 3 — Web Worker implementation
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'processing-error',
      'Web Worker execution is not yet supported.',
      {
        details: 'This tool requires a feature that is coming soon.',
        retryable: false,
      }
    )
  },
}
