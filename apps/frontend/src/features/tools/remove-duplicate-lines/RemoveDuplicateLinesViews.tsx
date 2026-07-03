import { useCallback, useEffect, useId, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import type {
  RemoveDuplicateLinesInput,
  RemoveDuplicateLinesResult,
} from './remove-duplicate-lines.config'
import { removeDuplicatesSchema } from './remove-duplicate-lines.config'

/* ─── Custom Input Renderer ──────────────────────────────────────────────── */

export function RemoveDuplicateLinesInputView({
  state,
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<RemoveDuplicateLinesInput>) {
  const textId = useId()
  const [rawText, setRawText] = useState('')
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [trimLines, setTrimLines] = useState(true)

  // Sync parsed input to engine
  useEffect(() => {
    const parsed = removeDuplicatesSchema.safeParse({
      text: rawText,
      ignoreCase,
      trimLines,
      keepFirst: true,
    })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [rawText, ignoreCase, trimLines, onInputChange])

  const errorMessage =
    state.error?.code === 'validation-error' ? state.error.message : null

  return (
    <div className="space-y-4">
      {/* Textarea */}
      <div>
        <label htmlFor={textId} className="block text-sm font-medium text-foreground mb-1.5">
          Input text (one item per line)
        </label>
        <textarea
          id={textId}
          value={rawText}
          onChange={(e) => { setRawText(e.target.value) }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canProcess) {
              e.preventDefault()
              onProcess()
            }
          }}
          disabled={isLoading}
          placeholder={'apple\nbanana\napple\ncherry\nbanana'}
          rows={10}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
          aria-describedby={errorMessage ? 'rdl-error' : undefined}
        />
        {errorMessage && (
          <p id="rdl-error" className="text-xs text-destructive mt-1" role="alert">
            {errorMessage}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {rawText.split('\n').length.toLocaleString()} lines · Ctrl+Enter to run
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => { setIgnoreCase(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Ignore case (treat &ldquo;Apple&rdquo; and &ldquo;apple&rdquo; as duplicates)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => { setTrimLines(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Trim whitespace from each line</span>
        </label>
      </div>

      {/* Run button */}
      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Removing duplicates…' : 'Remove Duplicates'}
      </button>
    </div>
  )
}

/* ─── Custom Result Renderer ─────────────────────────────────────────────── */

export function RemoveDuplicateLinesResultView({
  result,
  onReset,
}: ToolResultRenderProps<RemoveDuplicateLinesResult>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.output)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch {
      // clipboard access denied
    }
  }, [result.output])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Original', value: result.originalCount },
          { label: 'Unique', value: result.uniqueCount },
          { label: 'Removed', value: result.removedCount },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
            <dd className="text-2xl font-bold tabular-nums text-primary">{value.toLocaleString()}</dd>
          </div>
        ))}
      </div>

      {/* Output */}
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Result
          </span>
          <button
            type="button"
            onClick={() => { void handleCopy() }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:text-primary transition-colors"
            aria-label={copied ? 'Copied!' : 'Copy result'}
          >
            {copied ? <><Check className="w-3 h-3" aria-hidden="true" />Copied</> : <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>}
          </button>
        </div>
        <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[400px] whitespace-pre-wrap break-words">
          {result.output}
        </pre>
      </div>

      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  )
}
