import { getToolBySlug } from '@/registry'

import { defineToolConfig } from '../engine'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type ImageToBase64Input = File
export type ImageToBase64Result = string

/* ─── Config ─────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-to-base64')

if (!tool) {
  throw new Error('[ToolEngine] image-to-base64 not found in registry')
}

export const imageToBase64Config = defineToolConfig<ImageToBase64Input, ImageToBase64Result>({
  tool,
  processingMode: 'browser',
  input: {
    type: 'file',
    accept: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.gif',
      '.svg',
    ],
    maxSizeMb: 10,
  },
  process: async (file, _signal, onProgress) => {
    onProgress(20)
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
    onProgress(100)
    return base64
  },
  resultType: 'text',
  layoutMode: 'stack',
})
