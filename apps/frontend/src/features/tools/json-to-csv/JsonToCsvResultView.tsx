import { useCallback, useState } from 'react'
import { Check, Copy, Download, RotateCcw } from 'lucide-react'

import type { ToolResultRenderProps } from '../engine'
import type { JsonToCsvResult } from './json-to-csv.config'

export function JsonToCsvResultView({
  result,
  onReset,
}: ToolResultRenderProps<JsonToCsvResult>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.csv)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch { /* clipboard denied */ }
  }, [result.csv])

  const handleDownload = useCallback(() => {
    const url = URL.createObjectURL(result.file.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.file.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [result.file])

  const fmt = (bytes: number): string =>
    bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Rows', value: result.rowCount },
          { label: 'Columns', value: result.columnCount },
          { label: 'Size', value: fmt(result.file.sizeBytes) },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
            <dd className="text-xl font-bold tabular-nums text-primary">{value}</dd>
          </div>
        ))}
      </div>

      {/* Columns */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Columns detected:</p>
        <div className="flex flex-wrap gap-1.5">
          {result.columns.map((col) => (
            <span key={col} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* CSV preview */}
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</span>
          <button
            type="button"
            onClick={() => { void handleCopy() }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:text-primary transition-colors"
          >
            {copied ? <><Check className="w-3 h-3" aria-hidden="true" />Copied</> : <><Copy className="w-3 h-3" aria-hidden="true" />Copy CSV</>}
          </button>
        </div>
        <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[300px] whitespace-pre">
          {result.csv.split('\n').slice(0, 20).join('\n')}
          {result.csv.split('\n').length > 20 && '\n…'}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download CSV
        </button>
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
