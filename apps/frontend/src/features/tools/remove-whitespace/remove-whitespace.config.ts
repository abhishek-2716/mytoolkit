import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const removeWhitespaceSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  trimLines: z.boolean(),
  collapseSpaces: z.boolean(),
  removeBlankLines: z.boolean(),
  removeAllSpaces: z.boolean(),
})

export type RemoveWhitespaceInput = z.infer<typeof removeWhitespaceSchema>
export type RemoveWhitespaceResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processRemoveWhitespace(
  input: RemoveWhitespaceInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): RemoveWhitespaceResult {
  onProgress(20)

  let lines = input.text.split('\n')

  if (input.trimLines) {
    lines = lines.map((l) => l.trim())
  }

  if (input.collapseSpaces && !input.removeAllSpaces) {
    lines = lines.map((l) => l.replace(/\s+/g, ' '))
  }

  if (input.removeAllSpaces) {
    lines = lines.map((l) => l.replace(/\s/g, ''))
  }

  if (input.removeBlankLines) {
    lines = lines.filter((l) => l.trim().length > 0)
  }

  onProgress(100)
  return lines.join('\n')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('remove-whitespace')

if (!tool) {
  throw new Error('[ToolEngine] remove-whitespace not found in registry')
}

export const removeWhitespaceConfig = defineToolConfig<RemoveWhitespaceInput, RemoveWhitespaceResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder:
      'Paste text with extra whitespace here...\n\nExample:   Hello   World   \n\n   This has  extra  spaces  ',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text.', {
            retryable: false,
          })
        )
      }
      return validInput({
        text: value,
        trimLines: true,
        collapseSpaces: true,
        removeBlankLines: false,
        removeAllSpaces: false,
      })
    },
  },

  process: processRemoveWhitespace,

  resultType: 'text',
  layoutMode: 'split',
})
