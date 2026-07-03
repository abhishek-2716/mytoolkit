import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const jsonCompareSchema = z.object({
  jsonA: z.string().min(1, 'First JSON is required.'),
  jsonB: z.string().min(1, 'Second JSON is required.'),
})

export type JsonCompareInput = z.infer<typeof jsonCompareSchema>

export type DiffNodeType = 'added' | 'removed' | 'changed' | 'same'

export interface DiffNode {
  key: string
  path: string
  type: DiffNodeType
  valueA: unknown
  valueB: unknown
  children?: DiffNode[]
}

export interface JsonCompareResult {
  diff: DiffNode[]
  addedCount: number
  removedCount: number
  changedCount: number
  sameCount: number
  isIdentical: boolean
}

/* ─── Deep Diff Algorithm ────────────────────────────────────────────────── */

function deepDiff(a: unknown, b: unknown, path = '', key = 'root'): DiffNode {
  const fullPath = path ? `${path}.${key}` : key

  if (a === b) {
    return { key, path: fullPath, type: 'same', valueA: a, valueB: b }
  }

  if (
    typeof a === 'object' && a !== null &&
    typeof b === 'object' && b !== null &&
    !Array.isArray(a) && !Array.isArray(b)
  ) {
    const aObj = a as Record<string, unknown>
    const bObj = b as Record<string, unknown>
    const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)])
    const children: DiffNode[] = []

    for (const k of allKeys) {
      if (!(k in aObj)) {
        children.push({ key: k, path: `${fullPath}.${k}`, type: 'added', valueA: undefined, valueB: bObj[k] })
      } else if (!(k in bObj)) {
        children.push({ key: k, path: `${fullPath}.${k}`, type: 'removed', valueA: aObj[k], valueB: undefined })
      } else {
        children.push(deepDiff(aObj[k], bObj[k], fullPath, k))
      }
    }

    const hasChanges = children.some((c) => c.type !== 'same')
    return {
      key,
      path: fullPath,
      type: hasChanges ? 'changed' : 'same',
      valueA: a,
      valueB: b,
      children,
    }
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length)
    const children: DiffNode[] = []

    for (let i = 0; i < maxLen; i++) {
      if (i >= a.length) {
        children.push({ key: String(i), path: `${fullPath}[${i}]`, type: 'added', valueA: undefined, valueB: b[i] })
      } else if (i >= b.length) {
        children.push({ key: String(i), path: `${fullPath}[${i}]`, type: 'removed', valueA: a[i], valueB: undefined })
      } else {
        children.push(deepDiff(a[i], b[i], fullPath, `[${i}]`))
      }
    }

    const hasChanges = children.some((c) => c.type !== 'same')
    return {
      key,
      path: fullPath,
      type: hasChanges ? 'changed' : 'same',
      valueA: a,
      valueB: b,
      children,
    }
  }

  return { key, path: fullPath, type: 'changed', valueA: a, valueB: b }
}

function countNodes(nodes: DiffNode[]): { added: number; removed: number; changed: number; same: number } {
  let added = 0
  let removed = 0
  let changed = 0
  let same = 0

  const visit = (node: DiffNode): void => {
    if (node.children) {
      node.children.forEach(visit)
    } else {
      if (node.type === 'added') added++
      else if (node.type === 'removed') removed++
      else if (node.type === 'changed') changed++
      else same++
    }
  }

  nodes.forEach(visit)
  return { added, removed, changed, same }
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processJsonCompare(
  input: JsonCompareInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): JsonCompareResult {
  onProgress(20)

  let parsedA: unknown
  let parsedB: unknown

  try {
    parsedA = JSON.parse(input.jsonA)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError('validation-error', `JSON A is invalid: ${(e as SyntaxError).message}`, { retryable: false })
  }

  try {
    parsedB = JSON.parse(input.jsonB)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError('validation-error', `JSON B is invalid: ${(e as SyntaxError).message}`, { retryable: false })
  }

  onProgress(60)

  const rootDiff = deepDiff(parsedA, parsedB)
  const diff = rootDiff.children ?? [rootDiff]

  onProgress(90)

  const counts = countNodes(diff)

  onProgress(100)

  return {
    diff,
    addedCount: counts.added,
    removedCount: counts.removed,
    changedCount: counts.changed,
    sameCount: counts.same,
    isIdentical: counts.added === 0 && counts.removed === 0 && counts.changed === 0,
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-compare')

if (!tool) {
  throw new Error('[ToolEngine] json-compare not found in registry')
}

export const jsonCompareConfig = defineToolConfig<JsonCompareInput, JsonCompareResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: jsonCompareSchema,
    defaultValues: { jsonA: '', jsonB: '' },
  },

  process: processJsonCompare,

  resultType: 'custom',
  layoutMode: 'stack',
})
