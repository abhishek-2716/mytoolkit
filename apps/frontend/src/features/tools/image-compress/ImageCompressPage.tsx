import { useCallback, useId, useRef, useState } from 'react'
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

const canvasToBlob = (c: HTMLCanvasElement, mime: string, q = 0.92): Promise<Blob> =>
  new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Blob creation failed'))), mime, q))

/* ─── Types ──────────────────────────────────────────────────────────────── */

type OutputFormat = 'image/jpeg' | 'image/webp'

interface ResultState {
  url: string
  name: string
  size: number
  originalSize: number
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-compress')

export default function ImageCompressPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [result, setResult] = useState<ResultState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const qualityId = useId()

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f?.type.startsWith('image/')) handleFile(f)
    },
    [handleFile]
  )

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    try {
      const img = await loadImage(file)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const blob = await canvasToBlob(canvas, format, quality / 100)
      const ext = format === 'image/jpeg' ? 'jpg' : 'webp'
      const url = URL.createObjectURL(blob)
      setResult({
        url,
        name: `compressed_${file.name.replace(/\.[^.]+$/, `.${ext}`)}`,
        size: blob.size,
        originalSize: file.size,
      })
    } catch {
      setError('Failed to compress image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const savings = result ? Math.round((1 - result.size / result.originalSize) * 100) : 0

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'Image Compressor'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Compress images without visible quality loss.'}</p>
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
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <UploadCloudIcon className="w-8 h-8 text-foreground-muted" />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-foreground-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop image here or click to browse</p>
                  <p className="text-xs text-foreground-muted">JPG, PNG, WebP supported</p>
                </div>
              )}
            </div>

            {/* Quality slider */}
            <div>
              <label htmlFor={qualityId} className="block text-sm font-medium text-foreground mb-1.5">
                Quality: {quality}%
              </label>
              <input
                id={qualityId}
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-foreground-muted mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* Format select */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Compressing…' : 'Compress Image'}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {result ? (
              <div className="flex flex-col h-full">
                <img src={result.url} alt="Compressed result" className="w-full object-contain max-h-64" />
                <div className="p-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-background px-2 py-2">
                      <p className="text-xs text-foreground-muted">Original</p>
                      <p className="text-sm font-semibold text-foreground">{(result.originalSize / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="rounded-lg bg-background px-2 py-2">
                      <p className="text-xs text-foreground-muted">Compressed</p>
                      <p className="text-sm font-semibold text-foreground">{(result.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 px-2 py-2">
                      <p className="text-xs text-foreground-muted">Saved</p>
                      <p className="text-sm font-semibold text-primary">{savings}%</p>
                    </div>
                  </div>
                  <a
                    href={result.url}
                    download={result.name}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-48 p-8 text-center">
                <p className="text-sm text-foreground-muted">Compressed image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
