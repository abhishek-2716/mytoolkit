import { useEffect,useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolInputRenderProps, ToolResultRenderProps } from '../engine'
import { ToolSuccessActions } from '../engine/components/actions/ToolSuccessActions'
import { useToolResult } from '../engine/hooks/useToolResult'
import type { UuidGeneratorInput, UuidGeneratorResult } from './uuid-generator.config'
import { uuidGeneratorSchema } from './uuid-generator.config'

/* ─── Custom Input Renderer ──────────────────────────────────────────────── */

export function UuidGeneratorInputView({
  onInputChange,
  onProcess,
  canProcess,
  isLoading,
}: ToolInputRenderProps<UuidGeneratorInput>) {
  const { register, control, formState: { errors } } = useForm<UuidGeneratorInput>({
    resolver: zodResolver(uuidGeneratorSchema),
    defaultValues: { count: 1, format: 'lowercase', hyphens: true },
    mode: 'onChange',
  })

  const count = useWatch({ control, name: 'count' })
  const format = useWatch({ control, name: 'format' })
  const hyphens = useWatch({ control, name: 'hyphens' })

  // Fire onInputChange whenever form values change
  useEffect(() => {
    const parsed = uuidGeneratorSchema.safeParse({ count, format, hyphens })
    if (parsed.success) {
      onInputChange(parsed.data)
    }
  }, [count, format, hyphens, onInputChange])

  // Auto-trigger initial generation
  useEffect(() => {
    if (canProcess) onProcess()
  // Only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {/* Count */}
        <div>
          <label htmlFor="uuid-count" className="block text-sm font-medium text-foreground mb-1.5">
            How many UUIDs?
          </label>
          <input
            id="uuid-count"
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

        {/* Format */}
        <div>
          <span className="block text-sm font-medium text-foreground mb-1.5">Format</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="lowercase"
                {...register('format')}
                disabled={isLoading}
                className="text-primary"
              />
              <span className="text-sm text-foreground">Lowercase</span>
              <code className="text-xs text-muted-foreground">a1b2c3d4-...</code>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="uppercase"
                {...register('format')}
                disabled={isLoading}
                className="text-primary"
              />
              <span className="text-sm text-foreground">Uppercase</span>
              <code className="text-xs text-muted-foreground">A1B2C3D4-...</code>
            </label>
          </div>
        </div>

        {/* Hyphens */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('hyphens')}
              disabled={isLoading}
              className="w-4 h-4 rounded border-border text-primary"
            />
            <span className="text-sm text-foreground">Include hyphens</span>
          </label>
          <p className="text-xs text-muted-foreground mt-1 ml-7">
            Uncheck for compact UUID without dashes
          </p>
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={onProcess}
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : `Generate${count > 1 ? ` ${count} UUIDs` : ' UUID'}`}
      </button>
    </div>
  )
}

/* ─── Custom Result Renderer ─────────────────────────────────────────────── */

export function UuidGeneratorResultView({ result, onReset }: ToolResultRenderProps<UuidGeneratorResult>) {
  const { copyToClipboard } = useToolResult()
  const [copiedIndex, setCopiedIndex] = useState<number | 'all' | null>(null)

  const handleCopyOne = (uuid: string, index: number) => {
    void copyToClipboard(uuid).then(() => {
      setCopiedIndex(index)
      setTimeout(() => { setCopiedIndex(null); }, 1500)
    })
  }

  const handleCopyAll = () => {
    void copyToClipboard(result.uuids.join('\n')).then(() => {
      setCopiedIndex('all')
      setTimeout(() => { setCopiedIndex(null); }, 1500)
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-sm font-medium text-muted-foreground">
          {result.count} UUID{result.count !== 1 ? 's' : ''} generated
        </span>
        {result.count > 1 && (
          <button
            type="button"
            onClick={() => { handleCopyAll(); }}
            className="text-xs font-medium text-primary hover:underline"
          >
            {copiedIndex === 'all' ? '✓ Copied all!' : 'Copy all'}
          </button>
        )}
      </div>

      {/* UUID list */}
      <ul className="px-4 space-y-1.5 max-h-[400px] overflow-auto">
        {result.uuids.map((uuid, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
          >
            <code className="text-sm font-mono text-foreground select-all flex-1 break-all">
              {uuid}
            </code>
            <button
              type="button"
              onClick={() => { handleCopyOne(uuid, i); }}
              className="flex-shrink-0 p-1.5 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
              aria-label={`Copy UUID ${i + 1}`}
            >
              {copiedIndex === i ? (
                <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="px-4 pb-4">
        <ToolSuccessActions
          copyText={result.uuids.join('\n')}
          onReset={onReset}
        />
      </div>
    </div>
  )
}
