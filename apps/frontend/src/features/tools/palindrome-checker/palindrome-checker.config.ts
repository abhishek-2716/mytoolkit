import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isPalindrome(text: string): boolean {
  const n = normalize(text)
  return n.length > 0 && n === n.split('').reverse().join('')
}

function longestPalindromicWord(text: string): string {
  const words = text.match(/\b[a-zA-Z0-9]+\b/g) ?? []
  return (
    words
      .filter((w) => isPalindrome(w) && normalize(w).length > 1)
      .sort((a, b) => b.length - a.length)[0] ?? ''
  )
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('palindrome-checker')
if (!tool) throw new Error('[ToolEngine] palindrome-checker not found in registry')

export const palindromeCheckerConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Type a word or phrase to check if it\'s a palindrome...\n\nExample: A man a plan a canal Panama',
    maxLength: 10_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter text to check.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)

    const is = isPalindrome(input)
    const normalized = normalize(input)
    const longest = longestPalindromicWord(input)

    onProgress(100)

    const items: StructuredResultItem[] = [
      {
        label: 'Is Palindrome',
        value: is ? 'Yes' : 'No',
        iconName: is ? 'CheckCircle' : 'XCircle',
        valueColorClass: is ? 'text-emerald-500' : 'text-red-500',
      },
      { label: 'Normalized Text', value: normalized },
      { label: 'Character Count', value: normalized.length },
    ]

    if (longest) {
      items.push({
        label: 'Longest Palindromic Word',
        value: longest,
        valueColorClass: 'text-primary',
      })
    }

    return items
  },
  resultType: 'structured',
  layoutMode: 'stack',
})
