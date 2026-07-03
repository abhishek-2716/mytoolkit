import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Cron Parser ────────────────────────────────────────────────────────── */

function parseCronField(field: string, min: number, max: number): number[] {
  const values: number[] = []
  const parts = field.split(',')
  for (const part of parts) {
    if (part === '*') {
      for (let i = min; i <= max; i++) values.push(i)
    } else if (part.includes('/')) {
      const [range, stepStr] = part.split('/')
      const step = parseInt(stepStr)
      const start = range === '*' ? min : parseInt(range.split('-')[0])
      const end = range.includes('-') ? parseInt(range.split('-')[1]) : max
      for (let i = start; i <= end; i += step) values.push(i)
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= end; i++) values.push(i)
    } else {
      values.push(parseInt(part))
    }
  }
  return [...new Set(values)].sort((a, b) => a - b).filter((v) => v >= min && v <= max)
}

function describeCron(fields: string[]): string {
  const [minute, hour, dom, month, dow] = fields

  const minuteVals = parseCronField(minute, 0, 59)
  const hourVals = parseCronField(hour, 0, 23)
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const minuteDesc = minute === '0' ? 'at 0 minutes' : minute === '*' ? 'every minute' : `at minute ${minuteVals.join(', ')}`
  const hourDesc = hour === '*' ? 'every hour' : `${hourVals.map((h) => `${h}:${minute === '0' ? '00' : minute}`).join(', ')}`
  const domDesc = dom === '*' ? 'every day' : `on day ${dom}`
  const monthDesc = month === '*' ? 'every month' : `in ${parseCronField(month, 1, 12).map((m) => monthNames[m - 1]).join(', ')}`
  const dowDesc = dow === '*' ? '' : `on ${parseCronField(dow, 0, 6).map((d) => dayNames[d]).join(', ')}`

  if (minute === '0' && hour !== '*' && dom === '*' && month === '*') {
    const days = dowDesc ? dowDesc : 'every day'
    return `Every ${days} at ${hourVals.map((h) => `${h}:00`).join(', ')}`
  }
  if (minute === '*' && hour === '*') return `Every minute, ${domDesc}, ${monthDesc}${dowDesc ? ', ' + dowDesc : ''}`

  return `${minuteDesc}, ${hourDesc}, ${domDesc}, ${monthDesc}${dowDesc ? ', ' + dowDesc : ''}`
}

function getNextOccurrences(fields: string[], count: number): string[] {
  const now = new Date()
  const results: string[] = []
  const [minuteF, hourF, , , dowF] = fields

  const minutes = parseCronField(minuteF, 0, 59)
  const hours = parseCronField(hourF, 0, 23)
  const dows = parseCronField(dowF, 0, 6)
  const checkDow = dowF !== '*'

  const cursor = new Date(now)
  cursor.setSeconds(0, 0)
  cursor.setMinutes(cursor.getMinutes() + 1)

  let iterations = 0
  while (results.length < count && iterations < 100_000) {
    iterations++
    const h = cursor.getHours()
    const m = cursor.getMinutes()
    const d = cursor.getDay()

    if (hours.includes(h) && minutes.includes(m) && (!checkDow || dows.includes(d))) {
      results.push(cursor.toLocaleString())
    }
    cursor.setMinutes(cursor.getMinutes() + 1)
  }
  return results
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('cron-expression-parser')
if (!tool) throw new Error('[ToolEngine] cron-expression-parser not found in registry')

export const cronExpressionParserConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Enter a cron expression...\n\nExample: 0 9 * * 1-5 (Every weekday at 9:00 AM)',
    maxLength: 200,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter a cron expression.', { retryable: false }))
      const fields = value.trim().split(/\s+/)
      if (fields.length < 5 || fields.length > 6)
        return invalidInput(createToolError('validation-error', 'A cron expression must have 5 or 6 space-separated fields.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const fields = input.trim().split(/\s+/)
    // Use first 5 fields (skip seconds if 6-field)
    const cronFields = fields.length === 6 ? fields.slice(1) : fields
    const description = describeCron(cronFields)
    onProgress(60)
    const next = getNextOccurrences(cronFields, 5)
    onProgress(100)

    return [
      { label: 'Expression', value: input.trim() },
      { label: 'Schedule', value: description, valueColorClass: 'text-primary' },
      ...next.map((d, i) => ({ label: `Next Run #${i + 1}`, value: d, valueColorClass: 'text-foreground' })),
    ]
  },
  resultType: 'structured',
  layoutMode: 'stack',
})
