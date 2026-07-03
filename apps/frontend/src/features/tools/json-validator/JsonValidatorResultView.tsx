import { useCallback,useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolResultRenderProps } from '../engine'
import { ToolStructuredResult } from '../engine/components/result/ToolStructuredResult'
import type { JsonValidatorResult } from './json-validator.config'

export function JsonValidatorResultView({
  result,
  onReset,
}: ToolResultRenderProps<JsonValidatorResult>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.formatted)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch { /* clipboard denied */ }
  }, [result.formatted])

  return (
    <div className="flex flex-col gap-4">
      {/* Valid badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 w-fit">
        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <span className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
          Valid JSON
        </span>
      </div>

      {/* Stats */}
      <ToolStructuredResult items={result.stats} onReset={onReset} />

      {/* Formatted preview */}
      <div className="flex flex-col gap-0 rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Formatted JSON
          </span>
          <button
            type="button"
            onClick={() => { void handleCopy() }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:text-primary transition-colors"
          >
            {copied ? <><Check className="w-3 h-3" aria-hidden="true" />Copied</> : <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>}
          </button>
        </div>
        <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[400px] whitespace-pre">
          {result.formatted}
        </pre>
        <div className="px-4 pb-3 bg-background border-t border-border pt-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Validate another
          </button>
        </div>
      </div>
    </div>
  )
}
