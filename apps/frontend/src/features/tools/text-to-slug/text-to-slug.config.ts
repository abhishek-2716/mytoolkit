import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type TextToSlugInput = string
export type TextToSlugResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function generateSlug(text: string): string {
  return text
    .normalize('NFD')                        // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')         // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')           // remove special chars
    .replace(/\s+/g, '-')                    // spaces → hyphens
    .replace(/-+/g, '-')                     // collapse multiple hyphens
    .replace(/^-+|-+$/g, '')                 // trim leading/trailing hyphens
}

function processTextToSlug(
  input: TextToSlugInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): TextToSlugResult {
  onProgress(50)
  const slug = generateSlug(input)
  onProgress(100)
  return slug
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('text-to-slug')

if (!tool) {
  throw new Error('[ToolEngine] text-to-slug not found in registry')
}

export const textToSlugConfig = defineToolConfig<TextToSlugInput, TextToSlugResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder:
      'Type or paste text to convert to a URL-friendly slug...\n\nExample: Hello World! My First Blog Post',
    maxLength: 10_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text to slugify.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processTextToSlug,

  resultType: 'text',
  layoutMode: 'split',
})
