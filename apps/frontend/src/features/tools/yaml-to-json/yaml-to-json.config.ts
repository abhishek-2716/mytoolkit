import { getToolBySlug } from '@/registry'

import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type YamlToJsonInput = string
export type YamlToJsonResult = string

/* ─── Lightweight YAML Parser ────────────────────────────────────────────── */

/**
 * Parses a subset of YAML sufficient for common JSON-derived YAML:
 * - Scalars (string, number, boolean, null)
 * - Mappings (key: value)
 * - Sequences (- item)
 * - Nested structures via indentation
 * - Quoted strings (single and double)
 * Does NOT support anchors, aliases, multi-document, or advanced YAML features.
 */

interface ParseContext {
  lines: string[]
  index: number
}

function getIndent(line: string): number {
  return line.length - line.trimStart().length
}

function parseScalar(raw: string): unknown {
  const trimmed = raw.trim()

  // Null
  if (trimmed === '' || trimmed === 'null' || trimmed === '~') return null
  // Boolean
  if (trimmed === 'true' || trimmed === 'yes' || trimmed === 'on') return true
  if (trimmed === 'false' || trimmed === 'no' || trimmed === 'off') return false
  // Double-quoted string
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
  }
  // Single-quoted string
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'")
  }
  // Number
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    const num = Number(trimmed)
    if (!isNaN(num)) return num
  }
  // Hex
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    return parseInt(trimmed, 16)
  }

  return trimmed
}

function parseBlock(ctx: ParseContext, minIndent: number): unknown {
  const lines = ctx.lines

  // Skip empty/comment lines
  while (ctx.index < lines.length) {
    const line = lines[ctx.index] ?? ''
    if (line.trim() === '' || line.trim().startsWith('#')) {
      ctx.index++
      continue
    }
    break
  }

  if (ctx.index >= lines.length) return null

  const firstLine = lines[ctx.index] ?? ''
  const firstIndent = getIndent(firstLine)

  if (firstIndent < minIndent) return null

  const trimmed = firstLine.trim()

  // Sequence
  if (trimmed.startsWith('- ') || trimmed === '-') {
    const arr: unknown[] = []
    while (ctx.index < lines.length) {
      const line = lines[ctx.index] ?? ''
      if (line.trim() === '' || line.trim().startsWith('#')) { ctx.index++; continue }
      const indent = getIndent(line)
      if (indent < firstIndent) break
      if (!line.trim().startsWith('-')) break

      const content = line.trim().slice(1).trim()
      ctx.index++

      if (content === '') {
        // Block child follows
        arr.push(parseBlock(ctx, firstIndent + 2))
      } else if (content.includes(': ') || content.endsWith(':')) {
        // Inline mapping after dash — parse as single-key mapping
        const mapCtx: ParseContext = { lines: [content, ...lines.slice(ctx.index)], index: 0 }
        const item = parseBlock(mapCtx, 0)
        // advance ctx.index by how many lines mapCtx consumed
        ctx.index += mapCtx.index
        arr.push(item)
      } else {
        arr.push(parseScalar(content))
      }
    }
    return arr
  }

  // Mapping
  if (trimmed.includes(': ') || trimmed.endsWith(':')) {
    const obj: Record<string, unknown> = {}
    while (ctx.index < lines.length) {
      const line = lines[ctx.index] ?? ''
      if (line.trim() === '' || line.trim().startsWith('#')) { ctx.index++; continue }
      const indent = getIndent(line)
      if (indent < firstIndent) break
      if (indent > firstIndent) { ctx.index++; continue } // unexpected deeper indent

      const colonIdx = line.indexOf(': ')
      const colonEndIdx = line.indexOf(':')
      let key: string
      let valueStr: string

      if (colonIdx !== -1) {
        key = line.slice(0, colonIdx).trim()
        valueStr = line.slice(colonIdx + 2).trim()
      } else if (colonEndIdx !== -1 && line.trim().endsWith(':')) {
        key = line.trim().slice(0, -1).trim()
        valueStr = ''
      } else {
        ctx.index++
        continue
      }

      // Strip quotes from key
      if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1)
      if (key.startsWith("'") && key.endsWith("'")) key = key.slice(1, -1)

      ctx.index++

      if (valueStr === '' || valueStr.startsWith('#')) {
        // Block value on next line(s)
        obj[key] = parseBlock(ctx, firstIndent + 2)
      } else if (valueStr.startsWith('[')) {
        // Inline array
        try { obj[key] = JSON.parse(valueStr.replace(/'/g, '"')) } catch { obj[key] = valueStr }
      } else if (valueStr.startsWith('{')) {
        // Inline object
        try { obj[key] = JSON.parse(valueStr.replace(/'/g, '"')) } catch { obj[key] = valueStr }
      } else {
        obj[key] = parseScalar(valueStr)
      }
    }
    return Object.keys(obj).length > 0 ? obj : null
  }

  // Bare scalar
  ctx.index++
  return parseScalar(trimmed)
}

function parseYaml(yaml: string): unknown {
  const lines = yaml.split('\n')
  const ctx: ParseContext = { lines, index: 0 }
  const result = parseBlock(ctx, 0)
  return result
}

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function processYamlToJson(
  input: YamlToJsonInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void
): YamlToJsonResult {
  onProgress(20)

  let parsed: unknown
  try {
    parsed = parseYaml(input)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      `Failed to parse YAML: ${String(e)}`,
      { retryable: false }
    )
  }

  if (parsed === null || parsed === undefined) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw createToolError(
      'validation-error',
      'Could not parse YAML. Please check your input.',
      { retryable: false }
    )
  }

  onProgress(80)

  const json = JSON.stringify(parsed, null, 2)

  onProgress(100)
  return json
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('yaml-to-json')

if (!tool) {
  throw new Error('[ToolEngine] yaml-to-json not found in registry')
}

export const yamlToJsonConfig = defineToolConfig<YamlToJsonInput, YamlToJsonResult>({
  tool,
  processingMode: 'browser',

  input: {
    type: 'text',
    placeholder: 'Paste YAML here to convert to JSON...\n\nExample:\nname: Alice\nage: 30\ntags:\n  - admin\n  - user',
    maxLength: 500_000,
    validate: (value) => {
      if (!value.trim()) {
        return invalidInput(
          createToolError('validation-error', 'Please enter some YAML to convert.', {
            retryable: false,
          })
        )
      }
      return validInput(value)
    },
  },

  process: processYamlToJson,

  resultType: 'json',
  layoutMode: 'split',
})
