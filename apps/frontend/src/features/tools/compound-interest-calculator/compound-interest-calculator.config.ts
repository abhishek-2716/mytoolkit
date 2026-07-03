import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const compoundInterestSchema = z.object({
  principal: z.number().positive(),
  rate: z.number().positive(),
  time: z.number().positive(),
  compoundFrequency: z.enum(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily']),
})

export type CompoundInterestInput = z.infer<typeof compoundInterestSchema>
export type CompoundInterestResult = StructuredResultItem[]

const FREQUENCY_N: Record<string, number> = {
  annually: 1, 'semi-annually': 2, quarterly: 4, monthly: 12, daily: 365,
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('compound-interest-calculator')
if (!tool) throw new Error('[ToolEngine] compound-interest-calculator not found in registry')

export const compoundInterestConfig = defineToolConfig<CompoundInterestInput, CompoundInterestResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: compoundInterestSchema,
    defaultValues: { principal: 10000, rate: 8, time: 5, compoundFrequency: 'annually' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const n = FREQUENCY_N[input.compoundFrequency]
    const r = input.rate / 100
    const amount = input.principal * Math.pow(1 + r / n, n * input.time)
    const interest = amount - input.principal
    const ear = Math.pow(1 + r / n, n) - 1
    const fmt = (v: number) => `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    onProgress(100)
    return [
      { label: 'Principal', value: fmt(input.principal) },
      { label: 'Annual Rate', value: `${input.rate}%` },
      { label: 'Time Period', value: `${input.time} year${input.time !== 1 ? 's' : ''}` },
      { label: 'Compounding', value: input.compoundFrequency },
      { label: 'Total Interest', value: fmt(interest), valueColorClass: 'text-amber-500' },
      { label: 'Final Amount', value: fmt(amount), valueColorClass: 'text-emerald-500' },
      { label: 'Effective Annual Rate', value: `${(ear * 100).toFixed(4)}%`, valueColorClass: 'text-primary' },
    ]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
