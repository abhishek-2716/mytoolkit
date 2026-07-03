import { create } from 'zustand'

import type { ToolError } from '../types/tool-error.types'
import { createToolError } from '../types/tool-error.types'
import type { ToolStatus } from '../types/tool-state.types'

/**
 * Tool Store Factory
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Creates an isolated Zustand store for each tool instance.
 *
 * Design decisions:
 *
 *  1. Factory pattern — not a singleton.
 *     Each tool gets its own store. Navigating between tools creates
 *     a fresh store; there is no shared state between tools.
 *
 *  2. No persistence.
 *     Processing results and errors are transient. Only tool SETTINGS
 *     (if any) are persisted, handled by a separate mechanism.
 *
 *  3. All transitions guarded.
 *     Invalid state transitions are silently ignored. This prevents
 *     race conditions from async operations completing after cancel/reset.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/* ─── Store Shape ────────────────────────────────────────────────────────── */

export interface ToolStoreState<TInput, TResult> {
  status: ToolStatus
  input: TInput | null
  result: TResult | null
  error: ToolError | null
  /** Integer 0–100. Updated during processing and upload. */
  progress: number
  /** Held during active processing for cancellation. */
  abortController: AbortController | null
}

export interface ToolStoreActions<TInput, TResult> {
  /** Update input. Transitions to 'input-ready' or 'idle' automatically. */
  setInput: (input: TInput | null) => void
  /** Clear input and reset to idle. Cancels any in-progress work. */
  clearInput: () => void
  /** Low-level status transition. Prefer specific action methods. */
  setStatus: (status: ToolStatus) => void
  /** Called by the adapter when processing begins. Stores the AbortController. */
  startProcessing: (abortController: AbortController) => void
  /** Update progress bar (0–100). */
  setProgress: (progress: number) => void
  /** Store a successful result and transition to 'success'. */
  setResult: (result: TResult) => void
  /** Store an error and transition to 'error'. */
  setError: (error: ToolError) => void
  /** Full reset — clears all state, cancels any in-progress work. */
  reset: () => void
  /**
   * Cancel active processing without clearing the input.
   * Transitions back to 'input-ready' so the user can retry immediately.
   */
  cancel: () => void
}

export type ToolStore<TInput, TResult> = ToolStoreState<TInput, TResult> &
  ToolStoreActions<TInput, TResult>

/** The hook type returned by createToolStore. */
export type UseToolStore<TInput = unknown, TResult = unknown> = ReturnType<
  typeof createToolStore<TInput, TResult>
>

/* ─── Guard Sets ─────────────────────────────────────────────────────────── */

/** Statuses where input changes are permitted. */
const INPUT_MUTABLE_STATUSES = new Set<ToolStatus>(['idle', 'input-ready', 'success', 'error'])

/** Statuses where cancel is valid. */
const CANCELLABLE_STATUSES = new Set<ToolStatus>(['uploading', 'processing', 'validating'])

/* ─── Factory ────────────────────────────────────────────────────────────── */

/**
 * Create an isolated Zustand store for one tool instance.
 *
 * Returns a Zustand hook — call it like any `useStore` hook in components.
 * The engine mounts this inside a React context so all child components
 * share the same store without prop drilling.
 *
 * @example
 * const useStore = createToolStore<JsonInput, JsonResult>()
 * // Inside a component:
 * const status = useStore((s) => s.status)
 * const reset = useStore((s) => s.reset)
 */
export function createToolStore<TInput = unknown, TResult = unknown>() {
  return create<ToolStore<TInput, TResult>>()((set, get) => ({
    /* ── Initial State ─────────────────────────────────────────────────── */
    status: 'idle',
    input: null,
    result: null,
    error: null,
    progress: 0,
    abortController: null,

    /* ── Actions ───────────────────────────────────────────────────────── */

    setInput(input) {
      const { status, input: currentInput } = get()
      // Block input changes during active processing
      if (!INPUT_MUTABLE_STATUSES.has(status)) return

      // Skip update if input hasn't changed (prevents infinite re-render loops)
      if (input !== null && currentInput !== null) {
        try {
          if (JSON.stringify(input) === JSON.stringify(currentInput)) return
        } catch { /* non-serializable — allow update */ }
      }

      set({
        input,
        status: input !== null ? 'input-ready' : 'idle',
        // Clear stale error when user provides new input
        error: null,
        // Clear stale result when input changes — new input = new result expected
        result: null,
      })
    },

    clearInput() {
      const { abortController } = get()
      abortController?.abort()
      set({
        status: 'idle',
        input: null,
        result: null,
        error: null,
        progress: 0,
        abortController: null,
      })
    },

    setStatus(status) {
      set({ status })
    },

    startProcessing(abortController) {
      set({ abortController, progress: 0, error: null })
    },

    setProgress(progress) {
      set({ progress: Math.min(100, Math.max(0, Math.round(progress))) })
    },

    setResult(result) {
      set({
        status: 'success',
        result,
        error: null,
        progress: 100,
        abortController: null,
      })
    },

    setError(error) {
      set({
        status: 'error',
        error,
        progress: 0,
        abortController: null,
      })
    },

    reset() {
      const { abortController } = get()
      abortController?.abort()
      set({
        status: 'idle',
        input: null,
        result: null,
        error: null,
        progress: 0,
        abortController: null,
      })
    },

    cancel() {
      const { abortController, status } = get()
      if (!CANCELLABLE_STATUSES.has(status)) return

      abortController?.abort()
      const { input } = get()

      set({
        status: input !== null ? 'input-ready' : 'idle',
        progress: 0,
        abortController: null,
        error: createToolError('cancelled', 'Processing was cancelled.', { retryable: false }),
      })
    },
  }))
}
