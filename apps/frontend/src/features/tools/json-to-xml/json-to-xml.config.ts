import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── JSON → XML conversion ──────────────────────────────────────────────── */

function jsonToXmlNode(key: string, value: unknown, indent: number): string {
  const pad = '  '.repeat(indent)

  if (value === null || value === undefined) {
    return `${pad}<${key}/>`
  }

  if (Array.isArray(value)) {
    return value.map((item) => jsonToXmlNode(key, item, indent)).join('\n')
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const attrs = Object.entries(obj)
      .filter(([k]) => k.startsWith('@'))
      .map(([k, v]) => ` ${k.slice(1)}="${v}"`)
      .join('')
    const children = Object.entries(obj)
      .filter(([k]) => !k.startsWith('@') && k !== '#text')
      .map(([k, v]) => jsonToXmlNode(k, v, indent + 1))
      .join('\n')
    const text = obj['#text'] !== undefined ? String(obj['#text']) : ''

    if (children) {
      return `${pad}<${key}${attrs}>\n${children}\n${pad}</${key}>`
    }
    return `${pad}<${key}${attrs}>${text}</${key}>`
  }

  return `${pad}<${key}>${String(value)}</${key}>`
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('json-to-xml')
if (!tool) throw new Error('[ToolEngine] json-to-xml not found in registry')

export const jsonToXmlConfig = defineToolConfig<string, string>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste JSON to convert to XML...',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter JSON to convert.', { retryable: false }))
      try {
        JSON.parse(value)
        return validInput(value)
      } catch {
        return invalidInput(createToolError('validation-error', 'Invalid JSON. Please check your input.', { retryable: false }))
      }
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const obj = JSON.parse(input) as Record<string, unknown>
    onProgress(60)
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    for (const [key, val] of Object.entries(obj)) {
      lines.push(jsonToXmlNode(key, val, 0))
    }
    onProgress(100)
    return lines.join('\n')
  },
  resultType: 'code',
  layoutMode: 'split',
})
