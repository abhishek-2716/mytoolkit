/**
 * Tool Error System
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Typed errors replace generic string messages throughout the engine.
 * Each error code drives a distinct UI treatment:
 *
 *  validation-error  → inline field error, no toast
 *  file-type-error   → file zone highlight with allowed types shown
 *  file-size-error   → file zone highlight with size limit shown
 *  file-count-error  → file zone highlight with count limit shown
 *  processing-error  → error state with Retry CTA
 *  network-error     → error state with Retry CTA + offline hint
 *  server-error      → error state with status code
 *  timeout-error     → error state with "Try a smaller file" hint
 *  cancelled         → silent reset (user initiated)
 *  unknown-error     → error state with generic message
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Every possible error scenario in the tool processing pipeline. */
export type ToolErrorCode =
  | 'validation-error'
  | 'file-type-error'
  | 'file-size-error'
  | 'file-count-error'
  | 'processing-error'
  | 'network-error'
  | 'server-error'
  | 'timeout-error'
  | 'cancelled'
  | 'unknown-error'

/**
 * A structured error that carries enough information for the UI
 * to render a helpful, actionable error message.
 *
 * Kept as an interface so it does not extend Error — this avoids
 * @typescript-eslint/no-unsafe-assignment and no-redundant-type-constituents
 * when used as a prop / state type.
 */
export interface ToolError {
  readonly code: ToolErrorCode
  readonly message: string
  readonly details?: string
  readonly field?: string
  readonly statusCode?: number
  readonly retryable: boolean
}

/**
 * Internal class — extends Error so `throw createToolError(...)` satisfies
 * @typescript-eslint/only-throw-error. NOT exported; consumers use ToolError.
 */
class ToolErrorInstance extends Error implements ToolError {
  readonly code: ToolErrorCode
  readonly details?: string
  readonly field?: string
  readonly statusCode?: number
  readonly retryable: boolean

  constructor(
    code: ToolErrorCode,
    message: string,
    options?: {
      details?: string
      field?: string
      statusCode?: number
      retryable?: boolean
    }
  ) {
    super(message)
    this.name = 'ToolError'
    this.code = code
    this.details = options?.details
    this.field = options?.field
    this.statusCode = options?.statusCode
    const defaultRetryable: Record<ToolErrorCode, boolean> = {
      'validation-error': false,
      'file-type-error': false,
      'file-size-error': false,
      'file-count-error': false,
      'processing-error': true,
      'network-error': true,
      'server-error': true,
      'timeout-error': true,
      'cancelled': false,
      'unknown-error': true,
    }
    this.retryable = options?.retryable ?? defaultRetryable[code]
  }
}

/**
 * Factory: create a ToolError with sensible defaults.
 *
 * @example
 * throw createToolError('processing-error', 'Failed to parse the file')
 * throw createToolError('file-size-error', 'File too large', { details: 'Maximum size is 50 MB' })
 */
export function createToolError(
  code: ToolErrorCode,
  message: string,
  options?: {
    details?: string
    field?: string
    statusCode?: number
    retryable?: boolean
  }
): ToolError {
  return new ToolErrorInstance(code, message, options)
}

/**
 * Convert any thrown value into a ToolError.
 * Used in try/catch blocks inside the processing pipeline.
 */
export function normalizeError(thrown: unknown): ToolError {
  // Already a ToolError (duck-type check since ToolError is an interface)
  if (
    typeof thrown === 'object' &&
    thrown !== null &&
    'code' in thrown &&
    'retryable' in thrown &&
    (thrown as Record<string, unknown>).name === 'ToolError'
  ) {
    return thrown as ToolError
  }

  // Standard Error instance
  if (thrown instanceof Error) {
    if (thrown.name === 'AbortError') {
      return createToolError('cancelled', 'Processing was cancelled.', { retryable: false })
    }
    return createToolError('processing-error', thrown.message)
  }

  // Unknown
  return createToolError('unknown-error', 'An unexpected error occurred.')
}
