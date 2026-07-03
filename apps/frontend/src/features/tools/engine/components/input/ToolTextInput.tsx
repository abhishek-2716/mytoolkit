import { useCallback, useId,useRef, useState } from 'react'

import type { ToolError } from '../../types/tool-error.types'
import type { TextInputConfig } from '../../types/tool-input.types'

interface ToolTextInputProps<TInput> {
  config: TextInputConfig<TInput>
  isLoading: boolean
  onInputChange: (input: TInput | null) => void
  onProcess: () => void
  canProcess: boolean
  currentError: ToolError | null
}

/**
 * ToolTextInput
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Textarea-based input component for all text-processing tools.
 * Validates on change and calls onInputChange with the typed result.
 *
 * Features:
 *  - Real-time character count
 *  - Keyboard shortcut: Ctrl+Enter triggers process
 *  - Paste-from-clipboard button
 *  - Clear button
 *  - ARIA: live region announces character count
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolTextInput<TInput>({
  config,
  isLoading,
  onInputChange,
  onProcess,
  canProcess,
  currentError,
}: ToolTextInputProps<TInput>) {
  const textareaId = useId()
  const [rawValue, setRawValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setRawValue(value)

      if (!value.trim()) {
        setValidationError(null)
        onInputChange(null)
        return
      }

      const result = config.validate(value)
      if (result.success) {
        setValidationError(null)
        onInputChange(result.value)
      } else {
        setValidationError(result.error.message)
        onInputChange(null)
      }
    },
    [config, onInputChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canProcess) {
        e.preventDefault()
        onProcess()
      }
    },
    [canProcess, onProcess]
  )

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (textareaRef.current) {
        textareaRef.current.value = text
        textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }))
        setRawValue(text)
        if (text.trim()) {
          const result = config.validate(text)
          if (result.success) {
            setValidationError(null)
            onInputChange(result.value)
          } else {
            setValidationError(result.error.message)
          }
        }
      }
    } catch {
      // Clipboard access denied — silently ignore
    }
  }, [config, onInputChange])

  const handleClear = useCallback(() => {
    setRawValue('')
    setValidationError(null)
    onInputChange(null)
    textareaRef.current?.focus()
  }, [onInputChange])

  const charCount = rawValue.length
  const isOverLimit = config.maxLength !== undefined && charCount > config.maxLength
  const displayError = validationError ?? (currentError?.field ? currentError.message : null)

  return (
    <div className="flex flex-col gap-2">
      {/* Textarea */}
      <div className="relative">
        <label htmlFor={textareaId} className="sr-only">
          Input text
        </label>
        <textarea
          ref={textareaRef}
          id={textareaId}
          value={rawValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={config.placeholder ?? 'Paste or type your text here...'}
          disabled={isLoading}
          aria-invalid={displayError !== null}
          aria-describedby={displayError ? `${textareaId}-error` : undefined}
          rows={12}
          className={[
            'w-full resize-y rounded-lg border bg-background px-3 py-2',
            'font-mono text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            displayError
              ? 'border-destructive focus:ring-destructive/50'
              : 'border-border hover:border-border/80',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* Action buttons inside the textarea area */}
        {rawValue.length > 0 && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Clear input"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Footer row: character count + paste + error */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Validation error */}
          {displayError && (
            <p
              id={`${textareaId}-error`}
              className="text-sm text-destructive"
              role="alert"
            >
              {displayError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Character count */}
          <span
            className={`text-xs tabular-nums ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
            aria-live="polite"
            aria-label="Character count"
          >
            {config.maxLength
              ? `${charCount} / ${config.maxLength}`
              : `${charCount} chars`}
          </span>

          {/* Paste button */}
          <button
            type="button"
            onClick={() => { void handlePaste() }}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Paste from clipboard"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Paste
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-xs text-muted-foreground/60">
        Press <kbd className="px-1 py-0.5 rounded text-xs bg-muted border border-border">Ctrl+Enter</kbd> to process
      </p>
    </div>
  )
}
