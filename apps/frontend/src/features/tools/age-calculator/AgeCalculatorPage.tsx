import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { AgeCalculatorInput, AgeCalculatorResult } from './age-calculator.config'
import { ageCalculatorConfig, ageCalculatorSchema } from './age-calculator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function AgeCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<AgeCalculatorInput>) {
  const birthId = useId()
  const targetId = useId()

  const { register, watch } = useForm<AgeCalculatorInput>({
    resolver: zodResolver(ageCalculatorSchema),
    defaultValues: ageCalculatorConfig.input.type === 'form' ? ageCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = ageCalculatorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={birthId} className={LABEL_CLASS}>Date of Birth</label>
        <input id={birthId} type="date" {...register('birthDate')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={targetId} className={LABEL_CLASS}>Age At Date</label>
        <input id={targetId} type="date" {...register('targetDate')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<AgeCalculatorInput, AgeCalculatorResult> = {
  ...ageCalculatorConfig,
  renderInput: (props) => <AgeCalculatorInputView {...props} />,
}

export default function AgeCalculatorPage() {
  return <ToolEngine config={config} />
}
