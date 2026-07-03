import { useCallback, useId, useRef, useState } from 'react'
import { DownloadIcon, UploadCloudIcon } from 'lucide-react'

import { getToolBySlug } from '@/registry'

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const img = new Image()
    const u = URL.createObjectURL(file)
    img.onload = () => { URL.revokeObjectURL(u); res(img) }
    img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('Failed to load image')) }
    img.src = u
  })

/* ─── Types ──────────────────────────────────────────────────────────────── */

type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'

interface ResultState { url: string; name: string }

/* ─── Constants ──────────────────────────────────────────────────────────── */

const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-watermark')

export default function ImageWatermarkPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('© 2026')
  const [position, setPosition] = useState<WatermarkPosition>('bottom-right')
  const [fontSize, setFontSize] = useState(24)
  const [opacity, setOpacity] = useState(60)
  const [color, setColor] = useState('#ffffff')
  const [result, setResult] = useState<ResultState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const textId = useId()
  const fontSizeId = useId()
  const opacityId = useId()

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
    [handleFile],
  )

  const handleProcess = async () => {
    if (!file || !text.trim()) return
    setIsProcessing(true)
    setError(null)
    try {
      const img = await loadImage(file)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      ctx.save()
      ctx.globalAlpha = opacity / 100
      ctx.fillStyle = color
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textBaseline = 'middle'

      const textWidth = ctx.measureText(text).width
      const padding = 20
      let x = 0
      let y = 0

      switch (position) {
        case 'bottom-right':
          x = canvas.width - textWidth - padding
          y = canvas.height - fontSize - padding
          break
        case 'bottom-left':
          x = padding
          y = canvas.height - fontSize - padding
          break
        case 'top-right':
          x = canvas.width - textWidth - padding
          y = fontSize + padding
          break
        case 'top-left':
          x = padding
          y = fontSize + padding
          break
        case 'center':
          x = (canvas.width - textWidth) / 2
          y = canvas.height / 2
          break
      }

      ctx.fillText(text, x, y)
      ctx.restore()

      const url = canvas.toDataURL('image/png')
      setResult({ url, name: `watermarked_${file.name}` })
    } catch {
      setError('Failed to add watermark. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'Image Watermark'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Add text watermarks to images.'}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
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

            <div>
              <label htmlFor={textId} className={LABEL_CLASS}>Watermark Text</label>
              <input
                id={textId}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="© 2026"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={fontSizeId} className={LABEL_CLASS}>Font Size: {fontSize}px</label>
                <input
                  id={fontSizeId}
                  type="range"
                  min={10}
                  max={120}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label htmlFor={opacityId} className={LABEL_CLASS}>Opacity: {opacity}%</label>
                <input
                  id={opacityId}
                  type="range"
                  min={10}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>Text Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-14 rounded-lg border border-border bg-background cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleProcess}
              disabled={!file || !text.trim() || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Adding Watermark…' : 'Add Watermark'}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {result ? (
              <div className="flex flex-col h-full">
                <img src={result.url} alt="Watermarked result" className="w-full object-contain max-h-72" />
                <div className="p-4 border-t border-border">
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
                <p className="text-sm text-foreground-muted">Watermarked image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
