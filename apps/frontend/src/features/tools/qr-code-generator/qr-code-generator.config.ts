import QRCode from 'qrcode'
import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { ImageResult } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const qrCodeSchema = z.object({
  text: z.string().min(1, 'Enter text or URL'),
  size: z.number().int().min(100).max(1000),
  errorLevel: z.enum(['L', 'M', 'Q', 'H']),
  darkColor: z.string(),
  lightColor: z.string(),
})

export type QrCodeInput = z.infer<typeof qrCodeSchema>
export type QrCodeResult = ImageResult

/* ─── Config ─────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('qr-code-generator')

if (!tool) {
  throw new Error('[ToolEngine] qr-code-generator not found in registry')
}

export const qrCodeConfig = defineToolConfig<QrCodeInput, QrCodeResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: qrCodeSchema,
    defaultValues: {
      text: 'https://example.com',
      size: 300,
      errorLevel: 'M',
      darkColor: '#000000',
      lightColor: '#ffffff',
    },
  },
  process: async (input, _signal, onProgress) => {
    onProgress(20)
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, input.text, {
      width: input.size,
      margin: 2,
      errorCorrectionLevel: input.errorLevel,
      color: { dark: input.darkColor, light: input.lightColor },
    })
    onProgress(80)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))), 'image/png')
    })
    onProgress(100)
    return {
      previewUrl: URL.createObjectURL(blob),
      fileName: 'qrcode.png',
      blob,
      mimeType: 'image/png',
      width: input.size,
      height: input.size,
      sizeBytes: blob.size,
    } satisfies ImageResult
  },
  resultType: 'image',
  layoutMode: 'split',
})
