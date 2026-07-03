import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const textCompareSchema = z.object({
  textA: z.string().min(1, 'Original text is required.'),
  textB: z.string().min(1, 'Modified text is required.'),
  ignoreCase: z.boolean(),
  ignoreWhitespace: z.boolean(),
})

export type TextCompareInput = z.infer<typeof textCompareSchema>

export type DiffLineType = 'same' | 'added' | 'removed'

export interface DiffLine {
  type: DiffLineType
  content: string
  lineNumberA: number | null
  lineNumberB: number | null
}

export interface TextCompareResult {
  diff: DiffLine[]
  addedCount: number
  removedCount: number
  unchangedCount: number
  similarity: number
}

/* ─── LCS-based Line Diff Algorithm ─────────────────────────────────────── */

/**
 * Builds a flat LCS DP table (row-major, size (m+1)*(n+1)).
 * Avoids nested arrays and non-null assertions since noUncheckedIndexedAccess is off.
 */
function buildLcsTable(a: string[], b: string[]): number[] {
  const m = a.length
  const n = b.length
  const cols = n + 1
  const table = new Array<number>((m + 1) * cols).fill(0)

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cur = i * cols + j
      table[cur] =
        a[i - 1] === b[j - 1]
          ? (table[(i - 1) * cols + (j - 1)] ?? 0) + 1
          : Math.max(table[(i - 1) * cols + j] ?? 0, table[i * cols + (j - 1)] ?? 0)
    }
  }
  return table
}

/**
 * Back-tracks the LCS table to produce a DiffLine list.
 * Uses original lines (origA/B) for display, normalised lines (normA/B) for comparison.
 */
function traceDiff(
  normA: string[],
  normB: string[],
  origA: string[],
  origB: string[],
  table: number[]
): DiffLine[] {
  const cols = normB.length + 1
  const raw: DiffLine[] = []
  let i = normA.length
  let j = normB.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normA[i - 1] === normB[j - 1]) {
      raw.push({ type: 'same', content: origA[i - 1] ?? '', lineNumberA: i, lineNumberB: j })
      i--
      j--
    } else if (
      j > 0 &&
      (i === 0 || (table[i * cols + (j - 1)] ?? 0) >= (table[(i - 1) * cols + j] ?? 0))
    ) {
      raw.push({ type: 'added', content: origB[j - 1] ?? '', lineNumberA: null, lineNumberB: j })
      j--
    } else {
      raw.push({ type: 'removed', content: origA[i - 1] ?? '', lineNumberA: i, lineNumberB: null })
      i--
    }
  }

  return raw.reverse()
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processTextCompare(
  input: TextCompareInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): TextCompareResult {
  onProgress(20)

  const normalize = (text: string): string => {
    let t = text
    if (input.ignoreCase) t = t.toLowerCase()
    if (input.ignoreWhitespace) t = t.replace(/[ \t]+/g, ' ').trim()
    return t
  }

  const origA = input.textA.split('\n')
  const origB = input.textB.split('\n')
  const normA = origA.map(normalize)
  const normB = origB.map(normalize)

  onProgress(40)

  let diff: DiffLine[]

  // Guard against O(m*n) blowup for very large inputs
  if (normA.length * normB.length > 2_000_000) {
    const removed: DiffLine[] = origA.map((line, idx) => ({
      type: 'removed' as const,
      content: line,
      lineNumberA: idx + 1,
      lineNumberB: null,
    }))
    const added: DiffLine[] = origB.map((line, idx) => ({
      type: 'added' as const,
      content: line,
      lineNumberA: null,
      lineNumberB: idx + 1,
    }))
    diff = [...removed, ...added]
  } else {
    const table = buildLcsTable(normA, normB)
    onProgress(70)
    diff = traceDiff(normA, normB, origA, origB, table)
  }

  onProgress(90)

  const addedCount = diff.filter((d) => d.type === 'added').length
  const removedCount = diff.filter((d) => d.type === 'removed').length
  const unchangedCount = diff.filter((d) => d.type === 'same').length
  const total = addedCount + removedCount + unchangedCount
  const similarity = total === 0 ? 100 : Math.round((unchangedCount / total) * 100)

  onProgress(100)

  return { diff, addedCount, removedCount, unchangedCount, similarity }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('text-compare')

if (!tool) {
  throw new Error('[ToolEngine] text-compare not found in registry')
}

export const textCompareConfig = defineToolConfig<TextCompareInput, TextCompareResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter text to compare.', {
            retryable: false,
          })
        )
      }
      return validInput({ textA: value, textB: '', ignoreCase: false, ignoreWhitespace: false })
    },
  },

  process: processTextCompare,

  resultType: 'custom',
  layoutMode: 'stack',
})
