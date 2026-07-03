import { useCallback, useRef, useState } from 'react'
import { DownloadIcon, Trash2Icon, UploadCloudIcon } from 'lucide-react'

import { getToolBySlug } from '@/registry'

/* ─── Page ───────────────────────────────────────────────────────────────── */

const tool = getToolBySlug('pdf-merge')

interface PdfFile { id: string; file: File }

export default function PdfMergePage() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const pdfs: PdfFile[] = Array.from(incoming)
      .filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
      .map((f) => ({ id: `${f.name}-${f.lastModified}-${Math.random()}`, file: f }))
    setFiles((prev) => [...prev, ...pdfs])
    setResultUrl(null)
    setError(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setResultUrl(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setIsProcessing(true)
    setError(null)
    setProgress(0)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      let pages = 0

      for (let i = 0; i < files.length; i++) {
        const bytes = await files[i]!.file.arrayBuffer()
        const srcDoc = await PDFDocument.load(bytes)
        const copiedPages = await merged.copyPages(srcDoc, srcDoc.getPageIndices())
        copiedPages.forEach((p) => merged.addPage(p))
        pages += srcDoc.getPageCount()
        setProgress(Math.round(((i + 1) / files.length) * 90))
      }

      const mergedBytes = await merged.save()
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setTotalPages(pages)
      setProgress(100)
    } catch {
      setError('Failed to merge PDFs. Please ensure all files are valid PDFs.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{tool?.title ?? 'PDF Merge'}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{tool?.shortDescription ?? 'Merge multiple PDF files into one.'}</p>
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
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />
              <UploadCloudIcon className="w-8 h-8 text-foreground-muted" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Drop PDF files here or click to browse</p>
                <p className="text-xs text-foreground-muted">Select multiple PDF files</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Files ({files.length})</p>
                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                  {files.map((f, idx) => (
                    <li key={f.id} className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 text-sm">
                      <span className="w-5 h-5 flex-shrink-0 rounded bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      <span className="flex-1 truncate text-foreground">{f.file.name}</span>
                      <span className="text-xs text-foreground-muted flex-shrink-0">
                        {(f.file.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(f.id) }}
                        className="text-foreground-muted hover:text-destructive transition-colors"
                        aria-label="Remove file"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-foreground-muted">
                  <span>Merging…</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? `Merging… ${progress}%` : `Merge ${files.length} PDFs`}
            </button>
          </div>

          {/* Result */}
          <div className="rounded-xl border border-border bg-card">
            {resultUrl ? (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-background px-2 py-3">
                    <p className="text-xs text-foreground-muted">Files Merged</p>
                    <p className="text-2xl font-bold text-foreground">{files.length}</p>
                  </div>
                  <div className="rounded-lg bg-background px-2 py-3">
                    <p className="text-xs text-foreground-muted">Total Pages</p>
                    <p className="text-2xl font-bold text-foreground">{totalPages}</p>
                  </div>
                </div>
                <a
                  href={resultUrl}
                  download="merged.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download merged.pdf
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-48 p-8 text-center">
                <p className="text-sm text-foreground-muted">
                  {files.length < 2
                    ? 'Add at least 2 PDF files to merge'
                    : 'Click "Merge" to combine your PDFs'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
