import { z } from 'zod'

import { getToolBySlug } from '@/registry'

import type { ImageResult } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Schema ─────────────────────────────────────────────────────────────── */

export const faviconGeneratorSchema = z.object({
  text: z.string().max(4),
  bgColor: z.string(),
  textColor: z.string(),
  size: z.enum(['16', '32', '48', '64', '128']),
})

export type FaviconGeneratorInput = z.infer<typeof faviconGeneratorSchema>

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

const tool = getToolBySlug('favicon-generator')
if (!tool) throw new Error('[ToolEngine] favicon-generator not found in registry')

export const faviconGeneratorConfig = defineToolConfig<FaviconGeneratorInput, ImageResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'form',
    schema: faviconGeneratorSchema,
    defaultValues: { text: '⚡', bgColor: '#6366f1', textColor: '#ffffff', size: '64' },
  },
  process: (input, _signal, onProgress) => {
    onProgress(20)
    const sz = parseInt(input.size)
    const canvas = document.createElement('canvas')
    canvas.width = sz
    canvas.height = sz
    const ctx = canvas.getContext('2d')!

    // Rounded square background
    const radius = sz * 0.2
    ctx.fillStyle = input.bgColor
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(sz - radius, 0)
    ctx.quadraticCurveTo(sz, 0, sz, radius)
    ctx.lineTo(sz, sz - radius)
    ctx.quadraticCurveTo(sz, sz, sz - radius, sz)
    ctx.lineTo(radius, sz)
    ctx.quadraticCurveTo(0, sz, 0, sz - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.fill()

    // Centered text/emoji
    const label = input.text.trim() || '?'
    const fontSize = Math.floor(sz * 0.55)
    ctx.fillStyle = input.textColor
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, sz / 2, sz / 2)

    onProgress(70)
    const dataUrl = canvas.toDataURL('image/png')
    const blob = dataUrlToBlob(dataUrl)

    onProgress(100)
    return {
      previewUrl: dataUrl,
      fileName: 'favicon.png',
      blob,
      mimeType: 'image/png',
      width: sz,
      height: sz,
      sizeBytes: blob.size,
    }
  },
  resultType: 'image',
  layoutMode: 'form',
})
