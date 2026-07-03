import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function isBinaryInput(value: string): boolean {
  return /^[01 \n]+$/.test(value.trim())
}

function encodeTextToBinary(text: string): string {
  return text
    .split('')
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ')
}

function decodeBinaryToText(binary: string): string {
  const bytes = binary.trim().split(/\s+/)
  return bytes
    .map((byte) => {
      const code = parseInt(byte, 2)
      return isNaN(code) ? '?' : String.fromCharCode(code)
    })
    .join('')
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('binary-converter')
if (!tool) throw new Error('[ToolEngine] binary-converter not found in registry')

export const binaryConverterConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Type text to convert to binary, or paste binary (0s and 1s) to decode...',
    maxLength: 100_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter text or binary to convert.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const result = isBinaryInput(input) ? decodeBinaryToText(input) : encodeTextToBinary(input)
    onProgress(100)
    return result
  },
  resultType: 'text',
  layoutMode: 'split',
})
