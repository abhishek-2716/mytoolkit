import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const loanCalculatorSchema = z.object({
  principal: z.number().positive(),
  annualRate: z.number().min(0),
  years: z.number().int().min(1).max(50),
  currency: z.string().min(0),
})

export type LoanCalculatorInput = z.infer<typeof loanCalculatorSchema>
export type LoanCalculatorResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processLoanCalculator(
  input: LoanCalculatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): LoanCalculatorResult {
  onProgress(20)

  const currency = input.currency || '₹'
  const n = input.years * 12
  const fmt = (v: number) => `${currency}${v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  let emi: number
  let totalPayment: number
  let totalInterest: number

  if (input.annualRate === 0) {
    emi = input.principal / n
    totalPayment = input.principal
    totalInterest = 0
  } else {
    const r = input.annualRate / 12 / 100
    const factor = Math.pow(1 + r, n)
    emi = (input.principal * r * factor) / (factor - 1)
    totalPayment = emi * n
    totalInterest = totalPayment - input.principal
  }

  onProgress(100)

  return [
    { label: 'Monthly EMI', value: fmt(emi), valueColorClass: 'text-primary' },
    { label: 'Total Payment', value: fmt(totalPayment) },
    { label: 'Total Interest', value: fmt(totalInterest), valueColorClass: 'text-amber-500' },
    { label: 'Principal Amount', value: fmt(input.principal) },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('loan-calculator')
if (!tool) throw new Error('[ToolEngine] loan-calculator not found in registry')

export const loanCalculatorConfig = defineToolConfig<LoanCalculatorInput, LoanCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: loanCalculatorSchema,
    defaultValues: { principal: 1000000, annualRate: 8.5, years: 20, currency: '₹' },
  },
  process: processLoanCalculator,
  resultType: 'structured',
  layoutMode: 'split',
})
