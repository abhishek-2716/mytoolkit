import { getToolBySlug } from '@/registry'

import type { TableResult } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── CSV Parser ─────────────────────────────────────────────────────────── */

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(field)
      field = ''
    } else {
      field += ch
    }
  }
  fields.push(field)
  return fields
}

function parseCsv(input: string): TableResult {
  const lines = input.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length === 0) return { headers: [], rows: [] }

  const headers = parseCsvLine(lines[0]!)
  const rows: (string | number)[][] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]!)
    // Pad or trim to match header count
    const row: (string | number)[] = headers.map((_, hi) => {
      const val = cells[hi] ?? ''
      const num = Number(val)
      return val !== '' && !isNaN(num) ? num : val
    })
    rows.push(row)
  }

  return { headers, rows }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('csv-viewer')
if (!tool) throw new Error('[ToolEngine] csv-viewer not found in registry')

export const csvViewerConfig = defineToolConfig<string, TableResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder:
      'Paste CSV data to view as a table...\n\nExample:\nname,age,email\nAlice,30,alice@example.com\nBob,25,bob@example.com',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter CSV data.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = parseCsv(input)
    onProgress(100)
    return result
  },
  resultType: 'table',
  layoutMode: 'split',
})
