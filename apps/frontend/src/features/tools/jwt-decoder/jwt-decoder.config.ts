import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type JwtDecoderInput = string
export type JwtDecoderResult = StructuredResultItem[]

/* ─── Processing Logic ────────────────────────────────────────────────────── */

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

function processJwtDecoder(
  input: JwtDecoderInput,
  _signal: AbortSignal,
  onProgress: (p: number) => void,
): JwtDecoderResult {
  onProgress(20)

  const parts = input.trim().split('.')
  if (parts.length < 2 || parts.length > 3) {
    return [{ label: 'Error', value: 'Invalid JWT format. Expected header.payload.signature' }]
  }

  const [headerB64, payloadB64, signatureB64] = parts

  let headerJson: string
  let payloadJson: string

  try {
    headerJson = JSON.stringify(JSON.parse(base64UrlDecode(headerB64 ?? '')), null, 2)
  } catch {
    headerJson = '(invalid base64)'
  }

  onProgress(60)

  let expiryStatus = 'No expiry claim'
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64 ?? ''))
    payloadJson = JSON.stringify(payload, null, 2)
    if (payload.exp) {
      const exp = new Date(payload.exp * 1000)
      expiryStatus = exp < new Date() ? `Expired (${exp.toUTCString()})` : `Valid until ${exp.toUTCString()}`
    }
  } catch {
    payloadJson = '(invalid base64)'
  }

  onProgress(100)

  return [
    { label: 'Header', value: headerJson },
    { label: 'Payload', value: payloadJson },
    { label: 'Signature', value: signatureB64 ?? '(none)' },
    { label: 'Expiry', value: expiryStatus },
  ]
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('jwt-decoder')
if (!tool) throw new Error('[ToolEngine] jwt-decoder not found in registry')

export const jwtDecoderConfig = defineToolConfig<JwtDecoderInput, JwtDecoderResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Paste your JWT token here (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)',
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Please enter a JWT token.', { retryable: false }))
      if (value.trim().split('.').length < 2)
        return invalidInput(createToolError('validation-error', 'Invalid JWT — expected at least two dot-separated segments.', { retryable: false }))
      return validInput(value.trim())
    },
  },
  process: processJwtDecoder,
  resultType: 'structured',
  layoutMode: 'split',
})
