import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { PercentageCalculatorInput, PercentageCalculatorResult } from './percentage-calculator.config'
import { percentageCalculatorConfig, percentageCalculatorSchema } from './percentage-calculator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

const MODE_LABELS: Record<string, { label: string; v1: string; v2: string }> = {
  'percent-of': { label: 'X% of Y', v1: 'Percentage (%)', v2: 'Value (Y)' },
  'what-percent': { label: 'X is what % of Y', v1: 'Value (X)', v2: 'Total (Y)' },
  'percent-change': { label: '% Change from X to Y', v1: 'From (X)', v2: 'To (Y)' },
}

function PercentageCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<PercentageCalculatorInput>) {
  const v1Id = useId()
  const v2Id = useId()

  const { register, watch } = useForm<PercentageCalculatorInput>({
    resolver: zodResolver(percentageCalculatorSchema),
    defaultValues: percentageCalculatorConfig.input.type === 'form' ? percentageCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = percentageCalculatorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const meta = MODE_LABELS[watched.mode] ?? MODE_LABELS['percent-of']!

  return (
    <div className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Mode</span>
        <div className="flex flex-wrap gap-2">
          {(['percent-of', 'what-percent', 'percent-change'] as const).map((m) => (
            <label key={m} className="cursor-pointer">
              <input type="radio" value={m} {...register('mode')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.mode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {MODE_LABELS[m]?.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor={v1Id} className={LABEL_CLASS}>{meta.v1}</label>
        <input id={v1Id} type="number" step="any" {...register('value1', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={v2Id} className={LABEL_CLASS}>{meta.v2}</label>
        <input id={v2Id} type="number" step="any" {...register('value2', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<PercentageCalculatorInput, PercentageCalculatorResult> = {
  ...percentageCalculatorConfig,
  renderInput: (props) => <PercentageCalculatorInputView {...props} />,
}

export default function PercentageCalculatorPage() {
  return <ToolEngine config={config} />
}
