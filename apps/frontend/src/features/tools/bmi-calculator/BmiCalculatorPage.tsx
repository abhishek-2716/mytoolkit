import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { BmiCalculatorInput, BmiCalculatorResult } from './bmi-calculator.config'
import { bmiCalculatorConfig, bmiCalculatorSchema } from './bmi-calculator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function BmiCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<BmiCalculatorInput>) {
  const weightId = useId()
  const heightId = useId()

  const { register, watch } = useForm<BmiCalculatorInput>({
    resolver: zodResolver(bmiCalculatorSchema),
    defaultValues: bmiCalculatorConfig.input.type === 'form' ? bmiCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = bmiCalculatorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const isImperial = watched.unit === 'imperial'

  return (
    <div className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Unit System</span>
        <div className="flex gap-2">
          {(['metric', 'imperial'] as const).map((u) => (
            <label key={u} className="cursor-pointer">
              <input type="radio" value={u} {...register('unit')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.unit === u
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {u === 'metric' ? 'Metric (kg / cm)' : 'Imperial (lbs / in)'}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor={weightId} className={LABEL_CLASS}>
          Weight ({isImperial ? 'lbs' : 'kg'})
        </label>
        <input id={weightId} type="number" step="0.1" min="1" {...register('weight', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={heightId} className={LABEL_CLASS}>
          Height ({isImperial ? 'inches' : 'cm'})
        </label>
        <input id={heightId} type="number" step="0.1" min="1" {...register('height', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<BmiCalculatorInput, BmiCalculatorResult> = {
  ...bmiCalculatorConfig,
  renderInput: (props) => <BmiCalculatorInputView {...props} />,
}

export default function BmiCalculatorPage() {
  return <ToolEngine config={config} />
}
