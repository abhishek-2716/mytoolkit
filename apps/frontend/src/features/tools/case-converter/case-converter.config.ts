import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CaseConverterInput = string

export interface CaseConverterResult {
  upper: string
  lower: string
  title: string
  sentence: string
  camel: string
  pascal: string
  snake: string
  kebab: string
  original: string
}

/* ─── Case Conversion Helpers ────────────────────────────────────────────── */

function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase())
}

function toCamelCase(text: string): string {
  const words = text
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
  return words
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')
}

function toPascalCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function toSnakeCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

function toKebabCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processCaseConverter(
  input: CaseConverterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): CaseConverterResult {
  onProgress(30)
  const result: CaseConverterResult = {
    original: input,
    upper: input.toUpperCase(),
    lower: input.toLowerCase(),
    title: toTitleCase(input),
    sentence: toSentenceCase(input),
    camel: toCamelCase(input),
    pascal: toPascalCase(input),
    snake: toSnakeCase(input),
    kebab: toKebabCase(input),
  }
  onProgress(100)
  return result
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('case-converter')

if (!tool) {
  throw new Error('[ToolEngine] case-converter not found in registry')
}

export const caseConverterConfig = defineToolConfig<CaseConverterInput, CaseConverterResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder:
      'Type or paste your text here...\n\nExample: hello world from the browser',
    maxLength: 100_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text to convert.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processCaseConverter,

  resultType: 'custom',
  layoutMode: 'split',
})
