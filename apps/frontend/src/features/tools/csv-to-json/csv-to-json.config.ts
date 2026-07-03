import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const csvToJsonSchema = z.object({
  csv: z.string().min(1, 'Please enter some CSV data.'),
  delimiter: z.enum([',', ';', '\t', '|']),
  hasHeaders: z.boolean(),
  outputMode: z.enum(['array-of-objects', 'array-of-arrays']),
})

export type CsvToJsonInput = z.infer<typeof csvToJsonSchema>

export interface CsvToJsonResult {
  json: string
  rowCount: number
  columnCount: number
  headers: string[]
}

/* ─── CSV Parser ─────────────────────────────────────────────────────────── */

function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i] ?? ''
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === delimiter && !inQuotes) {
      fields.push(field)
      field = ''
    } else {
      field += ch
    }
  }
  fields.push(field)
  return fields
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processCsvToJson(
  input: CsvToJsonInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): CsvToJsonResult {
  onProgress(20)

  const lines = input.csv
    .split('\n')
    .map((l) => l.replace(/\r$/, ''))
    .filter((l) => l.trim().length > 0)

  if (lines.length === 0) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError('validation-error', 'No data found in the CSV.', { retryable: false })
  }

  onProgress(40)

  const delim = input.delimiter === '\t' ? '\t' : input.delimiter
  const rows = lines.map((line) => parseCsvLine(line, delim))

  let headers: string[]
  let dataRows: string[][]

  if (input.hasHeaders && rows.length > 0) {
    headers = (rows[0] ?? []).map((h) => h.trim())
    dataRows = rows.slice(1)
  } else {
    const maxCols = Math.max(...rows.map((r) => r.length))
    headers = Array.from({ length: maxCols }, (_, i) => `column${i + 1}`)
    dataRows = rows
  }

  onProgress(70)

  let result: unknown

  if (input.outputMode === 'array-of-objects') {
    result = dataRows.map((row) => {
      const obj: Record<string, string> = {}
      headers.forEach((header, i) => {
        obj[header] = (row[i] ?? '').trim()
      })
      return obj
    })
  } else {
    result = [headers, ...dataRows.map((row) => row.map((v) => v.trim()))]
  }

  const json = JSON.stringify(result, null, 2)

  onProgress(100)

  return {
    json,
    rowCount: dataRows.length,
    columnCount: headers.length,
    headers,
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('csv-to-json')

if (!tool) {
  throw new Error('[ToolEngine] csv-to-json not found in registry')
}

export const csvToJsonConfig = defineToolConfig<CsvToJsonInput, CsvToJsonResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'form',
    schema: csvToJsonSchema,
    defaultValues: { csv: '', delimiter: ',', hasHeaders: true, outputMode: 'array-of-objects' },
  },

  process: processCsvToJson,

  resultType: 'custom',
  layoutMode: 'form',
})
