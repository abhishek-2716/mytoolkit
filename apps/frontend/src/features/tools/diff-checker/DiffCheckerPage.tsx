import { useEffect, useId, useState } from 'react'
import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { ToolEngineConfig, ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import { defineToolConfig, ToolEngine } from '../engine'

/* ─── Schema ──────────────────────────────────────────────────────────────── */

const diffSchema = z.object({
  original: z.string(),
  modified: z.string(),
})

type DiffInput = z.infer<typeof diffSchema>

/* ─── Diff Types ─────────────────────────────────────────────────────────── */

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

interface DiffResult {
  lines: DiffLine[]
  added: number
  removed: number
  unchanged: number
}

/* ─── LCS-based diff ────────────────────────────────────────────────────── */

function computeDiff(textA: string, textB: string): DiffResult {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const m = linesA.length
  const n = linesB.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1
      } else {
        dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!)
      }
    }
  }

  // Backtrack
  const result: DiffLine[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ type: 'unchanged', text: linesA[i - 1]! })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
      result.unshift({ type: 'added', text: linesB[j - 1]! })
      j--
    } else {
      result.unshift({ type: 'removed', text: linesA[i - 1]! })
      i--
    }
  }

  const added = result.filter((l) => l.type === 'added').length
  const removed = result.filter((l) => l.type === 'removed').length
  const unchanged = result.filter((l) => l.type === 'unchanged').length

  return { lines: result, added, removed, unchanged }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('diff-checker')
if (!tool) throw new Error('[ToolEngine] diff-checker not found in registry')

const diffCheckerConfig = defineToolConfig<DiffInput, DiffResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: diffSchema,
    defaultValues: { original: '', modified: '' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = computeDiff(input.original, input.modified)
    onProgress(100)
    return result
  },
  resultType: 'custom',
  layoutMode: 'stack',
})

/* ─── Input View ─────────────────────────────────────────────────────────── */

const TEXTAREA_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50'

function DiffInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<DiffInput>) {
  const origId = useId()
  const modId = useId()
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')

  useEffect(() => {
    const parsed = diffSchema.safeParse({ original, modified })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [original, modified, onInputChange])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={origId} className="block text-sm font-medium text-foreground mb-1.5">
            Original Text
          </label>
          <textarea
            id={origId}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            disabled={isLoading}
            placeholder="Paste original text here..."
            rows={12}
            className={TEXTAREA_CLASS}
          />
        </div>
        <div>
          <label htmlFor={modId} className="block text-sm font-medium text-foreground mb-1.5">
            Modified Text
          </label>
          <textarea
            id={modId}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            disabled={isLoading}
            placeholder="Paste modified text here..."
            rows={12}
            className={TEXTAREA_CLASS}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || (!original.trim() && !modified.trim())}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Comparing…' : 'Compare'}
      </button>
    </div>
  )
}

/* ─── Result View ────────────────────────────────────────────────────────── */

function DiffResultView({ result, onReset }: ToolResultRenderProps<DiffResult>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 px-3 py-2">
          <p className="text-xs text-foreground-muted">Added</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{result.added}</p>
        </div>
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 px-3 py-2">
          <p className="text-xs text-foreground-muted">Removed</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{result.removed}</p>
        </div>
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-foreground-muted">Unchanged</p>
          <p className="text-lg font-bold text-foreground">{result.unchanged}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-auto max-h-[500px] font-mono text-sm">
        {result.lines.map((line, idx) => (
          <div
            key={idx}
            className={[
              'px-4 py-0.5 whitespace-pre-wrap break-all',
              line.type === 'added' ? 'bg-green-50 dark:bg-green-950/25 text-green-800 dark:text-green-300' : '',
              line.type === 'removed' ? 'bg-red-50 dark:bg-red-950/25 text-red-800 dark:text-red-300 line-through' : '',
              line.type === 'unchanged' ? 'text-foreground-muted' : '',
            ].join(' ')}
          >
            <span className="select-none mr-2 opacity-60">
              {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
            </span>
            {line.text}
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        ← Reset
      </button>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const config: ToolEngineConfig<DiffInput, DiffResult> = {
  ...diffCheckerConfig,
  renderInput: (props) => <DiffInputView {...props} />,
  renderResult: (props) => <DiffResultView {...props} />,
}

export default function DiffCheckerPage() {
  return <ToolEngine config={config} />
}
