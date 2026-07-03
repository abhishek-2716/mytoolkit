import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type JsonToYamlInput = string
export type JsonToYamlResult = string

/* ─── JSON → YAML Serializer ─────────────────────────────────────────────── */

function jsonToYaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)

  if (value === null) return 'null'
  if (value === undefined) return 'null'

  if (typeof value === 'boolean') return value ? 'true' : 'false'

  if (typeof value === 'number') {
    return isFinite(value) ? String(value) : 'null'
  }

  if (typeof value === 'string') {
    // Quote strings that need it
    if (
      value === '' ||
      value === 'null' || value === 'true' || value === 'false' ||
      /^\s/.test(value) || /\s$/.test(value) ||
      value.includes(':') || value.includes('#') || value.includes('\n') ||
      /^[-?|>!'"{}[\],&*#@`]/.test(value) ||
      /^\d/.test(value) || /^0x/i.test(value)
    ) {
      return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
    }
    return value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const lines = value.map((item) => {
      const serialized = jsonToYaml(item, indent + 1)
      if (serialized.includes('\n')) {
        return `${pad}- ${serialized.replace(/\n/g, `\n${pad}  `)}`
      }
      return `${pad}- ${serialized}`
    })
    return '\n' + lines.join('\n')
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'

    const lines = keys.map((key) => {
      const v = obj[key]
      const yamlKey = /[:#[\]{},&*?|<>=!%@`]/.test(key) || key.includes(' ') || key === '' ? `"${key}"` : key
      const serialized = jsonToYaml(v, indent + 1)

      if (typeof v === 'object' && v !== null) {
        if (Array.isArray(v) && v.length > 0) {
          return `${pad}${yamlKey}:${serialized}`
        }
        if (!Array.isArray(v) && Object.keys(v).length > 0) {
          return `${pad}${yamlKey}:\n${serialized}`
        }
      }
      return `${pad}${yamlKey}: ${serialized}`
    })
    return lines.join('\n')
  }

  // Fallback: should not reach here for valid JSON values
  return JSON.stringify(value)
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processJsonToYaml(
  input: JsonToYamlInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): JsonToYamlResult {
  onProgress(20)

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      `Invalid JSON: ${(e as SyntaxError).message}`,
      { retryable: false }
    )
  }

  onProgress(70)

  const yaml = jsonToYaml(parsed, 0)
  // Remove leading newline if present
  const result = yaml.startsWith('\n') ? yaml.slice(1) : yaml

  onProgress(100)
  return result
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-to-yaml')

if (!tool) {
  throw new Error('[ToolEngine] json-to-yaml not found in registry')
}

export const jsonToYamlConfig = defineToolConfig<JsonToYamlInput, JsonToYamlResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste JSON here to convert to YAML...\n\nExample: {"name":"Alice","age":30,"tags":["admin","user"]}',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some JSON to convert.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processJsonToYaml,

  resultType: 'code',
  layoutMode: 'split',
})
