import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { CalorieCalculatorInput, CalorieCalculatorResult } from './calorie-calculator.config'
import { calorieCalculatorConfig, calorieCalculatorSchema } from './calorie-calculator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function CalorieCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<CalorieCalculatorInput>) {
  const ageId = useId()
  const weightId = useId()
  const heightId = useId()
  const activityId = useId()
  const unitId = useId()

  const { register, watch } = useForm<CalorieCalculatorInput>({
    resolver: zodResolver(calorieCalculatorSchema),
    defaultValues: calorieCalculatorConfig.input.type === 'form' ? calorieCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()
  const isImperial = watched.unit === 'imperial'

  useEffect(() => {
    const parsed = calorieCalculatorSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={unitId} className={LABEL_CLASS}>Unit System</label>
        <select id={unitId} {...register('unit')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="metric">Metric (kg, cm)</option>
          <option value="imperial">Imperial (lb, inches)</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={ageId} className={LABEL_CLASS}>Age (years)</label>
          <input id={ageId} type="number" min="1" max="120" {...register('age', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
        <div>
          <span className="block text-sm font-medium text-foreground mb-2">Gender</span>
          <div className="flex gap-2 h-9 items-center">
            {(['male', 'female'] as const).map((g) => (
              <label key={g} className="cursor-pointer">
                <input type="radio" value={g} {...register('gender')} disabled={isLoading} className="sr-only" />
                <span className={[
                  'inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                  watched.gender === g
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/60',
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                ].join(' ')}>
                  {g === 'male' ? 'Male' : 'Female'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={weightId} className={LABEL_CLASS}>Weight ({isImperial ? 'lb' : 'kg'})</label>
          <input id={weightId} type="number" min="1" step="0.1" {...register('weight', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
        <div>
          <label htmlFor={heightId} className={LABEL_CLASS}>Height ({isImperial ? 'inches' : 'cm'})</label>
          <input id={heightId} type="number" min="1" step="0.1" {...register('height', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      </div>
      <div>
        <label htmlFor={activityId} className={LABEL_CLASS}>Activity Level</label>
        <select id={activityId} {...register('activityLevel')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Lightly active (1–3 days/week)</option>
          <option value="moderate">Moderately active (3–5 days/week)</option>
          <option value="active">Very active (6–7 days/week)</option>
          <option value="very-active">Super active (physical job / 2x/day)</option>
        </select>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<CalorieCalculatorInput, CalorieCalculatorResult> = {
  ...calorieCalculatorConfig,
  renderInput: (props) => <CalorieCalculatorInputView {...props} />,
}

export default function CalorieCalculatorPage() {
  return <ToolEngine config={config} />
}
