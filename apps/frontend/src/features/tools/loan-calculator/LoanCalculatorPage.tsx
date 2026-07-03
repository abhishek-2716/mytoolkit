import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { LoanCalculatorInput, LoanCalculatorResult } from './loan-calculator.config'
import { loanCalculatorConfig, loanCalculatorSchema } from './loan-calculator.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function LoanCalculatorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<LoanCalculatorInput>) {
  const principalId = useId()
  const rateId = useId()
  const yearsId = useId()
  const currencyId = useId()

  const { register, watch } = useForm<LoanCalculatorInput>({
    resolver: zodResolver(loanCalculatorSchema),
    defaultValues: loanCalculatorConfig.input.type === 'form' ? loanCalculatorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = loanCalculatorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={principalId} className={LABEL_CLASS}>Loan Amount</label>
        <input id={principalId} type="number" min="1" step="1000" {...register('principal', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={rateId} className={LABEL_CLASS}>Annual Interest Rate (%)</label>
        <input id={rateId} type="number" min="0" step="0.1" {...register('annualRate', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={yearsId} className={LABEL_CLASS}>Loan Tenure (years)</label>
        <input id={yearsId} type="number" min="1" max="50" {...register('years', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={currencyId} className={LABEL_CLASS}>Currency Symbol</label>
        <input id={currencyId} type="text" maxLength={3} {...register('currency')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<LoanCalculatorInput, LoanCalculatorResult> = {
  ...loanCalculatorConfig,
  renderInput: (props) => <LoanCalculatorInputView {...props} />,
}

export default function LoanCalculatorPage() {
  return <ToolEngine config={config} />
}
