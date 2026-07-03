import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── UUID Validator ─────────────────────────────────────────────────────── */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function detectVersion(uuid: string): string {
  const parts = uuid.split('-')
  const versionChar = parts[2]?.[0]
  if (!versionChar) return 'Unknown'
  const v = parseInt(versionChar, 16)
  if (v >= 1 && v <= 5) return `v${v}`
  return 'Unknown'
}

function detectVariant(uuid: string): string {
  const parts = uuid.split('-')
  const variantChar = parts[3]?.[0]
  if (!variantChar) return 'Unknown'
  const bits = parseInt(variantChar, 16)
  if ((bits & 0b1100) === 0b1100) return 'Reserved (Microsoft)'
  if ((bits & 0b1110) === 0b1110) return 'Reserved (Future)'
  if ((bits & 0b1000) === 0b1000) return 'RFC 4122'
  return 'NCS (backward compatibility)'
}

function processUuidValidator(input: string): StructuredResultItem[] {
  const firstLine = input.split('\n')[0]?.trim() ?? ''
  const uuid = firstLine.trim()
  const isValid = UUID_REGEX.test(uuid)

  if (!isValid) {
    return [
      { label: 'Valid', value: 'No', valueColorClass: 'text-destructive' },
      { label: 'Input', value: uuid || '(empty)', valueColorClass: 'text-foreground-muted' },
      { label: 'Expected Format', value: 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx' },
    ]
  }

  const formatted = uuid.toLowerCase()
  return [
    { label: 'Valid', value: 'Yes', valueColorClass: 'text-green-500' },
    { label: 'UUID', value: formatted },
    { label: 'Version', value: detectVersion(uuid) },
    { label: 'Variant', value: detectVariant(uuid) },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('uuid-validator')
if (!tool) throw new Error('[ToolEngine] uuid-validator not found in registry')

export const uuidValidatorConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Enter a UUID to validate...\n\nExample: 550e8400-e29b-41d4-a716-446655440000',
    maxLength: 1_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter a UUID to validate.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(100)
    return processUuidValidator(input)
  },
  resultType: 'structured',
  layoutMode: 'stack',
})
