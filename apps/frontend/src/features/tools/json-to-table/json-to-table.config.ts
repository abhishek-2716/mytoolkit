import { getToolBySlug } from '@/registry'

import type { TableResult } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── JSON to Table ──────────────────────────────────────────────────────── */

function valueToString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return (value as unknown[]).join(', ')
  return String(value)
}

function processJsonToTable(input: string): TableResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch {
    throw createToolError('processing-error', 'Invalid JSON. Please check the syntax and try again.', { retryable: false })
  }

  if (!Array.isArray(parsed)) {
    throw createToolError('processing-error', 'Input must be a JSON array of objects.', { retryable: false })
  }

  if (parsed.length === 0) {
    return { headers: [], rows: [] }
  }

  // Collect all unique keys
  const allKeys = new Set<string>()
  for (const item of parsed) {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      Object.keys(item as Record<string, unknown>).forEach((k) => allKeys.add(k))
    }
  }

  const headers = Array.from(allKeys)
  const rows = parsed.map((item) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return headers.map(() => valueToString(item))
    }
    const obj = item as Record<string, unknown>
    return headers.map((h) => valueToString(obj[h]))
  })

  return { headers, rows }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-to-table')
if (!tool) throw new Error('[ToolEngine] json-to-table not found in registry')

export const jsonToTableConfig = defineToolConfig<string, TableResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder:
      'Paste a JSON array to view as a table...\n\nExample:\n[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter a JSON array.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = processJsonToTable(input)
    onProgress(100)
    return result
  },
  resultType: 'table',
  layoutMode: 'split',
})
