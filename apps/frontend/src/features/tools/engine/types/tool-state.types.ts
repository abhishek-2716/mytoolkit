import type { ToolError } from './tool-error.types'

/**
 * Tool State Machine — Status & State Types
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Defines the complete lifecycle every tool follows.
 * No tool may invent its own statuses.
 *
 * Transition graph:
 *
 *   idle ──────────────────────────────────────────────────────► idle
 *     │                                                            ▲
 *     ▼ (input provided)                                          │ reset
 *   input-ready ─────────────────────────────────────────────────┘
 *     │                                                            ▲
 *     ▼ (process triggered)                              (input changed)
 *   validating                                                      │
 *     │ pass                                                        │
 *     ├─── browser/worker ──► processing ──► success ──────────────┤
 *     │                           │           │                     │
 *     └─── server ──► uploading ──┘          │ reset               │
 *                         │                  ▼                     │
 *                         │               error ────────────────── ┘
 *                         │ (upload failed)  ▲ (process failed)
 *                         └──────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/**
 * All valid states in the tool processing lifecycle.
 * These states are exhaustive — every tool uses exactly this set.
 */
export type ToolStatus =
  /** No input provided. Initial state and state after reset. */
  | 'idle'

  /** User has provided input that passes basic format checks. */
  | 'input-ready'

  /**
   * Client-side validation is running.
   * For synchronous validation this state is transient (< 1ms).
   * For async validation (e.g., checking file headers) it is observable.
   */
  | 'validating'

  /**
   * File(s) are being uploaded to the server.
   * Only reached by server-mode tools.
   * Browser and worker tools skip this state.
   */
  | 'uploading'

  /**
   * Computation is running.
   * For browser tools: JavaScript is executing.
   * For server tools: server is processing the file.
   * For worker tools: the Web Worker is executing.
   */
  | 'processing'

  /** Processing completed successfully. Result is available. */
  | 'success'

  /**
   * An error occurred at any stage (validation, upload, processing).
   * The error object describes the exact failure mode.
   */
  | 'error'

/** The set of statuses that represent active computation. */
export const LOADING_STATUSES: ReadonlySet<ToolStatus> = new Set([
  'validating',
  'uploading',
  'processing',
])

/** The set of statuses where user input can be modified. */
export const INPUT_EDITABLE_STATUSES: ReadonlySet<ToolStatus> = new Set([
  'idle',
  'input-ready',
  'success',
  'error',
])

/**
 * The complete runtime state for a tool instance.
 *
 * Generic over TInput and TResult so each tool gets full type safety
 * without casting. The engine enforces these types at the config layer.
 */
export interface ToolState<TInput = unknown, TResult = unknown> {
  /** Current position in the state machine. */
  status: ToolStatus

  /** The current input value. null when idle or cleared. */
  input: TInput | null

  /** The last successful result. Persists in 'success' state. */
  result: TResult | null

  /** The current error. null when not in 'error' state. */
  error: ToolError | null

  /**
   * Processing progress as an integer 0–100.
   * 0 = not started, 100 = complete.
   * Updated by adapters that have progress information.
   */
  progress: number

  /** Active AbortController. null when not processing. */
  abortController: AbortController | null
}

/** All computed boolean flags derived from ToolStatus. */
export interface ToolStatusFlags {
  isIdle: boolean
  isInputReady: boolean
  isValidating: boolean
  isUploading: boolean
  isProcessing: boolean
  isSuccess: boolean
  isError: boolean
  /** True during any loading phase (validating | uploading | processing). */
  isLoading: boolean
  /** True only when in 'input-ready' state — processing can be triggered. */
  canProcess: boolean
  /** True in any state except 'idle'. */
  canReset: boolean
  /** True only when actively uploading or processing. */
  canCancel: boolean
}

/** Derives status flags from a ToolStatus value. Pure function. */
export function deriveStatusFlags(status: ToolStatus): ToolStatusFlags {
  return {
    isIdle: status === 'idle',
    isInputReady: status === 'input-ready',
    isValidating: status === 'validating',
    isUploading: status === 'uploading',
    isProcessing: status === 'processing',
    isSuccess: status === 'success',
    isError: status === 'error',
    isLoading: LOADING_STATUSES.has(status),
    canProcess: status === 'input-ready',
    canReset: status !== 'idle',
    canCancel: status === 'uploading' || status === 'processing',
  }
}
