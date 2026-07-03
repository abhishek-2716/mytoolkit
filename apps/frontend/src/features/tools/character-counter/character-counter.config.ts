import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CharacterCounterInput = string
export type CharacterCounterResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processCharacterCounter(
  input: CharacterCounterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): CharacterCounterResult {
  onProgress(20)

  const characters = input.length
  const charsNoSpaces = input.replace(/\s/g, '').length
  const words = (input.match(/\b\w+\b/g) ?? []).length
  const lines = input === '' ? 0 : input.split('\n').length
  const sentences = (() => {
    const m = input.match(/[^.!?]*[.!?]+/g)
    return m?.length ?? (input.trim().length > 0 ? 1 : 0)
  })()
  const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
  const wordList = (input.toLowerCase().match(/\b[a-z]+\b/g) ?? [])
  const uniqueWords = new Set(wordList).size
  const avgWordLength =
    wordList.length > 0
      ? (wordList.reduce((sum, w) => sum + w.length, 0) / wordList.length).toFixed(1)
      : '0'

  onProgress(100)

  return [
    { label: 'Characters', value: characters },
    { label: 'Characters (no spaces)', value: charsNoSpaces },
    { label: 'Words', value: words },
    { label: 'Lines', value: lines },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Unique Words', value: uniqueWords },
    { label: 'Avg Word Length', value: avgWordLength },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('character-counter')
if (!tool) throw new Error('[ToolEngine] character-counter not found in registry')

export const characterCounterConfig = defineToolConfig<CharacterCounterInput, CharacterCounterResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste or type your text here to analyse characters, words, lines and more...',
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Please enter some text to analyse.', { retryable: false }))
      return validInput(value)
    },
  },
  process: processCharacterCounter,
  resultType: 'structured',
  layoutMode: 'split',
})
