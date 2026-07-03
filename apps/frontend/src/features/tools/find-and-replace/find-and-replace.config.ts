import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const findAndReplaceSchema = z.object({
  text: z.string(),
  search: z.string(),
  replacement: z.string(),
  caseSensitive: z.boolean(),
  useRegex: z.boolean(),
})

export type FindAndReplaceInput = z.infer<typeof findAndReplaceSchema>
export type FindAndReplaceResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processFindAndReplace(
  input: FindAndReplaceInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): FindAndReplaceResult {
  onProgress(20)

  if (!input.search) {
    onProgress(100)
    return [
      { label: 'Result', value: input.text },
      { label: 'Replacements Made', value: 0 },
    ]
  }

  let count = 0
  let resultText = input.text

  if (input.useRegex) {
    try {
      const flags = input.caseSensitive ? 'g' : 'gi'
      const regex = new RegExp(input.search, flags)
      resultText = input.text.replace(regex, () => { count++; return input.replacement })
    } catch {
      onProgress(100)
      return [
        { label: 'Result', value: input.text },
        { label: 'Replacements Made', value: 0 },
      ]
    }
  } else {
    const search = input.caseSensitive ? input.search : input.search.toLowerCase()
    const text = input.caseSensitive ? input.text : input.text.toLowerCase()
    let idx = text.indexOf(search)
    while (idx !== -1) {
      count++
      idx = text.indexOf(search, idx + search.length)
    }
    const flags = input.caseSensitive ? 'g' : 'gi'
    const escaped = input.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    resultText = input.text.replace(new RegExp(escaped, flags), input.replacement)
  }

  onProgress(100)
  return [
    { label: 'Result', value: resultText },
    { label: 'Replacements Made', value: count },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('find-and-replace')
if (!tool) throw new Error('[ToolEngine] find-and-replace not found in registry')

export const findAndReplaceConfig = defineToolConfig<FindAndReplaceInput, FindAndReplaceResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: findAndReplaceSchema,
    defaultValues: { text: '', search: '', replacement: '', caseSensitive: false, useRegex: false },
  },
  process: processFindAndReplace,
  resultType: 'structured',
  layoutMode: 'split',
})
