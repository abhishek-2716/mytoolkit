import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { TipCalculatorInput, TipCalculatorResult } from './tip-calculator.config'
import { tipCalculatorConfig, tipCalculatorSchema } from './tip-calculator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const PRESET_TIPS = [10, 15, 18, 20]

function TipCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<TipCalculatorInput>) {
  const billId = useId()
  const tipId = useId()
  const splitId = useId()

  const { register, watch, setValue } = useForm<TipCalculatorInput>({
    resolver: zodResolver(tipCalculatorSchema),
    defaultValues: tipCalculatorConfig.input.type === 'form' ? tipCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = tipCalculatorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={billId} className={LABEL_CLASS}>Bill Amount ($)</label>
        <input id={billId} type="number" min="0.01" step="0.01" {...register('billAmount', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={tipId} className={LABEL_CLASS}>Tip Percentage (%)</label>
        <input id={tipId} type="number" min="0" max="100" step="1" {...register('tipPercent', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {PRESET_TIPS.map((p) => (
            <button
              key={p}
              type="button"
              disabled={isLoading}
              onClick={() => setValue('tipPercent', p)}
              className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.tipPercent === p
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
        <label htmlFor={splitId} className={LABEL_CLASS}>Split Between (people)</label>
        <input id={splitId} type="number" min="1" max="100" {...register('splitCount', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<TipCalculatorInput, TipCalculatorResult> = {
  ...tipCalculatorConfig,
  renderInput: (props) => <TipCalculatorInputView {...props} />,
}

export default function TipCalculatorPage() {
  return <ToolEngine config={config} />
}
