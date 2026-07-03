import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { RegexTesterInput, RegexTesterResult } from './regex-tester.config'
import { regexTesterConfig, regexTesterSchema } from './regex-tester.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 font-mono'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function RegexTesterInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<RegexTesterInput>) {
  const patternId = useId()
  const flagsId = useId()
  const testId = useId()

  const { register, watch } = useForm<RegexTesterInput>({
    resolver: zodResolver(regexTesterSchema),
    defaultValues: regexTesterConfig.input.type === 'form' ? regexTesterConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = regexTesterSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={patternId} className={LABEL_CLASS}>Regex Pattern</label>
        <input id={patternId} type="text" {...register('pattern')} disabled={isLoading} placeholder="e.g. \b\w+@\w+\.\w+\b" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={flagsId} className={LABEL_CLASS}>Flags</label>
        <input id={flagsId} type="text" {...register('flags')} disabled={isLoading} placeholder="e.g. gi" className={INPUT_CLASS} />
        <p className="text-xs text-foreground-muted mt-1">Common flags: g (global), i (case-insensitive), m (multiline)</p>
      </div>
      <div>
        <label htmlFor={testId} className={LABEL_CLASS}>Test String</label>
        <textarea id={testId} rows={4} {...register('testString')} disabled={isLoading} placeholder="Enter text to test against your pattern..." className={INPUT_CLASS} />
      </div>
    </div>
  )
}

const config: ToolEngineConfig<RegexTesterInput, RegexTesterResult> = {
  ...regexTesterConfig,
  renderInput: (props) => <RegexTesterInputView {...props} />,
}

export default function RegexTesterPage() {
  return <ToolEngine config={config} />
}
