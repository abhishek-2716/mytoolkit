import { useCallback, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolResultRenderProps } from '../engine'
import type { JsonMinifierResult } from './json-minifier.config'

export function JsonMinifierResultView({
  result,
  onReset,
}: ToolResultRenderProps<JsonMinifierResult>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.minified)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch { /* clipboard denied */ }
  }, [result.minified])

  const fmt = (bytes: number): string =>
    bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Original', value: fmt(result.originalSize) },
          { label: 'Minified', value: fmt(result.minifiedSize) },
          { label: 'Saved', value: fmt(result.savedBytes) },
          { label: 'Reduction', value: `${result.savedPercent}%` },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
            <dd className="text-xl font-bold tabular-nums text-primary">{value}</dd>
          </div>
        ))}
      </div>

      {/* Minified output */}
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Minified JSON
          </span>
          <button
            type="button"
            onClick={() => { void handleCopy() }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:text-primary transition-colors"
          >
            {copied ? <><Check className="w-3 h-3" aria-hidden="true" />Copied</> : <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>}
          </button>
        </div>
        <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[400px] whitespace-pre-wrap break-all select-all">
          {result.minified}
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
