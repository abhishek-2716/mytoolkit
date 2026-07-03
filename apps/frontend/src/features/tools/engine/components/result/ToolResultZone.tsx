import { useToolState } from '../../hooks/useToolState'
import type { ToolEngineConfig } from '../../types/tool-config.types'
import type { FileResult,StructuredResultItem } from '../../types/tool-result.types'
import { ToolEmptyState } from '../feedback/ToolEmptyState'
import { ToolErrorState } from '../feedback/ToolErrorState'
import { ToolProcessingState } from '../feedback/ToolProcessingState'
import { ToolFileResult } from './ToolFileResult'
import { ToolStructuredResult } from './ToolStructuredResult'
import { ToolTextResult } from './ToolTextResult'

interface ToolResultZoneProps<TInput, TResult> {
  config: ToolEngineConfig<TInput, TResult>
  onReset: () => void
  onRetry: () => void
}

/**
 * ToolResultZone
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The orchestrator for the result area.
 * Reads state from the store and renders the correct component:
 *
 *  idle / input-ready  → ToolEmptyState
 *  validating          → ToolProcessingState (indeterminate)
 *  uploading           → ToolProcessingState (upload progress)
 *  processing          → ToolProcessingState (process progress)
 *  error               → ToolErrorState
 *  success             → correct result renderer based on resultType
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolResultZone<TInput, TResult>({
  config,
  onReset,
  onRetry,
}: ToolResultZoneProps<TInput, TResult>) {
  const { status, result, error, progress, isUploading } = useToolState<TInput, TResult>()

  // ── Loading states ───────────────────────────────────────────────────────
  if (status === 'validating' || status === 'uploading' || status === 'processing') {
    return (
      <ToolProcessingState
        progress={progress}
        isUploading={isUploading}
      />
    )
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (status === 'error' && error) {
    return <ToolErrorState error={error} onRetry={onRetry} onReset={onReset} />
  }

  // ── Idle / input-ready ───────────────────────────────────────────────────
  if (status !== 'success' || result === null) {
    return <ToolEmptyState />
  }

  // ── Custom renderer ──────────────────────────────────────────────────────
  if (config.resultType === 'custom' && config.renderResult) {
    return <>{config.renderResult({ result, onReset })}</>
  }

  // ── Built-in renderers ───────────────────────────────────────────────────
  switch (config.resultType) {
    case 'text':
      return (
        <ToolTextResult
          text={result as string}
          onReset={onReset}
          isCode={false}
        />
      )

    case 'code':
    case 'json':
      return (
        <ToolTextResult
          text={result as string}
          onReset={onReset}
          isCode
          language={config.resultType === 'json' ? 'JSON' : undefined}
        />
      )

    case 'file':
      return <ToolFileResult file={result as FileResult} onReset={onReset} />

    case 'structured':
      return (
        <ToolStructuredResult
          items={result as StructuredResultItem[]}
          onReset={onReset}
        />
      )

    case 'markdown':
      // Basic markdown: render as preformatted text until a markdown library is added
      return (
        <ToolTextResult
          text={result as string}
          onReset={onReset}
          isCode={false}
          language="Markdown"
        />
      )

    case 'table':
    case 'image':
    case 'multiple':
      // Future: dedicated renderers for these types
      return (
        <ToolTextResult
          text={JSON.stringify(result, null, 2)}
          onReset={onReset}
          isCode
          language="JSON"
        />
      )

    default:
      return <ToolEmptyState message="Unsupported result type" />
  }
}
