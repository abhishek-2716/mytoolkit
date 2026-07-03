import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const discountCalculatorSchema = z.object({
  originalPrice: z.number().positive(),
  discountPercent: z.number().min(0).max(100),
})

export type DiscountCalculatorInput = z.infer<typeof discountCalculatorSchema>
export type DiscountCalculatorResult = StructuredResultItem[]

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('discount-calculator')
if (!tool) throw new Error('[ToolEngine] discount-calculator not found in registry')

export const discountCalculatorConfig = defineToolConfig<DiscountCalculatorInput, DiscountCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: discountCalculatorSchema,
    defaultValues: { originalPrice: 1000, discountPercent: 20 },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const discount = (input.originalPrice * input.discountPercent) / 100
    const finalPrice = input.originalPrice - discount
    const fmt = (v: number) => `₹${v.toFixed(2)}`
    onProgress(100)
    return [
      { label: 'Original Price', value: fmt(input.originalPrice) },
      { label: 'Discount Rate', value: `${input.discountPercent}%` },
      { label: 'Discount Amount', value: fmt(discount), valueColorClass: 'text-red-500' },
      { label: 'Final Price', value: fmt(finalPrice), valueColorClass: 'text-emerald-500' },
      { label: 'You Save', value: fmt(discount), valueColorClass: 'text-primary' },
    ]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
