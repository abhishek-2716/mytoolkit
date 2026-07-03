import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const timestampConverterSchema = z.object({
  value: z.string().min(1),
  type: z.enum(['unix-to-date', 'date-to-unix']),
})

export type TimestampConverterInput = z.infer<typeof timestampConverterSchema>
export type TimestampConverterResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function processTimestampConverter(
  input: TimestampConverterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): TimestampConverterResult {
  onProgress(20)

  if (input.type === 'unix-to-date') {
    const unix = parseInt(input.value, 10)
    if (isNaN(unix)) {
      return [{ label: 'Error', value: 'Invalid Unix timestamp. Enter a number like 1719705600.' }]
    }
    const ms = unix * 1000
    const d = new Date(ms)
    onProgress(100)
    return [
      { label: 'Unix Timestamp', value: unix.toString() },
      { label: 'UTC Date', value: d.toUTCString() },
      { label: 'ISO 8601', value: d.toISOString() },
      { label: 'Local Date', value: d.toLocaleString() },
      { label: 'Day of Week', value: DAYS[d.getUTCDay()] ?? '' },
      { label: 'Month', value: MONTHS[d.getUTCMonth()] ?? '' },
      { label: 'Year', value: d.getUTCFullYear().toString() },
    ]
  } else {
    const d = new Date(input.value)
    if (isNaN(d.getTime())) {
      return [{ label: 'Error', value: 'Invalid date string. Try: 2024-06-30T00:00:00Z' }]
    }
    const unix = Math.floor(d.getTime() / 1000)
    onProgress(100)
    return [
      { label: 'Unix Timestamp (s)', value: unix.toString(), valueColorClass: 'text-primary' },
      { label: 'Unix Timestamp (ms)', value: d.getTime().toString() },
      { label: 'UTC Date', value: d.toUTCString() },
      { label: 'ISO 8601', value: d.toISOString() },
      { label: 'Day of Week', value: DAYS[d.getUTCDay()] ?? '' },
    ]
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('timestamp-converter')
if (!tool) throw new Error('[ToolEngine] timestamp-converter not found in registry')

export const timestampConverterConfig = defineToolConfig<TimestampConverterInput, TimestampConverterResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: timestampConverterSchema,
    defaultValues: { value: '1719705600', type: 'unix-to-date' },
  },
  process: processTimestampConverter,
  resultType: 'structured',
  layoutMode: 'split',
})
