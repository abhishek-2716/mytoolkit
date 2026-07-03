import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const percentageCalculatorSchema = z.object({
  mode: z.enum(['percent-of', 'what-percent', 'percent-change']),
  value1: z.number(),
  value2: z.number(),
})

export type PercentageCalculatorInput = z.infer<typeof percentageCalculatorSchema>
export type PercentageCalculatorResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processPercentageCalculator(
  input: PercentageCalculatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): PercentageCalculatorResult {
  onProgress(20)

  let answer: number
  let explanation: string

  if (input.mode === 'percent-of') {
    answer = (input.value1 / 100) * input.value2
    explanation = `${input.value1}% of ${input.value2}`
  } else if (input.mode === 'what-percent') {
    answer = input.value2 !== 0 ? (input.value1 / input.value2) * 100 : 0
    explanation = `${input.value1} is what % of ${input.value2}`
  } else {
    answer = input.value1 !== 0 ? ((input.value2 - input.value1) / Math.abs(input.value1)) * 100 : 0
    explanation = `Change from ${input.value1} to ${input.value2}`
  }

  const formatted = Number.isFinite(answer) ? parseFloat(answer.toFixed(4)).toString() : '0'
  const colorClass = input.mode === 'percent-change' && answer < 0 ? 'text-destructive' : 'text-primary'

  onProgress(100)

  return [
    { label: 'Result', value: formatted + (input.mode === 'percent-of' ? '' : '%'), valueColorClass: colorClass },
    { label: 'Calculation', value: explanation },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('percentage-calculator')
if (!tool) throw new Error('[ToolEngine] percentage-calculator not found in registry')

export const percentageCalculatorConfig = defineToolConfig<PercentageCalculatorInput, PercentageCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: percentageCalculatorSchema,
    defaultValues: { mode: 'percent-of', value1: 25, value2: 200 },
  },
  process: processPercentageCalculator,
  resultType: 'structured',
  layoutMode: 'split',
})
