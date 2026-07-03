import { useCallback, useRef, useState } from 'react'
import { DownloadIcon, UploadCloudIcon } from 'lucide-react'

import { getToolBySlug } from '@/registry'

/* ─── Canvas helpers ─────────────────────────────────────────────────────── */

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const img = new Image()
    const u = URL.createObjectURL(file)
    img.onload = () => { URL.revokeObjectURL(u); res(img) }
    img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('Failed to load image')) }
    img.src = u
  })

const canvasToBlob = (c: HTMLCanvasElement, mime: string): Promise<Blob> =>
  new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Blob creation failed'))), mime))

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ResultState {
  url: string
  name: string
  size: number
  width: number
  height: number
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-resize')

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [lockRatio, setLockRatio] = useState(true)
  const [result, setResult] = useState<ResultState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    try {
      const img = await loadImage(f)
      setOrigW(img.width)
      setOrigH(img.height)
      setWidth(String(img.width))
      setHeight(String(img.height))
    } catch {
      setError('Failed to read image dimensions.')
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f?.type.startsWith('image/')) handleFile(f)
    },
    [handleFile]
  )

  const handleWidthChange = (val: string) => {
    setWidth(val)
    if (lockRatio && origW && origH) {
      const w = parseInt(val, 10)
      if (!isNaN(w) && w > 0) setHeight(String(Math.round((w / origW) * origH)))
    }
  }

  const handleHeightChange = (val: string) => {
    setHeight(val)
    if (lockRatio && origW && origH) {
      const h = parseInt(val, 10)
      if (!isNaN(h) && h > 0) setWidth(String(Math.round((h / origH) * origW)))
    }
  }

  const handleProcess = async () => {
    if (!file) return
    const targetW = parseInt(width, 10)
    const targetH = parseInt(height, 10)
    if (!targetW || !targetH || targetW < 1 || targetH < 1) {
      setError('Please enter valid width and height values.')
      return
    }
    setIsProcessing(true)
    setError(null)
    try {
      const img = await loadImage(file)
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, targetW, targetH)
      const blob = await canvasToBlob(canvas, 'image/png')
      const url = URL.createObjectURL(blob)
      setResult({ url, name: `resized_${file.name.replace(/\.[^.]+$/, '.png')}`, size: blob.size, width: targetW, height: targetH })
    } catch {
      setError('Failed to resize image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'Image Resizer'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Resize images by pixels or percentage.'}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <UploadCloudIcon className="w-8 h-8 text-foreground-muted" />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {origW} × {origH}px · {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop image here or click to browse</p>
                  <p className="text-xs text-foreground-muted">JPG, PNG, WebP supported</p>
                </div>
              )}
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  min={1}
                  disabled={!file || isProcessing}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  min={1}
                  disabled={!file || isProcessing}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Lock ratio */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">Maintain aspect ratio</span>
            </label>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Resizing…' : 'Resize Image'}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {result ? (
              <div className="flex flex-col h-full">
                <img src={result.url} alt="Resized result" className="w-full object-contain max-h-64" />
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{result.name}</p>
                    <p className="text-xs text-foreground-muted">
                      {result.width} × {result.height}px · {(result.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <a
                    href={result.url}
                    download={result.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-48 p-8 text-center">
                <p className="text-sm text-foreground-muted">Resized image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
