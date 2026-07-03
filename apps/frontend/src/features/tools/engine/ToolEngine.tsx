import { useCallback, useMemo } from 'react'

import { ToolActions } from './components/actions/ToolActions'
import { ToolFileInput } from './components/input/ToolFileInput'
import { ToolFormInput } from './components/input/ToolFormInput'
import { ToolTextInput } from './components/input/ToolTextInput'
import { ToolSEOHead } from './components/meta/ToolSEOHead'
import { ToolResultZone } from './components/result/ToolResultZone'
import { ToolBody } from './components/shell/ToolBody'
import { ToolFooter } from './components/shell/ToolFooter'
import { ToolHeader } from './components/shell/ToolHeader'
import { ToolShell } from './components/shell/ToolShell'
import { useToolActions } from './hooks/useToolActions'
import { useToolState } from './hooks/useToolState'
import { ToolStoreProvider } from './store/ToolStoreContext'
import type { ToolEngineConfig } from './types/tool-config.types'
import { inferLayoutMode } from './types/tool-config.types'
import { isFileInput, isFormInput,isTextInput } from './types/tool-input.types'

/* ─────────────────────────────────────────────────────────────────────────── */
/* Inner — rendered inside the store provider                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

function ToolEngineInner<TInput, TResult>({
  config,
}: {
  config: ToolEngineConfig<TInput, TResult>
}) {
  const { setInput, process, reset, cancel, retry } = useToolActions(config)
  const state = useToolState<TInput, TResult>()
  const { isLoading, error, canProcess, status, input, progress } = state
  const layoutMode = useMemo(() => inferLayoutMode(config as ToolEngineConfig), [config])
  const stableOnProcess = useCallback(() => { void process() }, [process])

  /* ── Resolve the input component ─────────────────────────────────────── */
  let inputComponent
  if (config.renderInput) {
    // Custom renderer — pass the full state as render props
    inputComponent = config.renderInput({
      state: { status, input, error, progress },
      onInputChange: setInput,
      onProcess: stableOnProcess,
      canProcess,
      isLoading,
    })
  } else if (isTextInput(config.input)) {
    inputComponent = (
      <div>
        <ToolTextInput
          config={config.input}
          isLoading={isLoading}
          onInputChange={setInput}
          onProcess={stableOnProcess}
          canProcess={canProcess}
          currentError={error}
        />
        <ToolActions
          onProcess={stableOnProcess}
          onCancel={() => { cancel() }}
          processLabel={config.tool.shortTitle}
        />
      </div>
    )
  } else if (isFileInput(config.input)) {
    inputComponent = (
      <div>
        <ToolFileInput
          config={config.input}
          isLoading={isLoading}
          onInputChange={setInput}
          currentError={error}
        />
        <ToolActions
          onProcess={stableOnProcess}
          onCancel={() => { cancel() }}
          processLabel={config.tool.shortTitle}
        />
      </div>
    )
  } else if (isFormInput(config.input)) {
    inputComponent = (
      <ToolFormInput
        config={config.input as Parameters<typeof ToolFormInput>[0]['config']}
        isLoading={isLoading}
        onInputChange={setInput as (input: unknown) => void}
        onProcess={stableOnProcess}
      />
    )
  }

  return (
    <>
      <ToolSEOHead tool={config.tool} />
      <ToolShell layoutMode={layoutMode}>
        <ToolHeader tool={config.tool} />
        <ToolBody
          layoutMode={layoutMode}
          inputSlot={inputComponent}
          resultSlot={
            <ToolResultZone
              config={config}
              onReset={() => { reset() }}
              onRetry={() => { void retry() }}
            />
          }
        />
        <ToolFooter tool={config.tool} />
      </ToolShell>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Public API — wraps Inner with the store provider                            */
/* ─────────────────────────────────────────────────────────────────────────── */

interface ToolEngineProps<TInput, TResult> {
  config: ToolEngineConfig<TInput, TResult>
}

/**
 * ToolEngine
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The top-level component every tool page renders.
 *
 * @example
 * // In a tool page file:
 * import { ToolEngine } from '@features/tools/engine'
 * import { myToolConfig } from './my-tool.config'
 *
 * export default function MyToolPage() {
 *   return <ToolEngine config={myToolConfig} />
 * }
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolEngine<TInput = unknown, TResult = unknown>({
  config,
}: ToolEngineProps<TInput, TResult>) {
  return (
    <ToolStoreProvider>
      <ToolEngineInner config={config} />
    </ToolStoreProvider>
  )
}
