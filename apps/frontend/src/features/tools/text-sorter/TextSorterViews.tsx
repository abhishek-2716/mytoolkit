import { useEffect, useId, useState } from 'react'

import type { ToolInputRenderProps } from '../engine'
import type { TextSorterInput } from './text-sorter.config'
import { textSorterSchema } from './text-sorter.config'

export function TextSorterInputView({
  state,
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<TextSorterInput>) {
  const textId = useId()
  const [rawText, setRawText] = useState('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [algorithm, setAlgorithm] = useState<'alphabetical' | 'numeric' | 'length'>('alphabetical')
  const [removeDuplicates, setRemoveDuplicates] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  useEffect(() => {
    const parsed = textSorterSchema.safeParse({
      text: rawText,
      order,
      algorithm,
      removeDuplicates,
      ignoreCase,
    })
    if (parsed.success) {
      onInputChange(parsed.data)
    } else {
      onInputChange(null)
    }
  }, [rawText, order, algorithm, removeDuplicates, ignoreCase, onInputChange])

  const errorMessage = state.error?.code === 'validation-error' ? state.error.message : null

  const algorithmOptions: { value: TextSorterInput['algorithm']; label: string }[] = [
    { value: 'alphabetical', label: 'A → Z' },
    { value: 'numeric', label: '0 → 9' },
    { value: 'length', label: 'Length' },
  ]

  return (
    <div className="space-y-4">
      {/* Textarea */}
      <div>
        <label htmlFor={textId} className="block text-sm font-medium text-foreground mb-1.5">
          Lines to sort
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
          placeholder={'Banana\nApple\nCherry\nMango'}
          rows={10}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y disabled:opacity-50"
        />
        {errorMessage && (
          <p className="text-xs text-destructive mt-1" role="alert">{errorMessage}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {rawText.split('\n').length.toLocaleString()} lines · Ctrl+Enter to run
        </p>
      </div>

      {/* Sort options */}
      <div className="grid grid-cols-2 gap-4">
        {/* Algorithm */}
        <div>
          <span className="block text-sm font-medium text-foreground mb-2">Sort by</span>
          <div className="flex flex-col gap-1.5">
            {algorithmOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="algorithm"
                  value={value}
                  checked={algorithm === value}
                  onChange={() => { setAlgorithm(value) }}
                  disabled={isLoading}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order */}
        <div>
          <span className="block text-sm font-medium text-foreground mb-2">Order</span>
          <div className="flex flex-col gap-1.5">
            {[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="order"
                  value={value}
                  checked={order === value}
                  onChange={() => { setOrder(value as 'asc' | 'desc') }}
                  disabled={isLoading}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Extra options */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => { setIgnoreCase(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Ignore case when sorting</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={removeDuplicates}
            onChange={(e) => { setRemoveDuplicates(e.target.checked) }}
            disabled={isLoading}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Remove duplicates after sorting</span>
        </label>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Sorting…' : 'Sort Lines'}
      </button>
    </div>
  )
}
