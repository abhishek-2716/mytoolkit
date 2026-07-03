import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { SpeedCalculatorInput, SpeedCalculatorResult } from './speed-calculator.config'
import { speedCalculatorConfig, speedCalculatorSchema } from './speed-calculator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function SpeedCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<SpeedCalculatorInput>) {
  const speedId = useId()
  const distanceId = useId()
  const hoursId = useId()
  const minsId = useId()

  const { register, watch } = useForm<SpeedCalculatorInput>({
    resolver: zodResolver(speedCalculatorSchema),
    defaultValues: speedCalculatorConfig.input.type === 'form' ? speedCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()
  const mode = watched.mode

  useEffect(() => {
    const parsed = speedCalculatorSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-foreground mb-2">Calculate</span>
        <div className="flex gap-2 flex-wrap">
          {(['speed', 'distance', 'time'] as const).map((m) => (
            <label key={m} className="cursor-pointer">
              <input type="radio" value={m} {...register('mode')} disabled={isLoading} className="sr-only" />
              <span className={[
                'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors capitalize',
                watched.mode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/60',
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}>
                {m}
              </span>
            </label>
          ))}
        </div>
      </div>

      {mode !== 'speed' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={speedId} className={LABEL_CLASS}>Speed</label>
            <input id={speedId} type="number" min="0" step="any" placeholder="e.g. 60" {...register('speed', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Speed Unit</label>
            <select {...register('speedUnit')} disabled={isLoading} className={SELECT_CLASS}>
              <option value="kmh">km/h</option>
              <option value="mph">mph</option>
              <option value="ms">m/s</option>
            </select>
          </div>
        </div>
      )}

      {mode !== 'distance' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={distanceId} className={LABEL_CLASS}>Distance</label>
            <input id={distanceId} type="number" min="0" step="any" placeholder="e.g. 100" {...register('distance', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Distance Unit</label>
            <select {...register('distanceUnit')} disabled={isLoading} className={SELECT_CLASS}>
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
              <option value="meters">Meters</option>
            </select>
          </div>
        </div>
      )}

      {mode !== 'time' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={hoursId} className={LABEL_CLASS}>Hours</label>
            <input id={hoursId} type="number" min="0" step="1" placeholder="0" {...register('hours', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor={minsId} className={LABEL_CLASS}>Minutes</label>
            <input id={minsId} type="number" min="0" max="59" step="1" placeholder="0" {...register('minutes', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </div>
      )}

      {mode === 'distance' && (
        <div>
          <label className={LABEL_CLASS}>Distance Unit (result)</label>
          <select {...register('distanceUnit')} disabled={isLoading} className={SELECT_CLASS}>
            <option value="km">Kilometers</option>
            <option value="miles">Miles</option>
            <option value="meters">Meters</option>
          </select>
        </div>
      )}
    </div>
  )
}

const config: ToolEngineConfig<SpeedCalculatorInput, SpeedCalculatorResult> = {
  ...speedCalculatorConfig,
  renderInput: (props) => <SpeedCalculatorInputView {...props} />,
}

export default function SpeedCalculatorPage() {
  return <ToolEngine config={config} />
}
