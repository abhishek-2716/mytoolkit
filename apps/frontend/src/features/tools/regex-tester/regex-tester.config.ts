import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema + Types ─────────────────────────────────────────────────────── */

export const regexTesterSchema = z.object({
  pattern: z.string().min(1),
  flags: z.string(),
  testString: z.string(),
})

export type RegexTesterInput = z.infer<typeof regexTesterSchema>
export type RegexTesterResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processRegexTester(
  input: RegexTesterInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): RegexTesterResult {
  onProgress(20)

  let regex: RegExp
  try {
    regex = new RegExp(input.pattern, input.flags.includes('g') ? input.flags : input.flags + 'g')
  } catch {
    onProgress(100)
    return [
      { label: 'Is Valid Regex', value: 'No', valueColorClass: 'text-destructive' },
      { label: 'Error', value: 'Invalid regular expression pattern.' },
    ]
  }

  const matches = Array.from(input.testString.matchAll(regex))
  const groups = matches.flatMap((m) =>
    m.slice(1).map((g, i) => `Group ${i + 1}: ${g ?? 'undefined'}`)
  )

  onProgress(100)

  return [
    { label: 'Is Valid Regex', value: 'Yes', valueColorClass: 'text-green-500' },
    { label: 'Match Count', value: matches.length, valueColorClass: matches.length > 0 ? 'text-primary' : 'text-foreground-muted' },
    { label: 'All Matches', value: matches.length > 0 ? matches.map((m) => m[0]).join(', ') : '(none)' },
    ...(groups.length > 0 ? [{ label: 'Capture Groups', value: groups.join(' | ') }] : []),
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('regex-tester')
if (!tool) throw new Error('[ToolEngine] regex-tester not found in registry')

export const regexTesterConfig = defineToolConfig<RegexTesterInput, RegexTesterResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: regexTesterSchema,
    defaultValues: { pattern: '\\b\\w+@\\w+\\.\\w+\\b', flags: 'gi', testString: 'Contact us at hello@example.com or support@test.org' },
  },
  process: processRegexTester,
  resultType: 'structured',
  layoutMode: 'split',
})
