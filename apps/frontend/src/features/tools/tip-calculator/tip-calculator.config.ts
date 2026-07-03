import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const tipCalculatorSchema = z.object({
  billAmount: z.number().positive(),
  tipPercent: z.number().min(0).max(100),
  splitCount: z.number().int().min(1).max(100),
})

export type TipCalculatorInput = z.infer<typeof tipCalculatorSchema>
export type TipCalculatorResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processTipCalculator(
  input: TipCalculatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): TipCalculatorResult {
  onProgress(20)

  const tipAmount = input.billAmount * (input.tipPercent / 100)
  const totalBill = input.billAmount + tipAmount
  const perPersonTotal = totalBill / input.splitCount
  const perPersonTip = tipAmount / input.splitCount

  const fmt = (v: number) => `$${v.toFixed(2)}`

  onProgress(100)

  return [
    { label: 'Tip Amount', value: fmt(tipAmount), valueColorClass: 'text-primary' },
    { label: 'Total Bill', value: fmt(totalBill) },
    { label: 'Per Person Total', value: fmt(perPersonTotal), valueColorClass: 'text-primary' },
    { label: 'Per Person Tip', value: fmt(perPersonTip) },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('tip-calculator')
if (!tool) throw new Error('[ToolEngine] tip-calculator not found in registry')

export const tipCalculatorConfig = defineToolConfig<TipCalculatorInput, TipCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: tipCalculatorSchema,
    defaultValues: { billAmount: 100, tipPercent: 15, splitCount: 1 },
  },
  process: processTipCalculator,
  resultType: 'structured',
  layoutMode: 'split',
})
