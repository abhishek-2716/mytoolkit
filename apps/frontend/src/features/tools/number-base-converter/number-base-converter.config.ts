import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const numberBaseConverterSchema = z.object({
  number: z.string().min(1, 'Enter a number'),
  fromBase: z.enum(['2', '8', '10', '16']),
})

export type NumberBaseConverterInput = z.infer<typeof numberBaseConverterSchema>
export type NumberBaseConverterResult = StructuredResultItem[]

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('number-base-converter')
if (!tool) throw new Error('[ToolEngine] number-base-converter not found in registry')

export const numberBaseConverterConfig = defineToolConfig<NumberBaseConverterInput, NumberBaseConverterResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: numberBaseConverterSchema,
    defaultValues: { number: '255', fromBase: '10' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const decimal = parseInt(input.number, Number(input.fromBase))
    if (isNaN(decimal)) {
      throw new Error(`Invalid number "${input.number}" for base ${input.fromBase}`)
    }
    onProgress(100)
    return [
      { label: 'Binary (Base 2)', value: decimal.toString(2), iconName: 'Binary' },
      { label: 'Octal (Base 8)', value: decimal.toString(8) },
      { label: 'Decimal (Base 10)', value: decimal.toString(10), valueColorClass: 'text-primary' },
      { label: 'Hexadecimal (Base 16)', value: decimal.toString(16).toUpperCase(), valueColorClass: 'text-amber-500' },
    ]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
