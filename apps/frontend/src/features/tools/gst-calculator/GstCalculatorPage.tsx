import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { GstCalculatorInput, GstCalculatorResult } from './gst-calculator.config'
import { gstCalculatorConfig, gstCalculatorSchema } from './gst-calculator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const GST_PRESETS = [5, 12, 18, 28]

function GstCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<GstCalculatorInput>) {
  const amountId = useId()
  const rateId = useId()

  const { register, watch, setValue } = useForm<GstCalculatorInput>({
    resolver: zodResolver(gstCalculatorSchema),
    defaultValues: gstCalculatorConfig.input.type === 'form' ? gstCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = gstCalculatorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={amountId} className={LABEL_CLASS}>Amount (₹)</label>
        <input id={amountId} type="number" min="0.01" step="0.01" {...register('amount', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={rateId} className={LABEL_CLASS}>GST Rate (%)</label>
        <input id={rateId} type="number" min="0" step="0.5" {...register('gstRate', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {GST_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              disabled={isLoading}
              onClick={() => setValue('gstRate', p)}
              className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.gstRate === p
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
              ].join(' ')}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Calculation Type</span>
        <div className="flex gap-2">
          {(['exclusive', 'inclusive'] as const).map((t) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" value={t} {...register('type')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.type === t
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {t === 'exclusive' ? 'GST Exclusive' : 'GST Inclusive'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<GstCalculatorInput, GstCalculatorResult> = {
  ...gstCalculatorConfig,
  renderInput: (props) => <GstCalculatorInputView {...props} />,
}

export default function GstCalculatorPage() {
  return <ToolEngine config={config} />
}
