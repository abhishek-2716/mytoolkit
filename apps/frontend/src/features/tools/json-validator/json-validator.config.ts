import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type JsonValidatorInput = string

export interface JsonValidatorResult {
  isValid: boolean
  stats: StructuredResultItem[]
  formatted: string
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processJsonValidator(
  input: JsonValidatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): JsonValidatorResult {
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

  const formatted = JSON.stringify(parsed, null, 2)
  const lineCount = formatted.split('\n').length
  const keyCount = (input.match(/"[^"]+"\s*:/g) ?? []).length

  const type = Array.isArray(parsed) ? 'array' : parsed === null ? 'null' : typeof parsed
  const depth = getJsonDepth(parsed)

  onProgress(100)

  return {
    isValid: true,
    formatted,
    stats: [
      { label: 'Type', value: type.charAt(0).toUpperCase() + type.slice(1), valueColorClass: 'text-foreground' },
      { label: 'Keys', value: keyCount },
      { label: 'Lines', value: lineCount },
      { label: 'Depth', value: depth },
      { label: 'Size', value: `${(input.length / 1024).toFixed(1)} KB`, valueColorClass: 'text-foreground' },
    ],
  }
}

function getJsonDepth(value: unknown, depth = 0): number {
  if (typeof value !== 'object' || value === null) return depth
  const children = Array.isArray(value) ? value : Object.values(value)
  if (children.length === 0) return depth
  return Math.max(...children.map((child) => getJsonDepth(child, depth + 1)))
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-validator')

if (!tool) {
  throw new Error('[ToolEngine] json-validator not found in registry')
}

export const jsonValidatorConfig = defineToolConfig<JsonValidatorInput, JsonValidatorResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste your JSON here to validate...\n\nExample: {"name":"Alice","age":30}',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some JSON to validate.', {
            retryable: false,
          })
        )
      }
      const firstChar = value.trim()[0]
      if (!firstChar || !['{', '[', '"', 't', 'f', 'n', '-'].includes(firstChar) && !/\d/.test(firstChar)) {
        return invalidInput(
          createToolError('validation-error', 'Input does not appear to be valid JSON.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processJsonValidator,

  resultType: 'custom',
  layoutMode: 'split',
})
