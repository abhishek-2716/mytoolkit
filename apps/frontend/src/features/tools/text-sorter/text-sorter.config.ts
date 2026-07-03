import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const textSorterSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  order: z.enum(['asc', 'desc']),
  algorithm: z.enum(['alphabetical', 'numeric', 'length']),
  removeDuplicates: z.boolean(),
  ignoreCase: z.boolean(),
})

export type TextSorterInput = z.infer<typeof textSorterSchema>
export type TextSorterResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processTextSorter(
  input: TextSorterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): TextSorterResult {
  onProgress(20)

  let lines = input.text.split('\n')

  if (input.removeDuplicates) {
    const seen = new Set<string>()
    lines = lines.filter((line) => {
      const key = input.ignoreCase ? line.toLowerCase() : line
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  onProgress(60)

  lines.sort((a, b) => {
    let comparison = 0
    switch (input.algorithm) {
      case 'alphabetical': {
        const aKey = input.ignoreCase ? a.toLowerCase() : a
        const bKey = input.ignoreCase ? b.toLowerCase() : b
        comparison = aKey.localeCompare(bKey, undefined, { sensitivity: 'base' })
        break
      }
      case 'numeric': {
        const aNum = parseFloat(a)
        const bNum = parseFloat(b)
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum
        } else {
          comparison = a.localeCompare(b)
        }
        break
      }
      case 'length': {
        comparison = a.length - b.length
        break
      }
    }
    return input.order === 'desc' ? -comparison : comparison
  })

  onProgress(100)
  return lines.join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('text-sorter')

if (!tool) {
  throw new Error('[ToolEngine] text-sorter not found in registry')
}

export const textSorterConfig = defineToolConfig<TextSorterInput, TextSorterResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste lines to sort...\n\nExample:\nBanana\nApple\nCherry\nMango',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text to sort.', {
            retryable: false,
          })
        )
      }
      return validInput({
        text: value,
        order: 'asc',
        algorithm: 'alphabetical',
        removeDuplicates: false,
        ignoreCase: false,
      })
    },
  },

  process: processTextSorter,

  resultType: 'text',
  layoutMode: 'split',
})
