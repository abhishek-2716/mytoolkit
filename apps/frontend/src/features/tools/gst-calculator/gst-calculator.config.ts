import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const gstCalculatorSchema = z.object({
  amount: z.number().positive(),
  gstRate: z.number().min(0),
  type: z.enum(['exclusive', 'inclusive']),
})

export type GstCalculatorInput = z.infer<typeof gstCalculatorSchema>
export type GstCalculatorResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processGstCalculator(
  input: GstCalculatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): GstCalculatorResult {
  onProgress(20)

  const rate = input.gstRate / 100
  let baseAmount: number
  let gstAmount: number

  if (input.type === 'exclusive') {
    baseAmount = input.amount
    gstAmount = baseAmount * rate
  } else {
    baseAmount = input.amount / (1 + rate)
    gstAmount = input.amount - baseAmount
  }

  const totalAmount = baseAmount + gstAmount
  const halfGst = gstAmount / 2
  const fmt = (v: number) => `₹${v.toFixed(2)}`

  onProgress(100)

  return [
    { label: 'Base Amount', value: fmt(baseAmount) },
    { label: `CGST (${input.gstRate / 2}%)`, value: fmt(halfGst), valueColorClass: 'text-amber-500' },
    { label: `SGST (${input.gstRate / 2}%)`, value: fmt(halfGst), valueColorClass: 'text-amber-500' },
    { label: 'Total GST', value: fmt(gstAmount), valueColorClass: 'text-primary' },
    { label: 'Total Amount', value: fmt(totalAmount), valueColorClass: 'text-primary' },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('gst-calculator')
if (!tool) throw new Error('[ToolEngine] gst-calculator not found in registry')

export const gstCalculatorConfig = defineToolConfig<GstCalculatorInput, GstCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: gstCalculatorSchema,
    defaultValues: { amount: 1000, gstRate: 18, type: 'exclusive' },
  },
  process: processGstCalculator,
  resultType: 'structured',
  layoutMode: 'split',
})
