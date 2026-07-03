import { UploadCloud } from 'lucide-react'

import { useFileInput } from '../../hooks/useFileInput'
import type { ToolError } from '../../types/tool-error.types'
import type { FileInputConfig } from '../../types/tool-input.types'

interface ToolFileInputProps<TInput> {
  config: FileInputConfig<TInput>
  isLoading: boolean
  onInputChange: (input: TInput | null) => void
  currentError: ToolError | null
}

/**
 * ToolFileInput
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Drag-and-drop / click-to-browse file input for single file tools.
 *
 * Features:
 *  - Drag active visual feedback
 *  - File type and size validation
 *  - File preview for images
 *  - Selected file info display (name, size)
 *  - Clear/replace file button
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolFileInput<TInput>({
  config,
  isLoading,
  onInputChange,
  currentError,
}: ToolFileInputProps<TInput>) {
  const { isDragActive, previewUrl, fileInfo, dropZoneProps, inputRef, clearFile } = useFileInput({
    accept: config.accept,
    maxSizeMb: config.maxSizeMb,
    onFile: (file) => {
      if (Array.isArray(file)) return
      if (config.validate) {
        void Promise.resolve(config.validate(file)).then((result) => {
          if (result.success) {
            onInputChange(result.value)
          } else {
            onInputChange(null)
          }
        })
      } else {
        // Cast: when no custom validate, the raw File IS TInput
        onInputChange(file as unknown as TInput)
      }
    },
    onError: () => { onInputChange(null); },
  })

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const acceptString = config.accept
    .filter((a) => a.startsWith('.'))
    .join(', ')
    .toUpperCase()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Reuse the dropZoneProps onDrop logic via FileList simulation
      const dt = new DataTransfer()
      dt.items.add(file)
      const syntheticEvent = {
        preventDefault: () => { return undefined },
        stopPropagation: () => { return undefined },
        dataTransfer: dt,
      } as unknown as React.DragEvent
      dropZoneProps.onDrop(syntheticEvent)
    }
  }

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={config.accept.join(',')}
        className="sr-only"
        onChange={handleInputChange}
        disabled={isLoading}
        aria-hidden="true"
        tabIndex={-1}
      />

      {!fileInfo ? (
        /* Drop Zone */
        <div
          {...dropZoneProps}
          className={[
            'relative flex flex-col items-center justify-center gap-3',
            'rounded-xl border-2 border-dashed p-10',
            'cursor-pointer transition-all duration-200 select-none',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            isDragActive
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            isLoading ? 'pointer-events-none opacity-50' : '',
            currentError ? 'border-destructive/50' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isDragActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or{' '}
              <span className="text-primary font-medium underline underline-offset-2">
                browse files
              </span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {acceptString && `${acceptString} · `}Max {config.maxSizeMb} MB
          </p>
        </div>
      ) : (
        /* Selected file info */
        <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
          {/* Image preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border"
            />
          )}
          {!previewUrl && (
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{fileInfo.name}</p>
            <p className="text-xs text-muted-foreground">{formatSize(fileInfo.sizeBytes)}</p>
          </div>

          {/* Clear button */}
          {!isLoading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearFile()
                onInputChange(null)
              }}
              className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Remove file"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Error message */}
      {currentError && currentError.code !== 'cancelled' && (
        <p className="text-sm text-destructive flex items-center gap-1" role="alert">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {currentError.message}
        </p>
      )}
    </div>
  )
}
