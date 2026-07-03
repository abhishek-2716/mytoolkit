import { getToolBySlug } from '@/registry'

import type { StructuredResultItem } from '../engine'
import { createToolError, defineToolConfig, invalidInput, validInput } from '../engine'

/* ─── IP Validation ──────────────────────────────────────────────────────── */

function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every((p) => {
    const n = Number(p)
    return /^\d+$/.test(p) && n >= 0 && n <= 255
  })
}

function isValidIPv6(ip: string): boolean {
  // Simplified IPv6 validation
  if (ip === '::') return true
  const full = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  const compressed = /^(([0-9a-fA-F]{1,4}:)*)?::?(([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4})?$/
  return full.test(ip) || compressed.test(ip)
}

function getIPv4Type(ip: string): string {
  const [a, b] = ip.split('.').map(Number)
  if (a === 127) return 'Loopback'
  if (a === 10) return 'Private (Class A)'
  if (a === 172 && b >= 16 && b <= 31) return 'Private (Class B)'
  if (a === 192 && b === 168) return 'Private (Class C)'
  if (a >= 224 && a <= 239) return 'Multicast'
  if (a === 169 && b === 254) return 'Link-local'
  if (a === 0) return 'Reserved'
  if (a === 255) return 'Broadcast'
  return 'Public'
}

function getIPv6Type(ip: string): string {
  if (ip === '::1') return 'Loopback'
  if (ip.startsWith('fe80:') || ip.startsWith('FE80:')) return 'Link-local'
  if (ip.startsWith('fc') || ip.startsWith('fd')) return 'Unique Local'
  if (ip.startsWith('ff') || ip.startsWith('FF')) return 'Multicast'
  return 'Global Unicast'
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('ip-address-validator')
if (!tool) throw new Error('[ToolEngine] ip-address-validator not found in registry')

export const ipAddressValidatorConfig = defineToolConfig<string, StructuredResultItem[]>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'text',
    placeholder: 'Enter an IP address to validate...\n\nExamples: 192.168.1.1, ::1, 2001:db8::1',
    maxLength: 100,
    validate: (value) => {
      if (!value.trim())
        return invalidInput(createToolError('validation-error', 'Enter an IP address.', { retryable: false }))
      return validInput(value)
    },
  },
  process: (input, _signal, onProgress) => {
    onProgress(50)
    const ip = input.trim()
    const isV4 = isValidIPv4(ip)
    const isV6 = isValidIPv6(ip)
    const isValid = isV4 || isV6
    const version = isV4 ? 'IPv4' : isV6 ? 'IPv6' : 'Unknown'
    const type = isV4 ? getIPv4Type(ip) : isV6 ? getIPv6Type(ip) : 'N/A'

    onProgress(100)
    return [
      { label: 'IP Address', value: ip },
      {
        label: 'Valid',
        value: isValid ? 'Yes' : 'No',
        iconName: isValid ? 'CheckCircle' : 'XCircle',
        valueColorClass: isValid ? 'text-emerald-500' : 'text-red-500',
      },
      { label: 'Version', value: version, valueColorClass: isValid ? 'text-primary' : 'text-foreground-muted' },
      { label: 'Type', value: type },
    ]
  },
  resultType: 'structured',
  layoutMode: 'stack',
})
