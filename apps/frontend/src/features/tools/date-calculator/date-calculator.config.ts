import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const dateCalculatorSchema = z.object({
  mode: z.enum(['difference', 'add']),
  date1: z.string().min(1),
  date2: z.string().optional(),
  addDays: z.number().optional(),
  addMonths: z.number().optional(),
  addYears: z.number().optional(),
})

export type DateCalculatorInput = z.infer<typeof dateCalculatorSchema>
export type DateCalculatorResult = StructuredResultItem[]

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('date-calculator')
if (!tool) throw new Error('[ToolEngine] date-calculator not found in registry')

export const dateCalculatorConfig = defineToolConfig<DateCalculatorInput, DateCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: dateCalculatorSchema,
    defaultValues: { mode: 'difference', date1: '2026-06-30', date2: '', addDays: 0, addMonths: 0, addYears: 0 },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)

    if (input.mode === 'difference') {
      if (!input.date2) throw new Error('Please enter a second date.')
      const d1 = new Date(input.date1)
      const d2 = new Date(input.date2)
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) throw new Error('Invalid date(s).')
      const diffMs = Math.abs(d2.getTime() - d1.getTime())
      const diffDays = Math.round(diffMs / 86_400_000)
      const diffWeeks = Math.floor(diffDays / 7)
      const diffMonths = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()))
      const diffYears = parseFloat((diffDays / 365.25).toFixed(2))
      onProgress(100)
      return [
        { label: 'Start Date', value: d1.toLocaleDateString() },
        { label: 'End Date', value: d2.toLocaleDateString() },
        { label: 'Total Days', value: diffDays, valueColorClass: 'text-primary' },
        { label: 'Weeks', value: `${diffWeeks} weeks + ${diffDays % 7} days` },
        { label: 'Months (approx)', value: diffMonths },
        { label: 'Years (approx)', value: diffYears },
      ]
    } else {
      const d = new Date(input.date1)
      if (isNaN(d.getTime())) throw new Error('Invalid date.')
      const days = input.addDays ?? 0
      const months = input.addMonths ?? 0
      const years = input.addYears ?? 0
      d.setDate(d.getDate() + days)
      d.setMonth(d.getMonth() + months)
      d.setFullYear(d.getFullYear() + years)
      onProgress(100)
      return [
        { label: 'Start Date', value: new Date(input.date1).toLocaleDateString() },
        { label: 'Added', value: `${years}y ${months}m ${days}d` },
        { label: 'Result Date', value: d.toLocaleDateString(), valueColorClass: 'text-primary' },
        { label: 'Day of Week', value: d.toLocaleDateString(undefined, { weekday: 'long' }) },
        { label: 'ISO Format', value: d.toISOString().split('T')[0] },
      ]
    }
  },
  resultType: 'structured',
  layoutMode: 'split',
})
