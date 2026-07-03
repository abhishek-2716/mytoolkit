import { useCallback, useEffect, useId, useRef, useState } from 'react'
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

/* ─── Constants ──────────────────────────────────────────────────────────── */

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('image-crop')

interface CropParams { x: number; y: number; width: number; height: number }
interface ResultState { url: string; name: string; width: number; height: number }

export default function ImageCropPage() {
  const [file, setFile] = useState<File | null>(null)
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null)
  const [crop, setCrop] = useState<CropParams>({ x: 0, y: 0, width: 100, height: 100 })
  const [result, setResult] = useState<ResultState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const xId = useId()
  const yId = useId()
  const wId = useId()
  const hId = useId()

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
    try {
      const img = await loadImage(f)
      setImgDims({ w: img.naturalWidth, h: img.naturalHeight })
      setCrop({ x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight })
    } catch {
      setError('Failed to load image.')
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f?.type.startsWith('image/')) handleFile(f)
    },
    [handleFile],
  )

  // Clamp crop values when image dimensions change
  useEffect(() => {
    if (!imgDims) return
    setCrop((c) => ({
      x: Math.max(0, Math.min(c.x, imgDims.w - 1)),
      y: Math.max(0, Math.min(c.y, imgDims.h - 1)),
      width: Math.max(1, Math.min(c.width, imgDims.w - c.x)),
      height: Math.max(1, Math.min(c.height, imgDims.h - c.y)),
    }))
  }, [imgDims])

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    try {
      const img = await loadImage(file)
      const sx = Math.max(0, crop.x)
      const sy = Math.max(0, crop.y)
      const sw = Math.max(1, Math.min(crop.width, img.naturalWidth - sx))
      const sh = Math.max(1, Math.min(crop.height, img.naturalHeight - sy))
      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
      const url = canvas.toDataURL('image/png')
      setResult({ url, name: `cropped_${file.name}`, width: sw, height: sh })
    } catch {
      setError('Failed to crop image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const updateCrop = (key: keyof CropParams, val: number) => {
    setCrop((c) => ({ ...c, [key]: Math.max(0, val) }))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'Image Crop'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Crop images to a specific region.'}</p>
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
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <UploadCloudIcon className="w-8 h-8 text-foreground-muted" />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  {imgDims && (
                    <p className="text-xs text-foreground-muted">{imgDims.w} × {imgDims.h} px</p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop image here or click to browse</p>
                  <p className="text-xs text-foreground-muted">JPG, PNG, WebP, GIF supported</p>
                </div>
              )}
            </div>

            {imgDims && (
              <p className="text-xs text-foreground-muted">
                Original dimensions: <span className="font-medium text-foreground">{imgDims.w} × {imgDims.h} px</span>
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={xId} className={LABEL_CLASS}>X Offset (px)</label>
                <input
                  id={xId}
                  type="number"
                  min={0}
                  max={imgDims ? imgDims.w - 1 : undefined}
                  value={crop.x}
                  onChange={(e) => updateCrop('x', Number(e.target.value))}
                  disabled={!file || isProcessing}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor={yId} className={LABEL_CLASS}>Y Offset (px)</label>
                <input
                  id={yId}
                  type="number"
                  min={0}
                  max={imgDims ? imgDims.h - 1 : undefined}
                  value={crop.y}
                  onChange={(e) => updateCrop('y', Number(e.target.value))}
                  disabled={!file || isProcessing}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor={wId} className={LABEL_CLASS}>Width (px)</label>
                <input
                  id={wId}
                  type="number"
                  min={1}
                  max={imgDims ? imgDims.w : undefined}
                  value={crop.width}
                  onChange={(e) => updateCrop('width', Number(e.target.value))}
                  disabled={!file || isProcessing}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor={hId} className={LABEL_CLASS}>Height (px)</label>
                <input
                  id={hId}
                  type="number"
                  min={1}
                  max={imgDims ? imgDims.h : undefined}
                  value={crop.height}
                  onChange={(e) => updateCrop('height', Number(e.target.value))}
                  disabled={!file || isProcessing}
                  className={INPUT_CLASS}
                />
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
              {isProcessing ? 'Cropping…' : 'Crop Image'}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {result ? (
              <div className="flex flex-col h-full">
                <img src={result.url} alt="Cropped result" className="w-full object-contain max-h-64" />
                <div className="p-4 border-t border-border space-y-3">
                  <p className="text-sm text-foreground-muted">
                    Cropped size: <span className="font-medium text-foreground">{result.width} × {result.height} px</span>
                  </p>
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
                <p className="text-sm text-foreground-muted">Cropped image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
