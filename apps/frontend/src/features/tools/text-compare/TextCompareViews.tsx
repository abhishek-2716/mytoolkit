import { useEffect, useId, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import type { DiffLine, TextCompareInput, TextCompareResult } from './text-compare.config'
import { textCompareSchema } from './text-compare.config'

/* ─── Custom Input Renderer ──────────────────────────────────────────────── */

export function TextCompareInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<TextCompareInput>) {
  const textAId = useId()
  const textBId = useId()
  const [textA, setTextA] = useState('')
  const [textB, setTextB] = useState('')
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)

  useEffect(() => {
    const parsed = textCompareSchema.safeParse({ textA, textB, ignoreCase, ignoreWhitespace })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [textA, textB, ignoreCase, ignoreWhitespace, onInputChange])

  return (
    <div className="space-y-4">
      {/* Two-column textarea layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={textAId} className="block text-sm font-medium text-foreground mb-1.5">
            Original text
          </label>
          <textarea
            id={textAId}
            value={textA}
            onChange={(e) => { setTextA(e.target.value) }}
            disabled={isLoading}
            placeholder={'Paste the original text here...'}
            rows={12}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {textA.split('\n').length.toLocaleString()} lines
          </p>
        </div>
        <div>
          <label htmlFor={textBId} className="block text-sm font-medium text-foreground mb-1.5">
            Modified text
          </label>
          <textarea
            id={textBId}
            value={textB}
            onChange={(e) => { setTextB(e.target.value) }}
            disabled={isLoading}
            placeholder={'Paste the modified text here...'}
            rows={12}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {textB.split('\n').length.toLocaleString()} lines
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => { setIgnoreCase(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Ignore case</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => { setIgnoreWhitespace(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Ignore extra whitespace</span>
        </label>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Comparing…' : 'Compare Texts'}
      </button>
    </div>
  )
}

/* ─── Diff Line Component ────────────────────────────────────────────────── */

function DiffLineRow({ line }: { line: DiffLine }) {
  const bgClass =
    line.type === 'added'
      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-400'
      : line.type === 'removed'
        ? 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400'
        : ''

  const prefix =
    line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '

  const textClass =
    line.type === 'added'
      ? 'text-emerald-800 dark:text-emerald-300'
      : line.type === 'removed'
        ? 'text-red-800 dark:text-red-300'
        : 'text-foreground'

  return (
    <div className={`flex text-xs font-mono ${bgClass}`} role="row">
      <span className="w-8 flex-shrink-0 text-center text-muted-foreground py-0.5 select-none border-r border-border/50">
        {line.lineNumberA ?? ''}
      </span>
      <span className="w-8 flex-shrink-0 text-center text-muted-foreground py-0.5 select-none border-r border-border/50">
        {line.lineNumberB ?? ''}
      </span>
      <span className="w-5 flex-shrink-0 text-center py-0.5 select-none">
        {prefix}
      </span>
      <span className={`flex-1 py-0.5 px-2 whitespace-pre-wrap break-all ${textClass}`}>
        {line.content}
      </span>
    </div>
  )
}

/* ─── Custom Result Renderer ─────────────────────────────────────────────── */

export function TextCompareResultView({
  result,
  onReset,
}: ToolResultRenderProps<TextCompareResult>) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"
      role="region"
      aria-label="Diff result"
    >
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Added', value: result.addedCount, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Removed', value: result.removedCount, color: 'text-red-600 dark:text-red-400' },
          { label: 'Unchanged', value: result.unchangedCount, color: 'text-foreground' },
          { label: 'Similarity', value: `${result.similarity}%`, color: 'text-primary' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
            <dd className={`text-xl font-bold tabular-nums ${color}`}>{value.toLocaleString()}</dd>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-400" aria-hidden="true" />
          Added
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-400" aria-hidden="true" />
          Removed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-border" aria-hidden="true" />
          Unchanged
        </span>
      </div>

      {/* Diff table */}
      <div
        className="rounded-lg border border-border overflow-auto max-h-[600px]"
        role="table"
        aria-label="Line-by-line diff"
      >
        <div className="flex text-xs font-medium text-muted-foreground bg-muted border-b border-border" role="row">
          <span className="w-8 flex-shrink-0 text-center py-1 border-r border-border/50">A</span>
          <span className="w-8 flex-shrink-0 text-center py-1 border-r border-border/50">B</span>
          <span className="w-5 flex-shrink-0 text-center py-1 select-none" aria-hidden="true" />
          <span className="flex-1 py-1 px-2">Content</span>
        </div>
        {result.diff.map((line, index) => (
          <DiffLineRow key={index} line={line} />
        ))}
        {result.diff.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            The texts are identical.
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:border-primary/60 hover:text-primary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Compare Again
        </button>
      </div>
    </div>
  )
}
