import { createToolError,normalizeError } from '../types/tool-error.types'
import type { AdapterCallbacks, ProcessFn,ProcessingAdapter } from './adapter.types'

/**
 * Server Processing Adapter
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Executes the process function by forwarding input to the backend API.
 *
 * Use for:
 *  - PDF tools (iLovePDF-style)
 *  - Server-side image processing
 *  - AI-powered tools
 *  - Any tool marked processingMode: 'server' in the registry
 *
 * Status flow for this adapter:
 *   → 'uploading'   (during file transfer to server)
 *   → 'processing'  (server is processing the file)
 *
 * NOTE: The process() function for server tools acts as an API caller,
 * not a pure computation function. It receives the typed input and
 * calls the appropriate API endpoint via the ApiClient service.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export const serverAdapter: ProcessingAdapter = {
  type: 'server',

  async execute<TInput, TResult>(
    processFn: ProcessFn<TInput, TResult>,
    input: TInput,
    signal: AbortSignal,
    callbacks: AdapterCallbacks
  ): Promise<TResult> {
    if (signal.aborted) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw normalizeError(new DOMException('Aborted', 'AbortError'))
    }

    // Phase 1: Upload (0–50%)
    callbacks.onStatusChange('uploading')
    callbacks.onProgress(0)

    const uploadProgressTracker = (percent: number) => {
      // Map upload progress (0–100) to overall progress (0–50)
      const mappedPercent = Math.round(percent * 0.5)
      callbacks.onProgress(mappedPercent)
    }

    try {
      // Phase 2: Server processing (50–100%)
      callbacks.onStatusChange('processing')
      callbacks.onProgress(50)

      const result = await Promise.resolve(
        processFn(input, signal, (percent) => {
          // Map server processing progress (0–100) to overall progress (50–100)
          const mappedPercent = 50 + Math.round(percent * 0.5)
          callbacks.onProgress(mappedPercent)
          // Also expose upload tracking while it's set up
          uploadProgressTracker(0)
        })
      )

      callbacks.onProgress(100)
      return result
    } catch (error) {
      // Convert HTTP errors to typed ToolErrors
      const normalized = normalizeError(error)

      // Enhance with HTTP-specific information if available
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { status?: number } }).response?.status === 'number'
      ) {
        const status = (error as { response: { status: number } }).response.status
        if (status === 413) {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw createToolError('file-size-error', 'File too large for the server to process.', {
            details: 'Please try a smaller file.',
            statusCode: 413,
            retryable: false,
          })
        }
        if (status >= 500) {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw createToolError('server-error', 'The server encountered an error.', {
            details: 'Please try again in a moment.',
            statusCode: status,
            retryable: true,
          })
        }
      }

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw normalized
    }
  },
}
