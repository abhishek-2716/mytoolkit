import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const randomNumberSchema = z.object({
  min: z.number(),
  max: z.number(),
  count: z.number().min(1).max(1000).int(),
  allowDecimals: z.boolean(),
  unique: z.boolean(),
})

export type RandomNumberInput = z.infer<typeof randomNumberSchema>

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('random-number-generator')
if (!tool) throw new Error('[ToolEngine] random-number-generator not found in registry')

export const randomNumberConfig = defineToolConfig<RandomNumberInput, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: randomNumberSchema,
    defaultValues: { min: 1, max: 100, count: 10, allowDecimals: false, unique: false },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    if (input.min > input.max) throw new Error('Min must be less than or equal to Max.')

    const range = input.max - input.min

    if (input.unique && !input.allowDecimals) {
      const intRange = Math.floor(input.max) - Math.ceil(input.min) + 1
      if (input.count > intRange) throw new Error(`Cannot generate ${input.count} unique integers in range [${input.min}, ${input.max}].`)
    }

    const numbers: number[] = []
    const usedSet = new Set<number>()
    let attempts = 0

    while (numbers.length < input.count && attempts < input.count * 100) {
      attempts++
      let n: number
      if (input.allowDecimals) {
        n = parseFloat((Math.random() * range + input.min).toFixed(4))
      } else {
        n = Math.floor(Math.random() * (Math.floor(input.max) - Math.ceil(input.min) + 1)) + Math.ceil(input.min)
      }

      if (input.unique) {
        if (!usedSet.has(n)) {
          usedSet.add(n)
          numbers.push(n)
        }
      } else {
        numbers.push(n)
      }
    }

    onProgress(100)
    return numbers.join(', ')
  },
  resultType: 'text',
  layoutMode: 'split',
})
