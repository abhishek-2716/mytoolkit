import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Password Strength ──────────────────────────────────────────────────── */

interface StrengthResult {
  score: number
  label: string
  color: string
  crackTime: string
  items: StructuredResultItem[]
}

function estimateCrackTime(password: string): string {
  let charsetSize = 0
  if (/[a-z]/.test(password)) charsetSize += 26
  if (/[A-Z]/.test(password)) charsetSize += 26
  if (/[0-9]/.test(password)) charsetSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32

  if (charsetSize === 0) return 'Instant'
  const combinations = Math.pow(charsetSize, password.length)
  // Assume 10 billion guesses per second
  const seconds = combinations / 1e10

  if (seconds < 1) return 'Instant'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`
  return 'Centuries'
}

function checkPassword(password: string): StrengthResult {
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  const isLong = password.length >= 12
  const hasCommon = /^(password|123456|qwerty|abc123|letmein|monkey|master|dragon)/i.test(password)

  let score = 0
  if (hasUpper) score++
  if (hasLower) score++
  if (hasNumbers) score++
  if (hasSpecial) score++
  if (isLong) score++
  if (hasCommon) score = Math.max(0, score - 2)

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = [
    'text-destructive',
    'text-destructive',
    'text-amber-500',
    'text-amber-400',
    'text-green-500',
    'text-green-400',
  ]
  const label = labels[Math.min(score, 5)] ?? 'Very Weak'
  const color = colors[Math.min(score, 5)] ?? 'text-destructive'
  const crackTime = estimateCrackTime(password)

  const yesNo = (v: boolean) => ({ value: v ? 'Yes' : 'No', color: v ? 'text-green-500' : 'text-destructive' })

  return {
    score,
    label,
    color,
    crackTime,
    items: [
      { label: 'Strength', value: label, valueColorClass: color },
      { label: 'Length', value: `${password.length} characters`, valueColorClass: password.length >= 12 ? 'text-green-500' : password.length >= 8 ? 'text-amber-500' : 'text-destructive' },
      { label: 'Contains Uppercase', value: yesNo(hasUpper).value, valueColorClass: yesNo(hasUpper).color },
      { label: 'Contains Lowercase', value: yesNo(hasLower).value, valueColorClass: yesNo(hasLower).color },
      { label: 'Contains Numbers', value: yesNo(hasNumbers).value, valueColorClass: yesNo(hasNumbers).color },
      { label: 'Contains Special Characters', value: yesNo(hasSpecial).value, valueColorClass: yesNo(hasSpecial).color },
      { label: 'Estimated Crack Time', value: crackTime },
    ],
  }
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('password-strength-checker')
if (!tool) throw new Error('[ToolEngine] password-strength-checker not found in registry')

export const passwordStrengthConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder:
      'Enter a password to check its strength...\n\nThis tool runs entirely in your browser. Your password is never sent anywhere.',
    maxLength: 1_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter a password to analyze.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(100)
    return checkPassword(input).items
  },
  resultType: 'structured',
  layoutMode: 'stack',
})
