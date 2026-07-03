import { useEffect, useId, useState } from 'react'

import type { ToolInputRenderProps } from '../engine'
import type { RemoveWhitespaceInput } from './remove-whitespace.config'
import { removeWhitespaceSchema } from './remove-whitespace.config'

export function RemoveWhitespaceInputView({
  state,
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<RemoveWhitespaceInput>) {
  const textId = useId()
  const [rawText, setRawText] = useState('')
  const [trimLines, setTrimLines] = useState(true)
  const [collapseSpaces, setCollapseSpaces] = useState(true)
  const [removeBlankLines, setRemoveBlankLines] = useState(false)
  const [removeAllSpaces, setRemoveAllSpaces] = useState(false)

  useEffect(() => {
    const parsed = removeWhitespaceSchema.safeParse({
      text: rawText,
      trimLines,
      collapseSpaces: removeAllSpaces ? false : collapseSpaces,
      removeBlankLines,
      removeAllSpaces,
    })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [rawText, trimLines, collapseSpaces, removeBlankLines, removeAllSpaces, onInputChange])

  const errorMessage = state.error?.code === 'validation-error' ? state.error.message : null

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={textId} className="block text-sm font-medium text-foreground mb-1.5">
          Input text
        </label>
        <textarea
          id={textId}
          value={rawText}
          onChange={(e) => { setRawText(e.target.value) }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canProcess) {
              e.preventDefault()
              onProcess()
            }
          }}
          disabled={isLoading}
          placeholder={'  Hello   World  \n\n  Extra    spaces here  '}
          rows={10}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
        />
        {errorMessage && (
          <p className="text-xs text-destructive mt-1" role="alert">{errorMessage}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">Ctrl+Enter to run</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-foreground">Options</p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => { setTrimLines(e.target.checked) }}
            disabled={isLoading}
            className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Trim leading and trailing spaces from each line</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={collapseSpaces}
            onChange={(e) => { setCollapseSpaces(e.target.checked) }}
            disabled={isLoading || removeAllSpaces}
            className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
          />
          <span className={`text-sm ${removeAllSpaces ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            Collapse multiple spaces into one
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={removeBlankLines}
            onChange={(e) => { setRemoveBlankLines(e.target.checked) }}
            disabled={isLoading}
            className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Remove blank lines</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={removeAllSpaces}
            onChange={(e) => { setRemoveAllSpaces(e.target.checked) }}
            disabled={isLoading}
            className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">
            Remove ALL whitespace (overrides collapse option)
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Removing whitespace…' : 'Remove Whitespace'}
      </button>
    </div>
  )
}
