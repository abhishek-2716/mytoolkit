import { getToolBySlug } from '@/registry'

import type { ImageResult } from '../engine'
import { defineToolConfig } from '../engine'

/* ─── Canvas helpers ─────────────────────────────────────────────────────── */

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const img = new Image()
    const u = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(u)
      res(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(u)
      rej(new Error('Failed to load image'))
    }
    img.src = u
  })

const toBlob = (c: HTMLCanvasElement, mime = 'image/png'): Promise<Blob> =>
  new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Blob creation failed'))), mime))

/* ─── Config ─────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-grayscale')

if (!tool) {
  throw new Error('[ToolEngine] image-grayscale not found in registry')
}

export const imageGrayscaleConfig = defineToolConfig<File, ImageResult>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'file',
    accept: ['image/jpeg', 'image/png', 'image/webp', '.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMb: 20,
  },
  process: async (file, _signal, onProgress) => {
    onProgress(20)
    const img = await loadImage(file)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!
      data[i] = data[i + 1] = data[i + 2] = gray
    }
    ctx.putImageData(imageData, 0, 0)
    onProgress(80)
    const blob = await toBlob(canvas, 'image/png')
    onProgress(100)
    const outName = file.name.replace(/\.[^.]+$/, '.png')
    return {
      previewUrl: URL.createObjectURL(blob),
      fileName: `grayscale_${outName}`,
      blob,
      mimeType: 'image/png',
      width: canvas.width,
      height: canvas.height,
      sizeBytes: blob.size,
    }
  },
  resultType: 'image',
  layoutMode: 'stack',
})
