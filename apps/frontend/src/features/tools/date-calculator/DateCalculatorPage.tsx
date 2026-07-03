import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { DateCalculatorInput, DateCalculatorResult } from './date-calculator.config'
import { dateCalculatorConfig, dateCalculatorSchema } from './date-calculator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function DateCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<DateCalculatorInput>) {
  const date1Id = useId()
  const date2Id = useId()
  const daysId = useId()
  const monthsId = useId()
  const yearsId = useId()

  const { register, watch } = useForm<DateCalculatorInput>({
    resolver: zodResolver(dateCalculatorSchema),
    defaultValues: dateCalculatorConfig.input.type === 'form' ? dateCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()
  const mode = watched.mode

  useEffect(() => {
    const parsed = dateCalculatorSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Mode</span>
        <div className="flex gap-2">
          {(['difference', 'add'] as const).map((m) => (
            <label key={m} className="cursor-pointer">
              <input type="radio" value={m} {...register('mode')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                watched.mode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {m === 'difference' ? 'Date Difference' : 'Add to Date'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor={date1Id} className={LABEL_CLASS}>{mode === 'difference' ? 'Start Date' : 'Date'}</label>
        <input id={date1Id} type="date" {...register('date1')} disabled={isLoading} className={INPUT_CLASS} />
      </div>

      {mode === 'difference' && (
        <div>
          <label htmlFor={date2Id} className={LABEL_CLASS}>End Date</label>
          <input id={date2Id} type="date" {...register('date2')} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      )}

      {mode === 'add' && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor={yearsId} className={LABEL_CLASS}>Years</label>
            <input id={yearsId} type="number" step="1" placeholder="0" {...register('addYears', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor={monthsId} className={LABEL_CLASS}>Months</label>
            <input id={monthsId} type="number" step="1" placeholder="0" {...register('addMonths', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor={daysId} className={LABEL_CLASS}>Days</label>
            <input id={daysId} type="number" step="1" placeholder="0" {...register('addDays', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
      )}
    </div>
  )
}

const config: ToolEngineConfig<DateCalculatorInput, DateCalculatorResult> = {
  ...dateCalculatorConfig,
  renderInput: (props) => <DateCalculatorInputView {...props} />,
}

export default function DateCalculatorPage() {
  return <ToolEngine config={config} />
}
