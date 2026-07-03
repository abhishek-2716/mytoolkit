import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const removeDuplicatesSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  ignoreCase: z.boolean(),
  trimLines: z.boolean(),
  keepFirst: z.boolean(),
})

export type RemoveDuplicateLinesInput = z.infer<typeof removeDuplicatesSchema>

export interface RemoveDuplicateLinesResult {
  output: string
  originalCount: number
  uniqueCount: number
  removedCount: number
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processRemoveDuplicateLines(
  input: RemoveDuplicateLinesInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): RemoveDuplicateLinesResult {
  onProgress(20)

  const lines = input.text.split('\n')
  const originalCount = lines.length

  onProgress(50)

  const seen = new Set<string>()
  const result: string[] = []

  for (const line of lines) {
    const key = input.ignoreCase
      ? (input.trimLines ? line.trim() : line).toLowerCase()
      : (input.trimLines ? line.trim() : line)

    const displayLine = input.trimLines ? line.trim() : line

    if (!seen.has(key)) {
      seen.add(key)
      result.push(displayLine)
    }
  }

  onProgress(100)

  const uniqueCount = result.length
  return {
    output: result.join('\n'),
    originalCount,
    uniqueCount,
    removedCount: originalCount - uniqueCount,
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('remove-duplicate-lines')

if (!tool) {
  throw new Error('[ToolEngine] remove-duplicate-lines not found in registry')
}

export const removeDuplicateLinesConfig = defineToolConfig<
  RemoveDuplicateLinesInput,
  RemoveDuplicateLinesResult
>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder:
      'Paste your text here — each line will be deduplicated...\n\nExample:\napple\nbanana\napple\ncherry\nbanana',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text.', {
            retryable: false,
          })
        )
      }
      return validInput({ text: value, ignoreCase: false, trimLines: true, keepFirst: true })
    },
  },

  process: processRemoveDuplicateLines,

  resultType: 'custom',
  layoutMode: 'split',
})
