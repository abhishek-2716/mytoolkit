import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Conversion Logic ───────────────────────────────────────────────────── */

const ROMAN_VALUES: [string, number][] = [
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
  ['C', 100],  ['XC', 90],  ['L', 50],  ['XL', 40],
  ['X', 10],   ['IX', 9],   ['V', 5],   ['IV', 4], ['I', 1],
]

function intToRoman(num: number): string {
  let result = ''
  for (const [symbol, value] of ROMAN_VALUES) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}

function romanToInt(roman: string): number | null {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  const upper = roman.toUpperCase()
  if (!/^[IVXLCDM]+$/.test(upper)) return null
  let result = 0
  for (let i = 0; i < upper.length; i++) {
    const curr = map[upper[i]]
    const next = map[upper[i + 1]]
    if (next && curr < next) {
      result -= curr
    } else {
      result += curr
    }
  }
  return result
}

function isRomanNumeral(input: string): boolean {
  return /^[IVXLCDMivxlcdm\s]+$/.test(input.trim()) && !/^\d/.test(input.trim())
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('roman-numeral-converter')
if (!tool) throw new Error('[ToolEngine] roman-numeral-converter not found in registry')

export const romanNumeralConverterConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder:
      'Enter a number (e.g. 2024) or Roman numeral (e.g. MMXXIV).\nAuto-detects the direction.',
    maxLength: 20,
    validate: (value) => {
      const trimmed = value.trim()
      if (!trimmed) {
        return invalidInput(
          createToolError('validation-error', 'Please enter a number or Roman numeral.', { retryable: false })
        )
      }
      if (isRomanNumeral(trimmed)) {
        const num = romanToInt(trimmed)
        if (num === null || num < 1 || num > 3999) {
          return invalidInput(
            createToolError('validation-error', 'Invalid Roman numeral. Valid range is I (1) to MMMCMXCIX (3999).', { retryable: false })
          )
        }
      } else {
        const num = parseInt(trimmed, 10)
        if (isNaN(num) || num < 1 || num > 3999) {
          return invalidInput(
            createToolError('validation-error', 'Please enter a number between 1 and 3999.', { retryable: false })
          )
        }
      }
      return validInput(trimmed)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const trimmed = input.trim()
    if (isRomanNumeral(trimmed)) {
      const num = romanToInt(trimmed)!
      onProgress(100)
      return `${trimmed.toUpperCase()} = ${num}`
    } else {
      const num = parseInt(trimmed, 10)
      const roman = intToRoman(num)
      onProgress(100)
      return `${num} = ${roman}`
    }
  },
  resultType: 'text',
  layoutMode: 'stack',
})
