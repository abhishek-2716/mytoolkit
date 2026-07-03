import { useCallback, useRef, useState } from 'react'
import { DownloadIcon, UploadCloudIcon } from 'lucide-react'

import { getToolBySlug } from '@/registry'

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function parsePageRanges(input: string, maxPage: number): number[] | null {
  const indices = new Set<number>()
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean)
  for (const part of parts) {
    const rangeMatch = /^(\d+)-(\d+)$/.exec(part)
    const singleMatch = /^(\d+)$/.exec(part)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]!, 10)
      const end = parseInt(rangeMatch[2]!, 10)
      if (start < 1 || end > maxPage || start > end) return null
      for (let i = start; i <= end; i++) indices.add(i - 1) // 0-indexed
    } else if (singleMatch) {
      const page = parseInt(singleMatch[1]!, 10)
      if (page < 1 || page > maxPage) return null
      indices.add(page - 1)
    } else {
      return null
    }
  }
  return Array.from(indices).sort((a, b) => a - b)
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('pdf-split')

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [rangeInput, setRangeInput] = useState('')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [extractedCount, setExtractedCount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (f: File) => {
    setFile(f)
    setResultUrl(null)
    setError(null)
    setPageCount(null)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
    } catch {
      setError('Failed to load PDF. Please ensure the file is a valid PDF.')
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) handleFile(f)
    },
    [handleFile],
  )

  const handleExtract = async () => {
    if (!file || !pageCount || !rangeInput.trim()) return
    setIsProcessing(true)
    setError(null)
    try {
      const indices = parsePageRanges(rangeInput, pageCount)
      if (!indices || indices.length === 0) {
        setError(`Invalid page range. Enter values between 1 and ${pageCount}. Example: 1-3, 5, 7-9`)
        setIsProcessing(false)
        return
      }

      const { PDFDocument } = await import('pdf-lib')
      const srcBytes = await file.arrayBuffer()
      const srcDoc = await PDFDocument.load(srcBytes)
      const extracted = await PDFDocument.create()
      const pages = await extracted.copyPages(srcDoc, indices)
      pages.forEach((p) => extracted.addPage(p))

      const bytes = await extracted.save()
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setExtractedCount(indices.length)
    } catch {
      setError('Failed to extract pages. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const safeRange = rangeInput.replace(/[^0-9,\-\s]/g, '').slice(0, 50)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'PDF Split'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Extract specific pages from a PDF.'}</p>
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
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <UploadCloudIcon className="w-8 h-8 text-foreground-muted" />
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  {pageCount !== null && (
                    <p className="text-xs text-foreground-muted">{pageCount} pages</p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop PDF here or click to browse</p>
                  <p className="text-xs text-foreground-muted">Single PDF file</p>
                </div>
              )}
            </div>

            {pageCount !== null && (
              <p className="text-sm text-foreground-muted">
                PDF loaded: <span className="font-medium text-foreground">{pageCount} pages</span>
              </p>
            )}

            <div>
              <label className={LABEL_CLASS}>
                Page Range{pageCount ? ` (1–${pageCount})` : ''}
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                disabled={!file || isProcessing}
                className={INPUT_CLASS}
              />
              <p className="mt-1 text-xs text-foreground-muted">
                Comma-separated pages or ranges. Example: <code className="font-mono">1-3, 5, 7-9</code>
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleExtract}
              disabled={!file || !rangeInput.trim() || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Extracting…' : 'Extract Pages'}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card">
            {resultUrl && extractedCount !== null ? (
              <div className="p-6 space-y-4">
                <div className="rounded-lg bg-background px-4 py-3 text-center">
                  <p className="text-xs text-foreground-muted">Pages Extracted</p>
                  <p className="text-3xl font-bold text-foreground">{extractedCount}</p>
                </div>
                <a
                  href={resultUrl}
                  download={`pages_${safeRange || 'extracted'}.pdf`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download Extracted PDF
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-48 p-8 text-center">
                <p className="text-sm text-foreground-muted">
                  {!file
                    ? 'Upload a PDF to get started'
                    : !rangeInput.trim()
                    ? 'Enter page ranges to extract'
                    : 'Click "Extract Pages" to continue'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
