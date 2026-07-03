import { normalizeError } from '../types/tool-error.types'
import type { AdapterCallbacks, ProcessFn,ProcessingAdapter } from './adapter.types'

/**
 * Browser Processing Adapter
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Executes the process function in the main JavaScript thread.
 *
 * Use for:
 *  - All text-based tools (word counter, JSON formatter, case converter)
 *  - All client-side generators (UUID, password, QR code)
 *  - Any tool that does not require file upload or heavy computation
 *
 * The adapter:
 *  1. Sets status to 'processing'
 *  2. Calls process() (sync or async — both handled transparently)
 *  3. Returns the result or throws a normalized ToolError
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export const browserAdapter: ProcessingAdapter = {
  type: 'browser',

  async execute<TInput, TResult>(
    processFn: ProcessFn<TInput, TResult>,
    input: TInput,
    signal: AbortSignal,
    callbacks: AdapterCallbacks
  ): Promise<TResult> {
    // Check cancellation before starting
    if (signal.aborted) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw normalizeError(new DOMException('Aborted', 'AbortError'))
    }

    // Signal the engine that processing is active
    callbacks.onStatusChange('processing')
    callbacks.onProgress(0)

    try {
      // Execute the tool's process function
      const result = await Promise.resolve(
        processFn(input, signal, callbacks.onProgress)
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      callbacks.onProgress(100)
      return result
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw normalizeError(error)
    }
  },
}
