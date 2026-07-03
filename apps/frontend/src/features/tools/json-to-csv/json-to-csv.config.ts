import { getToolBySlug } from '@/registry'

import type { FileResult } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type JsonToCsvInput = string

export interface JsonToCsvResult {
  csv: string
  rowCount: number
  columnCount: number
  columns: string[]
  file: FileResult
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    const str = JSON.stringify(value)
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  // At this point value is string | number | boolean | bigint | symbol | function
  // JSON values are only string | number | boolean — safe to stringify
  const str =
    typeof value === 'string' ? value
    : typeof value === 'number' || typeof value === 'boolean' ? String(value)
    : JSON.stringify(value)
  // Wrap in quotes if contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function getAllKeys(rows: Record<string, unknown>[]): string[] {
  const keySet = new Set<string>()
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      keySet.add(key)
    }
  }
  return Array.from(keySet)
}

function processJsonToCsv(
  input: JsonToCsvInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): JsonToCsvResult {
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

  if (!Array.isArray(parsed)) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      'JSON must be an array of objects to convert to CSV. Example: [{"name":"Alice"},{"name":"Bob"}]',
      { retryable: false }
    )
  }

  // Support array of primitives too
  const rows = parsed as unknown[]
  if (rows.length === 0) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError('validation-error', 'The JSON array is empty.', { retryable: false })
  }

  onProgress(50)

  let csv: string
  let columns: string[]

  if (typeof rows[0] === 'object' && rows[0] !== null && !Array.isArray(rows[0])) {
    // Array of objects
    const objRows = rows as Record<string, unknown>[]
    columns = getAllKeys(objRows)
    const headerRow = columns.map(escapeCsvValue).join(',')
    const dataRows = objRows.map((row) =>
      columns.map((col) => escapeCsvValue(row[col])).join(',')
    )
    csv = [headerRow, ...dataRows].join('\n')
  } else {
    // Array of primitives or mixed
    columns = ['value']
    csv = ['value', ...rows.map((v) => escapeCsvValue(v))].join('\n')
  }

  onProgress(80)

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

  onProgress(100)

  return {
    csv,
    rowCount: rows.length,
    columnCount: columns.length,
    columns,
    file: {
      fileName: 'data.csv',
      blob,
      mimeType: 'text/csv',
      sizeBytes: blob.size,
    },
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-to-csv')

if (!tool) {
  throw new Error('[ToolEngine] json-to-csv not found in registry')
}

export const jsonToCsvConfig = defineToolConfig<JsonToCsvInput, JsonToCsvResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste a JSON array of objects...\n\nExample:\n[\n  {"name":"Alice","age":30},\n  {"name":"Bob","age":25}\n]',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter a JSON array.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processJsonToCsv,

  resultType: 'custom',
  layoutMode: 'split',
})
