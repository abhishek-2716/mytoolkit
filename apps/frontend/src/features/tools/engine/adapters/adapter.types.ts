import type { ToolError } from '../types/tool-error.types'
import type { ToolStatus } from '../types/tool-state.types'

/**
 * Processing Adapter Interface
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The adapter pattern decouples the tool engine from the execution context.
 *
 * Architecture:
 *
 *   Tool Config (process fn)
 *        ↓
 *   Tool Engine
 *        ↓
 *   Processing Adapter
 *        ├── BrowserAdapter   → main thread, sync/async
 *        ├── ServerAdapter    → API call via axios
 *        └── WorkerAdapter    → Web Worker (future)
 *
 * Adding a new execution context = adding a new adapter.
 * Existing tools never change.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * The raw process function signature every tool must satisfy.
 * This must be pure — no DOM, no React, no closures over component scope.
 * Web Worker compatibility requires serializability.
 */
export type ProcessFn<TInput, TResult> = (
  input: TInput,
  signal: AbortSignal,
  onProgress: (percent: number) => void
) => TResult | Promise<TResult>

/**
 * Callbacks the engine provides to the adapter.
 * The adapter calls these to synchronize engine state.
 */
export interface AdapterCallbacks {
  /**
   * Called when the execution phase changes.
   * The adapter drives the 'uploading' → 'processing' transition
   * for server tools. Browser tools go directly to 'processing'.
   */
  onStatusChange: (status: ToolStatus) => void

  /**
   * Called with integer 0–100 as processing progresses.
   * The adapter provides this when it has reliable progress information
   * (e.g., file upload via XMLHttpRequest, chunked server processing).
   */
  onProgress: (percent: number) => void
}

/**
 * The adapter contract.
 * Every adapter must implement this interface exactly.
 */
export interface ProcessingAdapter {
  /** Identifier used for logging and debugging. */
  readonly type: 'browser' | 'server' | 'worker'

  /**
   * Execute the processing function.
   *
   * The adapter is responsible for:
   *  - Calling onStatusChange('processing') when processing begins
   *  - Calling onStatusChange('uploading') before upload (server only)
   *  - Calling onProgress() during execution
   *  - Respecting the AbortSignal
   *  - Normalizing thrown errors to ToolError
   *
   * @param processFn - The tool's processing function
   * @param input     - The validated tool input
   * @param signal    - AbortSignal for cancellation
   * @param callbacks - Engine state synchronization callbacks
   */
  execute<TInput, TResult>(
    processFn: ProcessFn<TInput, TResult>,
    input: TInput,
    signal: AbortSignal,
    callbacks: AdapterCallbacks
  ): Promise<TResult>
}

/**
 * Adapter execution error — thrown internally by adapters.
 * Converted to a ToolError before reaching the engine.
 */
export interface AdapterExecutionError {
  isAdapterError: true
  error: ToolError
}

export function isAdapterExecutionError(e: unknown): e is AdapterExecutionError {
  return typeof e === 'object' && e !== null && 'isAdapterError' in e
}
