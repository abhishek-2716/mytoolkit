import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Extract Emails ─────────────────────────────────────────────────────── */

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g

function extractEmails(text: string): string {
  const matches = text.match(EMAIL_REGEX) ?? []
  const unique = Array.from(new Set(matches))
  if (unique.length === 0) return 'No email addresses found in the provided text.'
  return `Found ${unique.length} email address${unique.length === 1 ? '' : 'es'}:\n\n${unique.join('\n')}`
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('extract-emails')
if (!tool) throw new Error('[ToolEngine] extract-emails not found in registry')

export const extractEmailsConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder:
      'Paste any text containing email addresses...\n\nThe tool will extract all email addresses it finds.',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter text to extract emails from.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = extractEmails(input)
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
