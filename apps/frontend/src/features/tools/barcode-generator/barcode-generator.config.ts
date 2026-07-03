import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { ImageResult } from '../engine'
import { createToolError, defineToolConfig } from '../engine'

/* ─── Schema ──────────────────────────────────────────────────────────────── */

export const barcodeGeneratorSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500),
  format: z.enum(['CODE128', 'CODE39', 'EAN13', 'UPC']),
  width: z.number().min(1).max(4),
  height: z.number().min(20).max(200),
  showValue: z.boolean(),
})

export type BarcodeGeneratorInput = z.infer<typeof barcodeGeneratorSchema>

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('barcode-generator')
if (!tool) throw new Error('[ToolEngine] barcode-generator not found in registry')

export const barcodeGeneratorConfig = defineToolConfig<BarcodeGeneratorInput, ImageResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: barcodeGeneratorSchema,
    defaultValues: { text: 'Hello World', format: 'CODE128', width: 2, height: 80, showValue: true },
  },
  process: async (input, _signal, onProgress) => {
    onProgress(20)
    // Validate format-specific requirements
    if (input.format === 'EAN13' && !/^\d{12}$/.test(input.text))
      throw createToolError('validation-error', 'EAN-13 requires exactly 12 digits.', { retryable: false })
    if (input.format === 'UPC' && !/^\d{11}$/.test(input.text))
      throw createToolError('validation-error', 'UPC requires exactly 11 digits.', { retryable: false })

    const JsBarcode = (await import('jsbarcode')).default
    onProgress(50)

    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, input.text, {
        format: input.format,
        width: input.width,
        height: input.height,
        displayValue: input.showValue,
        margin: 10,
      })
      onProgress(80)
      const dataUrl = canvas.toDataURL('image/png')

      // Convert dataUrl to Blob
      const arr = dataUrl.split(',')
      const mimeMatch = arr[0]!.match(/:(.*?);/)
      const mime = mimeMatch ? mimeMatch[1]! : 'image/png'
      const bstr = atob(arr[1]!)
      const n = bstr.length
      const u8arr = new Uint8Array(n)
      for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i)
      const blob = new Blob([u8arr], { type: mime })

      onProgress(100)
      return {
        previewUrl: dataUrl,
        fileName: 'barcode.png',
        blob,
        mimeType: 'image/png',
        width: canvas.width,
        height: canvas.height,
        sizeBytes: blob.size,
      }
    } catch (err) {
      throw createToolError(
        'processing-error',
        err instanceof Error ? err.message : 'Failed to generate barcode. Check your input for the selected format.',
        { retryable: false },
      )
    }
  },
  resultType: 'image',
  layoutMode: 'split',
})
