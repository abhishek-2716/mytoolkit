import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const ageCalculatorSchema = z.object({
  birthDate: z.string().min(1),
  targetDate: z.string().min(1),
})

export type AgeCalculatorInput = z.infer<typeof ageCalculatorSchema>
export type AgeCalculatorResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function processAgeCalculator(
  input: AgeCalculatorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): AgeCalculatorResult {
  onProgress(20)

  const birth = new Date(input.birthDate)
  const target = new Date(input.targetDate)

  if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
    onProgress(100)
    return [{ label: 'Error', value: 'Invalid date provided.' }]
  }

  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const msPerDay = 1000 * 60 * 60 * 24
  const totalDays = Math.floor((target.getTime() - birth.getTime()) / msPerDay)

  // Next birthday
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday <= target) nextBirthday.setFullYear(target.getFullYear() + 1)
  const daysToNextBirthday = Math.floor((nextBirthday.getTime() - target.getTime()) / msPerDay)

  const dayBorn = DAYS_OF_WEEK[birth.getDay()] ?? 'Unknown'

  onProgress(100)

  return [
    { label: 'Years', value: years },
    { label: 'Months', value: months },
    { label: 'Days', value: days },
    { label: 'Total Days', value: totalDays.toLocaleString() },
    { label: 'Next Birthday In', value: `${daysToNextBirthday} days` },
    { label: 'Day of Week Born', value: dayBorn },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const today = new Date().toISOString().split('T')[0] as string

const tool = getToolBySlug('age-calculator')
if (!tool) throw new Error('[ToolEngine] age-calculator not found in registry')

export const ageCalculatorConfig = defineToolConfig<AgeCalculatorInput, AgeCalculatorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: ageCalculatorSchema,
    defaultValues: { birthDate: '1990-01-01', targetDate: today },
  },
  process: processAgeCalculator,
  resultType: 'structured',
  layoutMode: 'split',
})
