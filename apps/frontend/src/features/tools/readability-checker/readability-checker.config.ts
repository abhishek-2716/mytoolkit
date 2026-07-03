import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ReadabilityCheckerInput = string
export type ReadabilityCheckerResult = StructuredResultItem[]

/* ─── Syllable Counter ───────────────────────────────────────────────────── */

function countSyllables(word: string): number {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '')
  if (lower.length <= 3) return 1
  let count = lower.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g)?.length ?? 0
  return Math.max(1, count)
}

/* ─── Reading Level ──────────────────────────────────────────────────────── */

function getReadingLevel(score: number): string {
  if (score >= 90) return 'Very Easy (5th grade)'
  if (score >= 80) return 'Easy (6th grade)'
  if (score >= 70) return 'Fairly Easy (7th grade)'
  if (score >= 60) return 'Standard (8th–9th grade)'
  if (score >= 50) return 'Fairly Difficult (10th–12th grade)'
  if (score >= 30) return 'Difficult (College level)'
  return 'Very Confusing (College graduate)'
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processReadabilityChecker(
  input: ReadabilityCheckerInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): ReadabilityCheckerResult {
  onProgress(20)

  const wordList = input.match(/\b\w+\b/g) ?? []
  const wordCount = wordList.length
  const sentenceCount = Math.max(1, (input.match(/[^.!?]*[.!?]+/g) ?? []).length || (input.trim().length > 0 ? 1 : 0))
  const syllableCount = wordList.reduce((sum, w) => sum + countSyllables(w), 0)

  onProgress(70)

  const avgWordsPerSentence = wordCount / sentenceCount
  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0
  const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  const score = Math.max(0, Math.min(100, fleschScore))

  const colorClass = score >= 60 ? 'text-green-500' : score >= 40 ? 'text-amber-500' : 'text-destructive'

  onProgress(100)

  return [
    { label: 'Flesch Reading Ease', value: score.toFixed(1), valueColorClass: colorClass },
    { label: 'Reading Level', value: getReadingLevel(score) },
    { label: 'Word Count', value: wordCount },
    { label: 'Sentence Count', value: sentenceCount },
    { label: 'Avg Words / Sentence', value: avgWordsPerSentence.toFixed(1) },
    { label: 'Avg Syllables / Word', value: avgSyllablesPerWord.toFixed(2) },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('readability-checker')
if (!tool) throw new Error('[ToolEngine] readability-checker not found in registry')

export const readabilityCheckerConfig = defineToolConfig<ReadabilityCheckerInput, ReadabilityCheckerResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste your text here to check its readability score...',
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Please enter some text to analyse.', { retryable: false }))
      return validInput(value)
    },
  },
  process: processReadabilityChecker,
  resultType: 'structured',
  layoutMode: 'split',
})
