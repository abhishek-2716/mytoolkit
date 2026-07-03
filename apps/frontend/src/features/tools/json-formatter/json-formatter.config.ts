import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig,invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface JsonFormatterInput {
  text: string
  indentation: 2 | 4
}

export interface JsonFormatterResult {
  formatted: string
  minified: string
  isValid: boolean
  lineCount: number
  characterCount: number
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processJsonFormatter(
  input: JsonFormatterInput,
  signal: AbortSignal,
  onProgress: (p: number) => void
): JsonFormatterResult {
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  if (signal.aborted) throw createToolError('cancelled', 'Cancelled.')

  onProgress(20)

  let parsed: unknown
  try {
    parsed = JSON.parse(input.text)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      `Invalid JSON: ${(e as SyntaxError).message}`,
      { retryable: false }
    )
  }

  onProgress(60)

  const formatted = JSON.stringify(parsed, null, input.indentation)
  const minified = JSON.stringify(parsed)

  onProgress(100)

  return {
    formatted,
    minified,
    isValid: true,
    lineCount: formatted.split('\n').length,
    characterCount: formatted.length,
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-formatter')

if (!tool) {
  throw new Error('[ToolEngine] json-formatter not found in registry')
}

export const jsonFormatterConfig = defineToolConfig<JsonFormatterInput, JsonFormatterResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste your JSON here...\n\nExample: {"name":"Alice","age":30}',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some JSON to format.', {
            retryable: false,
          })
        )
      }
      // Quick pre-validation: must start with { [ " or a primitive
      const trimmed = value.trim()
      const firstChar = trimmed[0]
      if (!['{', '[', '"', 't', 'f', 'n', '-'].includes(firstChar) && !/\d/.test(firstChar)) {
        return invalidInput(
          createToolError('validation-error', 'Input does not appear to be valid JSON.', {
            retryable: false,
          })
        )
      }
      return validInput({ text: value, indentation: 2 })
    },
  },

  process: processJsonFormatter,

  resultType: 'code',
  layoutMode: 'split',
})
