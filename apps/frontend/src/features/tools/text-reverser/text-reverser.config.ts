import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type TextReverserInput = string
export type TextReverserResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processTextReverser(
  input: TextReverserInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): TextReverserResult {
  onProgress(50)
  // Reverse character by character (handles multi-line too)
  const reversed = input.split('').reverse().join('')
  onProgress(100)
  return reversed
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('text-reverser')

if (!tool) {
  throw new Error('[ToolEngine] text-reverser not found in registry')
}

export const textReverserConfig = defineToolConfig<TextReverserInput, TextReverserResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder:
      'Type or paste text to reverse...\n\nExample: Hello, World!',
    maxLength: 100_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text to reverse.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processTextReverser,

  resultType: 'text',
  layoutMode: 'split',
})
