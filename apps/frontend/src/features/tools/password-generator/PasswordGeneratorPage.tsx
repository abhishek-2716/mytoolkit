import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { PasswordGeneratorInput, PasswordGeneratorResult } from './password-generator.config'
import { passwordGeneratorConfig, passwordGeneratorSchema } from './password-generator.config'

const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function PasswordGeneratorInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<PasswordGeneratorInput>) {
  const lengthId = useId()

  const { register, watch } = useForm<PasswordGeneratorInput>({
    resolver: zodResolver(passwordGeneratorSchema),
    defaultValues: passwordGeneratorConfig.input.type === 'form' ? passwordGeneratorConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = passwordGeneratorSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  const checkboxes: { key: keyof PasswordGeneratorInput; label: string }[] = [
    { key: 'uppercase', label: 'Uppercase (A–Z)' },
    { key: 'lowercase', label: 'Lowercase (a–z)' },
    { key: 'numbers', label: 'Numbers (0–9)' },
    { key: 'symbols', label: 'Symbols (!@#…)' },
    { key: 'excludeAmbiguous', label: 'Exclude Ambiguous (0OlI)' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={lengthId} className={LABEL_CLASS}>
          Length: <span className="text-primary font-semibold">{watched.length}</span>
        </label>
        <input
          id={lengthId}
          type="range"
          min={4}
          max={128}
          step={1}
          {...register('length', { valueAsNumber: true })}
          disabled={isLoading}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground-muted mt-1">
          <span>4</span><span>128</span>
        </div>
      </div>
      <div className="space-y-2">
        {checkboxes.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
            <input
              type="checkbox"
              {...register(key as never)}
              disabled={isLoading}
              className="rounded border-border"
            />
            {label}
          </label>
        ))}
      </div>
      <button
        type="button"
        disabled={isLoading}
        onClick={onProcess}
        className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Generate New Password
      </button>
    </div>
  )
}

const config: ToolEngineConfig<PasswordGeneratorInput, PasswordGeneratorResult> = {
  ...passwordGeneratorConfig,
  renderInput: (props) => <PasswordGeneratorInputView {...props} />,
}

export default function PasswordGeneratorPage() {
  return <ToolEngine config={config} />
}
