import { useCallback, useEffect, useId, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import type { CsvToJsonInput, CsvToJsonResult } from './csv-to-json.config'
import { csvToJsonSchema } from './csv-to-json.config'

/* ─── Input View ─────────────────────────────────────────────────────────── */

export function CsvToJsonInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<CsvToJsonInput>) {
  const csvId = useId()
  const [csv, setCsv] = useState('')
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t' | '|'>(',')
  const [hasHeaders, setHasHeaders] = useState(true)
  const [outputMode, setOutputMode] = useState<'array-of-objects' | 'array-of-arrays'>('array-of-objects')

  useEffect(() => {
    const parsed = csvToJsonSchema.safeParse({ csv, delimiter, hasHeaders, outputMode })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [csv, delimiter, hasHeaders, outputMode, onInputChange])

  const delimiterOptions: { value: CsvToJsonInput['delimiter']; label: string }[] = [
    { value: ',', label: 'Comma (,)' },
    { value: ';', label: 'Semicolon (;)' },
    { value: '\t', label: 'Tab (\\t)' },
    { value: '|', label: 'Pipe (|)' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={csvId} className="block text-sm font-medium text-foreground mb-1.5">
          CSV data
        </label>
        <textarea
          id={csvId}
          value={csv}
          onChange={(e) => { setCsv(e.target.value) }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canProcess) {
              e.preventDefault()
              onProcess()
            }
          }}
          disabled={isLoading}
          placeholder={'name,age,city\nAlice,30,NYC\nBob,25,LA'}
          rows={10}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground mt-1">Ctrl+Enter to run</p>
      </div>

      {/* Delimiter */}
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Delimiter</span>
        <div className="flex flex-wrap gap-2">
          {delimiterOptions.map(({ value, label }) => (
            <label key={label} className="cursor-pointer">
              <input
                type="radio"
                name="delimiter"
                value={value}
                checked={delimiter === value}
                onChange={() => { setDelimiter(value) }}
                disabled={isLoading}
                className="sr-only"
              />
              <span
                className={[
                  'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                  delimiter === value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/60',
                ].join(' ')}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasHeaders}
            onChange={(e) => { setHasHeaders(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">First row is headers</span>
        </label>
      </div>

      {/* Output mode */}
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Output format</span>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="outputMode"
              value="array-of-objects"
              checked={outputMode === 'array-of-objects'}
              onChange={() => { setOutputMode('array-of-objects') }}
              disabled={isLoading}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              Array of objects <span className="text-muted-foreground text-xs">[{"{"}"name":"Alice"{"}"}]</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="outputMode"
              value="array-of-arrays"
              checked={outputMode === 'array-of-arrays'}
              onChange={() => { setOutputMode('array-of-arrays') }}
              disabled={isLoading}
              className="text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">
              Array of arrays <span className="text-muted-foreground text-xs">[["name","age"]]</span>
            </span>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Converting…' : 'Convert to JSON'}
      </button>
    </div>
  )
}

/* ─── Result View ────────────────────────────────────────────────────────── */

export function CsvToJsonResultView({
  result,
  onReset,
}: ToolResultRenderProps<CsvToJsonResult>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.json)
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    } catch { /* clipboard denied */ }
  }, [result.json])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Rows', value: result.rowCount },
          { label: 'Columns', value: result.columnCount },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
            <dd className="text-xl font-bold tabular-nums text-primary">{value}</dd>
          </div>
        ))}
      </div>

      {/* Headers */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Headers:</p>
        <div className="flex flex-wrap gap-1.5">
          {result.headers.map((h) => (
            <span key={h} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* JSON output */}
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">JSON</span>
          <button
            type="button"
            onClick={() => { void handleCopy() }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md hover:text-primary transition-colors"
          >
            {copied ? <><Check className="w-3 h-3" aria-hidden="true" />Copied</> : <><Copy className="w-3 h-3" aria-hidden="true" />Copy</>}
          </button>
        </div>
        <pre className="overflow-auto p-4 text-sm font-mono leading-relaxed bg-background max-h-[400px] whitespace-pre select-all">
          {result.json}
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
