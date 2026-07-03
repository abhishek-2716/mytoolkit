import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── UUID Decoder ───────────────────────────────────────────────────────── */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// UUID v1 timestamp: 100-nanosecond intervals since Oct 15, 1582
const GREGORIAN_OFFSET = BigInt('122192928000000000')

function decodeUuidV1Timestamp(uuid: string): string {
  const parts = uuid.replace(/-/g, '')
  // time_low = parts[0..7], time_mid = parts[8..11], time_hi_and_version = parts[12..15]
  const timeLow = parts.slice(0, 8)
  const timeMid = parts.slice(8, 12)
  const timeHigh = parts.slice(12, 16).replace(/^1/, '') // strip version nibble

  const timeHex = timeHigh + timeMid + timeLow
  const timestamp100ns = BigInt('0x' + timeHex)
  const unixMs = (timestamp100ns - GREGORIAN_OFFSET) / BigInt(10000)
  const date = new Date(Number(unixMs))
  return date.toISOString()
}

function processUuidDecoder(input: string): StructuredResultItem[] {
  const uuid = input.trim().split('\n')[0]?.trim() ?? ''

  if (!UUID_REGEX.test(uuid)) {
    return [
      { label: 'Valid', value: 'No', valueColorClass: 'text-destructive' },
      { label: 'Error', value: 'Not a valid UUID (8-4-4-4-12 hex format required)' },
    ]
  }

  const lower = uuid.toLowerCase()
  const parts = lower.split('-')
  const version = parseInt(parts[2]?.[0] ?? '0', 16)

  const items: StructuredResultItem[] = [
    { label: 'Valid', value: 'Yes', valueColorClass: 'text-green-500' },
    { label: 'Version', value: `v${version}` },
    { label: 'Time Low', value: parts[0] ?? '' },
    { label: 'Time Mid', value: parts[1] ?? '' },
    { label: 'Time High + Version', value: parts[2] ?? '' },
    { label: 'Clock Seq + Variant', value: parts[3] ?? '' },
    { label: 'Node', value: parts[4] ?? '' },
  ]

  if (version === 1) {
    try {
      const ts = decodeUuidV1Timestamp(lower)
      items.push({ label: 'Timestamp (v1)', value: ts })
      items.push({ label: 'Node ID', value: parts[4] ?? '' })
    } catch {
      items.push({ label: 'Timestamp', value: 'Unable to decode' })
    }
  } else if (version === 4) {
    items.push({ label: 'Description', value: 'Version 4 is randomly generated — no decodable timestamp or node data.' })
  } else if (version === 3 || version === 5) {
    items.push({ label: 'Description', value: `Version ${version} is name-based (${version === 3 ? 'MD5' : 'SHA-1'} hash) — no timestamp data.` })
  }

  return items
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('uuid-decoder')
if (!tool) throw new Error('[ToolEngine] uuid-decoder not found in registry')

export const uuidDecoderConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Enter a UUID to decode and analyze...\n\nExample: 550e8400-e29b-41d4-a716-446655440000',
    maxLength: 1_000,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter a UUID to decode.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(100)
    return processUuidDecoder(input)
  },
  resultType: 'structured',
  layoutMode: 'stack',
})
