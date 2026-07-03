import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const passwordGeneratorSchema = z.object({
  length: z.number().int().min(4).max(128),
  uppercase: z.boolean(),
  lowercase: z.boolean(),
  numbers: z.boolean(),
  symbols: z.boolean(),
  excludeAmbiguous: z.boolean(),
})

export type PasswordGeneratorInput = z.infer<typeof passwordGeneratorSchema>
export type PasswordGeneratorResult = string

/* ─── Processing Logic ────────────────────────────────────────────────────── */

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const UPPER_UNAMBIGUOUS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const LOWER_UNAMBIGUOUS = 'abcdefghjkmnpqrstuvwxyz'
const NUMS = '0123456789'
const NUMS_UNAMBIGUOUS = '23456789'
const SYMS = '!@#$%^&*()-_=+[]{}|;:,.<>?'

function processPasswordGenerator(
  input: PasswordGeneratorInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): PasswordGeneratorResult {
  onProgress(20)

  let charset = ''
  if (input.uppercase) charset += input.excludeAmbiguous ? UPPER_UNAMBIGUOUS : UPPER
  if (input.lowercase) charset += input.excludeAmbiguous ? LOWER_UNAMBIGUOUS : LOWER
  if (input.numbers) charset += input.excludeAmbiguous ? NUMS_UNAMBIGUOUS : NUMS
  if (input.symbols) charset += SYMS

  if (!charset) charset = LOWER

  const array = new Uint32Array(input.length)
  crypto.getRandomValues(array)
  const password = Array.from(array, (n) => charset[n % charset.length]).join('')

  onProgress(100)
  return password
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('password-generator')
if (!tool) throw new Error('[ToolEngine] password-generator not found in registry')

export const passwordGeneratorConfig = defineToolConfig<PasswordGeneratorInput, PasswordGeneratorResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: passwordGeneratorSchema,
    defaultValues: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false },
  },
  process: processPasswordGenerator,
  resultType: 'text',
  layoutMode: 'split',
})
