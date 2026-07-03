import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type JsonMinifierInput = string

export interface JsonMinifierResult {
  minified: string
  originalSize: number
  minifiedSize: number
  savedBytes: number
  savedPercent: number
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processJsonMinifier(
  input: JsonMinifierInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): JsonMinifierResult {
  onProgress(20)

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      `Invalid JSON: ${(e as SyntaxError).message}`,
      { retryable: false }
    )
  }

  onProgress(70)

  const minified = JSON.stringify(parsed)
  const originalSize = new TextEncoder().encode(input).length
  const minifiedSize = new TextEncoder().encode(minified).length
  const savedBytes = originalSize - minifiedSize
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0

  onProgress(100)

  return { minified, originalSize, minifiedSize, savedBytes, savedPercent }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-minifier')

if (!tool) {
  throw new Error('[ToolEngine] json-minifier not found in registry')
}

export const jsonMinifierConfig = defineToolConfig<JsonMinifierInput, JsonMinifierResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste formatted JSON here to minify...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some JSON to minify.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processJsonMinifier,

  resultType: 'custom',
  layoutMode: 'split',
})
