import { useCallback, useRef } from 'react'

import { getAdapter } from '../adapters/index'
import { useToolStoreContext } from '../store/ToolStoreContext'
import type { ToolEngineConfig } from '../types/tool-config.types'
import { normalizeError } from '../types/tool-error.types'
import { createLifecyclePayload } from '../types/tool-lifecycle.types'

/**
 * useToolActions
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Provides all user-triggerable actions:
 *  - setInput    → updates input, transitions to 'input-ready'
 *  - process     → runs the full state machine (validate → process → result)
 *  - reset       → clears all state, back to 'idle'
 *  - cancel      → aborts active processing, back to 'input-ready'
 *  - retry       → calls process() again with the existing input
 *
 * Each action:
 *  1. Guards against invalid state transitions
 *  2. Updates the store
 *  3. Fires lifecycle events
 *  4. Does NOT throw — errors go into the store
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function useToolActions<TInput = unknown, TResult = unknown>(
  config: ToolEngineConfig<TInput, TResult>
) {
  const useStore = useToolStoreContext<TInput, TResult>()
  // Hold the start time for duration calculation in lifecycle events
  const startTimeRef = useRef<number>(0)

  /* ── setInput ──────────────────────────────────────────────────────────── */

  const setInput = useCallback(
    (input: TInput | null) => {
      useStore.getState().setInput(input)
    },
    [useStore]
  )

  /* ── process ───────────────────────────────────────────────────────────── */

  const process = useCallback(async () => {
    const store = useStore.getState()
    const { input, status } = store

    // Guard: only proceed from 'input-ready'
    if (status !== 'input-ready' || input === null) return

    const toolId = config.tool.id
    const adapter = getAdapter(config.processingMode ?? 'browser')
    const abortController = new AbortController()

    startTimeRef.current = performance.now()

    // Fire onStart lifecycle
    config.lifecycle?.onStart?.(createLifecyclePayload<TInput, TResult>(toolId, { input }))

    // Phase 1: Validating
    store.setStatus('validating')
    store.startProcessing(abortController)

    config.lifecycle?.onValidate?.(
      createLifecyclePayload<TInput, TResult>(toolId, { input })
    )

    try {
      // Phase 2–4: Delegate to adapter (handles uploading → processing transitions)
      const result = await adapter.execute<TInput, TResult>(
        config.process,
        input,
        abortController.signal,
        {
          onStatusChange: (s) => {
            useStore.getState().setStatus(s)
            if (s === 'uploading') {
              config.lifecycle?.onUpload?.(
                createLifecyclePayload<TInput, TResult>(toolId, { input })
              )
            }
            if (s === 'processing') {
              config.lifecycle?.onProcessing?.(
                createLifecyclePayload<TInput, TResult>(toolId, { input })
              )
            }
          },
          onProgress: (percent) => { useStore.getState().setProgress(percent); },
        }
      )

      const durationMs = Math.round(performance.now() - startTimeRef.current)

      // Phase 5: Success
      useStore.getState().setResult(result)

      config.lifecycle?.onSuccess?.(
        createLifecyclePayload<TInput, TResult>(toolId, { input, result, durationMs })
      )
    } catch (thrown) {
      const durationMs = Math.round(performance.now() - startTimeRef.current)
      const error = normalizeError(thrown)

      // Cancelled errors → silent reset (not an error state)
      if (error.code === 'cancelled') {
        // cancel() already handled store state via AbortController
        config.lifecycle?.onCancel?.(
          createLifecyclePayload<TInput, TResult>(toolId, { input, durationMs })
        )
        return
      }

      useStore.getState().setError(error)

      config.lifecycle?.onError?.(
        createLifecyclePayload<TInput, TResult>(toolId, { input, error, durationMs })
      )
    }
  }, [config, useStore])

  /* ── reset ─────────────────────────────────────────────────────────────── */

  const reset = useCallback(() => {
    useStore.getState().reset()
    config.lifecycle?.onReset?.(
      createLifecyclePayload(config.tool.id)
    )
  }, [config, useStore])

  /* ── cancel ────────────────────────────────────────────────────────────── */

  const cancel = useCallback(() => {
    useStore.getState().cancel()
    config.lifecycle?.onCancel?.(
      createLifecyclePayload(config.tool.id)
    )
  }, [config, useStore])

  /* ── retry ─────────────────────────────────────────────────────────────── */

  const retry = useCallback(async () => {
    const { input } = useStore.getState()
    if (!input) return
    // Transition back to 'input-ready' so process() guard passes
    useStore.getState().setStatus('input-ready')
    await process()
  }, [useStore, process])

  return { setInput, process, reset, cancel, retry }
}
