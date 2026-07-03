/**
 * Tool Lifecycle Events
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Lifecycle hooks fired at each stage of the processing pipeline.
 * Tools can observe these events for custom behavior.
 * Analytics, monitoring, and logging systems will attach here.
 *
 * The engine fires these events internally — tools only need to
 * subscribe to the ones they care about.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
import type { ToolError } from './tool-error.types'
/** Payload passed to lifecycle handlers. */
export interface LifecyclePayload<TInput = unknown, TResult = unknown> {
  /** The tool's slug for logging and analytics. */
  toolId: string

  /** Current input at the time of the event. */
  input?: TInput

  /** Result (only available in onSuccess). */
  result?: TResult

  /** Error (only available in onError). */
  error?: ToolError

  /** Processing duration in milliseconds. */
  durationMs?: number

  /** ISO timestamp of the event. */
  timestamp: string
}

/**
 * All lifecycle handlers a tool can subscribe to.
 * All fields are optional — only subscribe to what you need.
 */
export interface ToolLifecycleHandlers<TInput = unknown, TResult = unknown> {
  /**
   * Fired when the user triggers processing.
   * Before any validation or state transition.
   */
  onStart: (payload: LifecyclePayload<TInput>) => void

  /**
   * Fired when validation begins.
   * Useful for measuring validation duration.
   */
  onValidate: (payload: LifecyclePayload<TInput>) => void

  /**
   * Fired when file upload begins (server-mode tools only).
   */
  onUpload: (payload: LifecyclePayload<TInput>) => void

  /**
   * Fired when processing begins.
   * For server tools: fires after upload completes.
   */
  onProcessing: (payload: LifecyclePayload<TInput>) => void

  /**
   * Fired when processing succeeds.
   * Result is available in the payload.
   */
  onSuccess: (payload: LifecyclePayload<TInput, TResult>) => void

  /**
   * Fired when any error occurs.
   * Error details available in the payload.
   */
  onError: (payload: LifecyclePayload<TInput>) => void

  /**
   * Fired when the user cancels processing.
   */
  onCancel: (payload: LifecyclePayload<TInput>) => void

  /**
   * Fired when the user resets the tool to idle.
   */
  onReset: (payload: LifecyclePayload<TInput>) => void
}

/** Creates a lifecycle payload with the current timestamp. */
export function createLifecyclePayload<TInput, TResult>(
  toolId: string,
  partial?: Partial<Omit<LifecyclePayload<TInput, TResult>, 'toolId' | 'timestamp'>>
): LifecyclePayload<TInput, TResult> {
  return {
    toolId,
    timestamp: new Date().toISOString(),
    ...partial,
  }
}
