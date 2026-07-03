import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { QrCodeInput, QrCodeResult } from './qr-code-generator.config'
import { qrCodeConfig, qrCodeSchema } from './qr-code-generator.config'

/* ─── Custom Input View ──────────────────────────────────────────────────── */

function QrInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<QrCodeInput>) {
  const defaults = qrCodeConfig.input.type === 'form' ? qrCodeConfig.input.defaultValues : undefined
  const { register, watch } = useForm<QrCodeInput>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: defaults,
    mode: 'onChange',
  })
  const watched = watch()

  useEffect(() => {
    const result = qrCodeSchema.safeParse(watched)
    if (!result.success) return
    onInputChange(result.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const sizeId = useId()

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Text or URL</label>
        <input
          {...register('text')}
          disabled={isLoading}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor={sizeId} className="block text-sm font-medium text-foreground mb-1.5">
          Size: {watched.size}px
        </label>
        <input
          id={sizeId}
          type="range"
          min={100}
          max={1000}
          step={50}
          {...register('size', { valueAsNumber: true })}
          disabled={isLoading}
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Error Correction</label>
        <div className="flex gap-2 flex-wrap">
          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
            <label key={level} className="cursor-pointer">
              <input type="radio" value={level} {...register('errorLevel')} className="sr-only" />
              <span
                className={[
                  'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                  watched.errorLevel === level
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/60',
                ].join(' ')}
              >
                {level}
                {level === 'L' ? ' (Low)' : level === 'M' ? ' (Med)' : level === 'Q' ? ' (Quartile)' : ' (High)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-1.5">Dark Color</label>
          <input
            type="color"
            {...register('darkColor')}
            disabled={isLoading}
            className="h-10 w-full rounded-lg border border-border cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-1.5">Light Color</label>
          <input
            type="color"
            {...register('lightColor')}
            disabled={isLoading}
            className="h-10 w-full rounded-lg border border-border cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const config: ToolEngineConfig<QrCodeInput, QrCodeResult> = {
  ...qrCodeConfig,
  renderInput: (props) => <QrInputView {...props} />,
}

export default function QrCodeGeneratorPage() {
  return <ToolEngine config={config} />
}
