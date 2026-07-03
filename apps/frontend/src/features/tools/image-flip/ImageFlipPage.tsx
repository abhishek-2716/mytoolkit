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

type FlipDirection = 'horizontal' | 'vertical'

interface ResultState {
  url: string
  name: string
  size: number
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-flip')

export default function ImageFlipPage() {
  const [file, setFile] = useState<File | null>(null)
  const [direction, setDirection] = useState<FlipDirection>('horizontal')
  const [result, setResult] = useState<ResultState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      ctx.scale(direction === 'horizontal' ? -1 : 1, direction === 'vertical' ? -1 : 1)
      ctx.drawImage(img, direction === 'horizontal' ? -canvas.width : 0, direction === 'vertical' ? -canvas.height : 0)
      const blob = await canvasToBlob(canvas, 'image/png')
      const url = URL.createObjectURL(blob)
      setResult({ url, name: `flipped_${file.name.replace(/\.[^.]+$/, '.png')}`, size: blob.size })
    } catch {
      setError('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'Flip Image'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Flip images horizontally or vertically.'}</p>
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
                  <p className="text-xs text-foreground-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop image here or click to browse</p>
                  <p className="text-xs text-foreground-muted">JPG, PNG, WebP supported</p>
                </div>
              )}
            </div>

            {/* Direction selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Flip Direction</label>
              <div className="flex gap-2">
                {(['horizontal', 'vertical'] as const).map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setDirection(dir)}
                    className={[
                      'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors capitalize',
                      direction === dir
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:border-primary/60',
                    ].join(' ')}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Processing…' : 'Flip Image'}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {result ? (
              <div className="flex flex-col h-full">
                <img src={result.url} alt="Flipped result" className="w-full object-contain max-h-80" />
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{result.name}</p>
                    <p className="text-xs text-foreground-muted">{(result.size / 1024).toFixed(1)} KB</p>
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
                <p className="text-sm text-foreground-muted">Flipped image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
