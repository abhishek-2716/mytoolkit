import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type KeywordDensityInput = string
export type KeywordDensityResult = StructuredResultItem[]

/* ─── Stop Words ─────────────────────────────────────────────────────────── */

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','up','about','into','through','during','is','are','was','were',
  'be','been','being','have','has','had','do','does','did','will','would',
  'could','should','may','might','shall','can','need','dare','ought','used',
  'it','its','this','that','these','those','i','you','he','she','we','they',
  'me','him','her','us','them','my','your','his','our','their','what','which',
  'who','whom','not','no','so','if','as','than','then','when','where','how',
])

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processKeywordDensity(
  input: KeywordDensityInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): KeywordDensityResult {
  onProgress(20)

  const words = (input.toLowerCase().match(/\b[a-z]{2,}\b/g) ?? []).filter(
    (w) => !STOP_WORDS.has(w)
  )

  onProgress(60)

  const total = words.length
  if (total === 0) {
    return [{ label: 'Result', value: 'No meaningful keywords found in the text.' }]
  }

  const freq = new Map<string, number>()
  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1)
  }

  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)

  onProgress(100)

  return sorted.map(([word, count]) => ({
    label: word,
    value: `${count} occurrence${count !== 1 ? 's' : ''} (${((count / total) * 100).toFixed(1)}%)`,
  }))
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('keyword-density')
if (!tool) throw new Error('[ToolEngine] keyword-density not found in registry')

export const keywordDensityConfig = defineToolConfig<KeywordDensityInput, KeywordDensityResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste your article or text here to analyse keyword density...',
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Please enter some text to analyse.', { retryable: false }))
      return validInput(value)
    },
  },
  process: processKeywordDensity,
  resultType: 'structured',
  layoutMode: 'split',
})
