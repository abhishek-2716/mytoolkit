import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('text-statistics')
if (!tool) throw new Error('[ToolEngine] text-statistics not found in registry')

export const textStatisticsConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste your text here for detailed statistics...',
    maxLength: 1_000_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter some text to analyze.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)

    const words = (input.match(/\b\w+\b/g) ?? []) as string[]
    const wordCount = words.length
    const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size
    const avgWordLength = wordCount > 0 ? (words.reduce((s, w) => s + w.length, 0) / wordCount) : 0
    const sortedByLen = [...words].sort((a, b) => b.length - a.length)
    const longestWord = sortedByLen[0] ?? '-'
    const shortestWord = sortedByLen[sortedByLen.length - 1] ?? '-'
    const sentences = (input.match(/[^.!?]+[.!?]+/g) ?? []).length || (input.trim() ? 1 : 0)
    const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim()).length
    const readingTime = Math.max(1, Math.round(wordCount / 200))
    const vowelCount = (input.match(/[aeiouAEIOU]/g) ?? []).length
    const consonantCount = (input.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g) ?? []).length

    onProgress(100)

    return [
      { label: 'Word Count', value: wordCount, iconName: 'AlignLeft' },
      { label: 'Unique Words', value: uniqueWords, iconName: 'Fingerprint' },
      { label: 'Avg Word Length', value: `${avgWordLength.toFixed(1)} chars` },
      { label: 'Longest Word', value: longestWord },
      { label: 'Shortest Word', value: shortestWord },
      { label: 'Sentences', value: sentences },
      { label: 'Paragraphs', value: paragraphs },
      { label: 'Reading Time', value: `${readingTime} min`, valueColorClass: 'text-primary' },
      { label: 'Vowels', value: vowelCount, valueColorClass: 'text-emerald-500' },
      { label: 'Consonants', value: consonantCount, valueColorClass: 'text-blue-500' },
    ]
  },
  resultType: 'structured',
  layoutMode: 'split',
})
