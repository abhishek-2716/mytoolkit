import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolInputRenderProps } from '../engine'
import type { LoremIpsumInput } from './lorem-ipsum.config'
import { loremIpsumSchema } from './lorem-ipsum.config'

export function LoremIpsumInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<LoremIpsumInput>) {
  const countId = useId()
  const typeId = useId()

  const { register, watch, formState: { errors } } = useForm<LoremIpsumInput>({
    resolver: zodResolver(loremIpsumSchema),
    defaultValues: { type: 'paragraphs', count: 3, startWithLorem: true },
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = loremIpsumSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
    }
  }, [watched, onInputChange])

  // Auto-generate on mount
  useEffect(() => {
    if (canProcess) onProcess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typeLabel =
    watched.type === 'paragraphs' ? 'Paragraphs'
    : watched.type === 'sentences' ? 'Sentences'
    : 'Words'

  return (
    <div className="space-y-5">
      {/* Type selection */}
      <div role="group" aria-labelledby={typeId}>
        <span id={typeId} className="block text-sm font-medium text-foreground mb-2">
          Generate
        </span>
        <div className="flex flex-wrap gap-2">
          {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                value={t}
                {...register('type')}
                disabled={isLoading}
                className="sr-only"
              />
              <span
                className={[
                  'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                  watched.type === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/60',
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Count */}
      <div>
        <label htmlFor={countId} className="block text-sm font-medium text-foreground mb-1.5">
          How many {typeLabel.toLowerCase()}?
        </label>
        <input
          id={countId}
          type="number"
          min={1}
          max={100}
          {...register('count', { valueAsNumber: true })}
          disabled={isLoading}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
        {errors.count && (
          <p className="text-xs text-destructive mt-1">{errors.count.message}</p>
        )}
      </div>

      {/* Start with Lorem Ipsum */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register('startWithLorem')}
          disabled={isLoading}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <span className="text-sm text-foreground">Start with &ldquo;Lorem ipsum&rdquo;</span>
      </label>

      {/* Generate button */}
      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading || !canProcess}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating…' : `Generate ${watched.count} ${typeLabel}`}
      </button>
    </div>
  )
}
