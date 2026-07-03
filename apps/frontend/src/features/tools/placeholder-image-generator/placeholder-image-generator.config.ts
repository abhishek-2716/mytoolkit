import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { ImageResult } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const placeholderImageSchema = z.object({
  width: z.number().min(1).max(4096),
  height: z.number().min(1).max(4096),
  bgColor: z.string(),
  textColor: z.string(),
  text: z.string(),
  format: z.enum(['png', 'jpeg']),
})

export type PlaceholderImageInput = z.infer<typeof placeholderImageSchema>

/* ─── dataURL → Blob ─────────────────────────────────────────────────────── */

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)![1]
  const bstr = atob(data)
  const n = bstr.length
  const u8arr = new Uint8Array(n)
  for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i)
  return new Blob([u8arr], { type: mime })
}

/* ─── Config ──────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('placeholder-image-generator')
if (!tool) throw new Error('[ToolEngine] placeholder-image-generator not found in registry')

export const placeholderImageConfig = defineToolConfig<PlaceholderImageInput, ImageResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: placeholderImageSchema,
    defaultValues: { width: 400, height: 300, bgColor: '#cccccc', textColor: '#666666', text: '', format: 'png' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const canvas = document.createElement('canvas')
    canvas.width = input.width
    canvas.height = input.height
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = input.bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Text
    const label = input.text.trim() || `${input.width}×${input.height}`
    const fontSize = Math.max(12, Math.min(48, Math.floor(Math.min(input.width, input.height) / 8)))
    ctx.fillStyle = input.textColor
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, canvas.width / 2, canvas.height / 2)

    onProgress(60)
    const mimeType = `image/${input.format}`
    const dataUrl = canvas.toDataURL(mimeType)
    const blob = dataUrlToBlob(dataUrl)
    const fileName = `placeholder-${input.width}x${input.height}.${input.format}`

    onProgress(100)
    return {
      previewUrl: dataUrl,
      fileName,
      blob,
      mimeType,
      width: input.width,
      height: input.height,
      sizeBytes: blob.size,
    }
  },
  resultType: 'image',
  layoutMode: 'form',
})
