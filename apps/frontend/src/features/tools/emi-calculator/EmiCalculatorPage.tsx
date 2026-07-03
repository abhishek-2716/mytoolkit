import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { EmiCalculatorInput, EmiCalculatorResult } from './emi-calculator.config'
import { emiCalculatorConfig, emiCalculatorSchema } from './emi-calculator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function EmiCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<EmiCalculatorInput>) {
  const principalId = useId()
  const rateId = useId()
  const tenureId = useId()

  const { register, watch } = useForm<EmiCalculatorInput>({
    resolver: zodResolver(emiCalculatorSchema),
    defaultValues: emiCalculatorConfig.input.type === 'form' ? emiCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = emiCalculatorSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={principalId} className={LABEL_CLASS}>Loan Amount (₹)</label>
        <input id={principalId} type="number" min="1" step="1000" {...register('principal', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={rateId} className={LABEL_CLASS}>Annual Interest Rate (%)</label>
        <input id={rateId} type="number" min="0.1" step="0.1" {...register('annualRate', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={tenureId} className={LABEL_CLASS}>Loan Tenure (Months)</label>
        <input id={tenureId} type="number" min="1" step="1" {...register('tenureMonths', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<EmiCalculatorInput, EmiCalculatorResult> = {
  ...emiCalculatorConfig,
  renderInput: (props) => <EmiCalculatorInputView {...props} />,
}

export default function EmiCalculatorPage() {
  return <ToolEngine config={config} />
}
