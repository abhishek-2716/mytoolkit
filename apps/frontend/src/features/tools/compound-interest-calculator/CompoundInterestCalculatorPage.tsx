import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { CompoundInterestInput, CompoundInterestResult } from './compound-interest-calculator.config'
import { compoundInterestConfig, compoundInterestSchema } from './compound-interest-calculator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function CompoundInterestInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<CompoundInterestInput>) {
  const principalId = useId()
  const rateId = useId()
  const timeId = useId()
  const freqId = useId()

  const { register, watch } = useForm<CompoundInterestInput>({
    resolver: zodResolver(compoundInterestSchema),
    defaultValues: compoundInterestConfig.input.type === 'form' ? compoundInterestConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = compoundInterestSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={principalId} className={LABEL_CLASS}>Principal Amount (₹)</label>
        <input id={principalId} type="number" min="1" step="100" {...register('principal', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={rateId} className={LABEL_CLASS}>Annual Interest Rate (%)</label>
        <input id={rateId} type="number" min="0.01" step="0.1" {...register('rate', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={timeId} className={LABEL_CLASS}>Time Period (Years)</label>
        <input id={timeId} type="number" min="0.1" step="0.5" {...register('time', { valueAsNumber: true })} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={freqId} className={LABEL_CLASS}>Compounding Frequency</label>
        <select id={freqId} {...register('compoundFrequency')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="annually">Annually (1x/year)</option>
          <option value="semi-annually">Semi-Annually (2x/year)</option>
          <option value="quarterly">Quarterly (4x/year)</option>
          <option value="monthly">Monthly (12x/year)</option>
          <option value="daily">Daily (365x/year)</option>
        </select>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<CompoundInterestInput, CompoundInterestResult> = {
  ...compoundInterestConfig,
  renderInput: (props) => <CompoundInterestInputView {...props} />,
}

export default function CompoundInterestCalculatorPage() {
  return <ToolEngine config={config} />
}
