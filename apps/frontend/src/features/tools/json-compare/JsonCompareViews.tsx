import { useEffect, useId, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import type { DiffNode, JsonCompareInput, JsonCompareResult } from './json-compare.config'
import { jsonCompareSchema } from './json-compare.config'

/* ─── Input View ─────────────────────────────────────────────────────────── */

export function JsonCompareInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<JsonCompareInput>) {
  const aId = useId()
  const bId = useId()
  const [jsonA, setJsonA] = useState('')
  const [jsonB, setJsonB] = useState('')

  useEffect(() => {
    const parsed = jsonCompareSchema.safeParse({ jsonA, jsonB })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [jsonA, jsonB, onInputChange])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={aId} className="block text-sm font-medium text-foreground mb-1.5">
            JSON A (Original)
          </label>
          <textarea
            id={aId}
            value={jsonA}
            onChange={(e) => { setJsonA(e.target.value) }}
            disabled={isLoading}
            placeholder={'{\n  "name": "Alice",\n  "age": 30\n}'}
            rows={12}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor={bId} className="block text-sm font-medium text-foreground mb-1.5">
            JSON B (Modified)
          </label>
          <textarea
            id={bId}
            value={jsonB}
            onChange={(e) => { setJsonB(e.target.value) }}
            disabled={isLoading}
            placeholder={'{\n  "name": "Bob",\n  "age": 25\n}'}
            rows={12}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Comparing…' : 'Compare JSON'}
      </button>
    </div>
  )
}

/* ─── Diff Tree Node ─────────────────────────────────────────────────────── */

function DiffTreeNode({ node, depth = 0 }: { node: DiffNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  const bgClass =
    node.type === 'added' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
    : node.type === 'removed' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
    : node.type === 'changed' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
    : ''

  const keyColor =
    node.type === 'added' ? 'text-emerald-700 dark:text-emerald-400'
    : node.type === 'removed' ? 'text-red-700 dark:text-red-400'
    : node.type === 'changed' ? 'text-amber-700 dark:text-amber-400'
    : 'text-foreground'

  const formatValue = (v: unknown): string => {
    if (v === undefined) return '—'
    if (typeof v === 'string') return `"${v}"`
    return JSON.stringify(v)
  }

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => { setExpanded((e) => !e) }}
          className={`flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-lg border text-xs font-mono ${bgClass} hover:opacity-80 transition-opacity`}
          style={{ marginLeft: `${depth * 16}px` }}
        >
          <span className="text-muted-foreground select-none">{expanded ? '▾' : '▸'}</span>
          <span className={`font-semibold ${keyColor}`}>{node.key}</span>
          <span className="text-muted-foreground">{Array.isArray(node.valueA) ? '[]' : '{}'}</span>
          <span className="ml-auto text-muted-foreground text-xs opacity-60">{node.type}</span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child, i) => (
              <DiffTreeNode key={`${child.key}-${i}`} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${bgClass}`}
      style={{ marginLeft: `${depth * 16}px` }}
    >
      <span className={`font-semibold ${keyColor}`}>{node.key}:</span>
      {node.type === 'removed' || node.type === 'changed' ? (
        <span className="line-through text-red-600 dark:text-red-400 opacity-70">
          {formatValue(node.valueA)}
        </span>
      ) : null}
      {node.type === 'added' || node.type === 'changed' ? (
        <span className="text-emerald-600 dark:text-emerald-400">
          {formatValue(node.valueB)}
        </span>
      ) : null}
      {node.type === 'same' ? (
        <span className="text-muted-foreground">{formatValue(node.valueA)}</span>
      ) : null}
      <span className="ml-auto text-muted-foreground opacity-50">{node.type}</span>
    </div>
  )
}

/* ─── Result View ────────────────────────────────────────────────────────── */

export function JsonCompareResultView({
  result,
  onReset,
}: ToolResultRenderProps<JsonCompareResult>) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Identical badge */}
      {result.isIdentical ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 w-fit">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
            The two JSON objects are identical
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Added', value: result.addedCount, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Removed', value: result.removedCount, color: 'text-red-600 dark:text-red-400' },
            { label: 'Changed', value: result.changedCount, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Same', value: result.sameCount, color: 'text-foreground' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
              <dd className={`text-xl font-bold tabular-nums ${color}`}>{value}</dd>
            </div>
          ))}
        </div>
      )}

      {/* Diff tree */}
      {!result.isIdentical && (
        <div className="flex flex-col gap-1 overflow-auto max-h-[500px] rounded-lg border border-border p-2 bg-muted/20">
          {result.diff.map((node, i) => (
            <DiffTreeNode key={`${node.key}-${i}`} node={node} />
          ))}
        </div>
      )}

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
