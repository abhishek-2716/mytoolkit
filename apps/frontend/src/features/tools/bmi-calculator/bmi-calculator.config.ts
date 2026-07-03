import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const bmiCalculatorSchema = z.object({
  weight: z.number().positive(),
  height: z.number().positive(),
  unit: z.enum(['metric', 'imperial']),
})

export type BmiCalculatorInput = z.infer<typeof bmiCalculatorSchema>
export type BmiCalculatorResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function getBmiCategory(bmi: number): { category: string; colorClass: string } {
  if (bmi < 18.5) return { category: 'Underweight', colorClass: 'text-blue-500' }
  if (bmi < 25) return { category: 'Normal weight', colorClass: 'text-green-500' }
  if (bmi < 30) return { category: 'Overweight', colorClass: 'text-amber-500' }
  return { category: 'Obese', colorClass: 'text-destructive' }
}

function processBmiCalculator(
  input: BmiCalculatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): BmiCalculatorResult {
  onProgress(20)

  let weightKg = input.weight
  let heightM = input.height / 100

  if (input.unit === 'imperial') {
    weightKg = input.weight * 0.453592
    heightM = input.height * 0.0254
  }

  const bmi = weightKg / (heightM * heightM)
  const { category, colorClass } = getBmiCategory(bmi)

  // Healthy weight range for this height
  const minWeight = 18.5 * heightM * heightM
  const maxWeight = 24.9 * heightM * heightM
  const fmt = (kg: number) =>
    input.unit === 'imperial'
      ? `${(kg / 0.453592).toFixed(1)} lbs`
      : `${kg.toFixed(1)} kg`

  onProgress(100)

  return [
    { label: 'BMI', value: bmi.toFixed(1), valueColorClass: colorClass },
    { label: 'Category', value: category, valueColorClass: colorClass },
    { label: 'Healthy Weight Range', value: `${fmt(minWeight)} – ${fmt(maxWeight)}` },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('bmi-calculator')
if (!tool) throw new Error('[ToolEngine] bmi-calculator not found in registry')

export const bmiCalculatorConfig = defineToolConfig<BmiCalculatorInput, BmiCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: bmiCalculatorSchema,
    defaultValues: { weight: 70, height: 175, unit: 'metric' },
  },
  process: processBmiCalculator,
  resultType: 'structured',
  layoutMode: 'split',
})
