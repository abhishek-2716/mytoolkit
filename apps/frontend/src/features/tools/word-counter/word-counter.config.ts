import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type WordCounterInput = string

/** Word counter result is a flat array of stat items for the structured renderer. */
export type WordCounterResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function countWords(text: string): number {
  return (text.match(/\b\w+\b/g) ?? []).length
}

function countSentences(text: string): number {
  const matches = text.match(/[^.!?]*[.!?]+/g)
  return matches?.length ?? (text.trim().length > 0 ? 1 : 0)
}

function countParagraphs(text: string): number {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length
}

function processWordCounter(
  input: WordCounterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): WordCounterResult {
  onProgress(20)

  const words = countWords(input)
  const characters = input.length
  const charactersNoSpaces = input.replace(/\s/g, '').length
  const sentences = countSentences(input)
  const paragraphs = countParagraphs(input)
  const readingTimeMin = Math.max(1, Math.round(words / 200))

  onProgress(100)

  return [
    { label: 'Words', value: words },
    { label: 'Characters', value: characters },
    { label: 'No Spaces', value: charactersNoSpaces },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Reading Time', value: `${readingTimeMin} min`, valueColorClass: 'text-foreground' },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('word-counter')

if (!tool) {
  throw new Error('[ToolEngine] word-counter not found in registry')
}

export const wordCounterConfig = defineToolConfig<WordCounterInput, WordCounterResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste or type your text here to count words, characters, sentences, and more...',
    maxLength: 1_000_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some text to analyze.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processWordCounter,

  resultType: 'structured',
  layoutMode: 'split',
})
