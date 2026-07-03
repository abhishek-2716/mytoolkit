import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const calorieCalculatorSchema = z.object({
  age: z.number().min(1).max(120),
  gender: z.enum(['male', 'female']),
  weight: z.number().positive(),
  height: z.number().positive(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
  unit: z.enum(['metric', 'imperial']),
})

export type CalorieCalculatorInput = z.infer<typeof calorieCalculatorSchema>
export type CalorieCalculatorResult = StructuredResultItem[]

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('calorie-calculator')
if (!tool) throw new Error('[ToolEngine] calorie-calculator not found in registry')

export const calorieCalculatorConfig = defineToolConfig<CalorieCalculatorInput, CalorieCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: calorieCalculatorSchema,
    defaultValues: { age: 25, gender: 'male', weight: 70, height: 175, activityLevel: 'moderate', unit: 'metric' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)

    // Convert to metric if imperial
    const weightKg = input.unit === 'imperial' ? input.weight * 0.453592 : input.weight
    const heightCm = input.unit === 'imperial' ? input.height * 2.54 : input.height

    // Mifflin-St Jeor BMR
    let bmr: number
    if (input.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * input.age + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * input.age - 161
    }

    const multiplier = ACTIVITY_MULTIPLIERS[input.activityLevel]
    const tdee = bmr * multiplier
    const proteinTarget = weightKg * 0.8

    onProgress(100)
    return [
      { label: 'BMR (Basal Metabolic Rate)', value: `${Math.round(bmr)} kcal/day`, valueColorClass: 'text-primary' },
      { label: 'TDEE (Maintenance)', value: `${Math.round(tdee)} kcal/day`, valueColorClass: 'text-emerald-500' },
      { label: 'Weight Loss (−500 kcal)', value: `${Math.round(tdee - 500)} kcal/day`, valueColorClass: 'text-amber-500' },
      { label: 'Weight Gain (+500 kcal)', value: `${Math.round(tdee + 500)} kcal/day` },
      { label: 'Protein Target', value: `${proteinTarget.toFixed(0)}g/day (0.8g/kg)` },
    ]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
