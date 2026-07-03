import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const emiCalculatorSchema = z.object({
  principal: z.number().positive(),
  annualRate: z.number().positive(),
  tenureMonths: z.number().positive().int(),
})

export type EmiCalculatorInput = z.infer<typeof emiCalculatorSchema>
export type EmiCalculatorResult = StructuredResultItem[]

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('emi-calculator')
if (!tool) throw new Error('[ToolEngine] emi-calculator not found in registry')

export const emiCalculatorConfig = defineToolConfig<EmiCalculatorInput, EmiCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: emiCalculatorSchema,
    defaultValues: { principal: 500000, annualRate: 8.5, tenureMonths: 60 },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const r = input.annualRate / 100 / 12
    const n = input.tenureMonths
    const emi = r === 0
      ? input.principal / n
      : input.principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - input.principal
    const ratio = ((totalInterest / input.principal) * 100).toFixed(1)
    const fmt = (v: number) => `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    onProgress(100)
    return [
      { label: 'Monthly EMI', value: fmt(emi), valueColorClass: 'text-primary' },
      { label: 'Principal Amount', value: fmt(input.principal) },
      { label: 'Total Interest', value: fmt(totalInterest), valueColorClass: 'text-amber-500' },
      { label: 'Total Amount Payable', value: fmt(totalPayable), valueColorClass: 'text-emerald-500' },
      { label: 'Interest to Principal', value: `${ratio}%` },
      { label: 'Loan Tenure', value: `${input.tenureMonths} months (${(input.tenureMonths / 12).toFixed(1)} years)` },
    ]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
