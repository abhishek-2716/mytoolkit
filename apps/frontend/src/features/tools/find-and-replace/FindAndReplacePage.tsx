import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { FindAndReplaceInput, FindAndReplaceResult } from './find-and-replace.config'
import { findAndReplaceConfig, findAndReplaceSchema } from './find-and-replace.config'

const INPUT_CLASS =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'

function FindAndReplaceInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<FindAndReplaceInput>) {
  const textId = useId()
  const searchId = useId()
  const replacementId = useId()

  const { register, watch } = useForm<FindAndReplaceInput>({
    resolver: zodResolver(findAndReplaceSchema),
    defaultValues: findAndReplaceConfig.input.type === 'form' ? findAndReplaceConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()

  useEffect(() => {
    const parsed = findAndReplaceSchema.safeParse(watched)
    if (!parsed.success) return
    onInputChange(parsed.data)
    onProcess()
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={textId} className={LABEL_CLASS}>Text</label>
        <textarea
          id={textId}
          rows={6}
          {...register('text')}
          disabled={isLoading}
          placeholder="Paste your text here..."
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label htmlFor={searchId} className={LABEL_CLASS}>Find</label>
        <input id={searchId} type="text" {...register('search')} disabled={isLoading} placeholder="Text to search..." className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={replacementId} className={LABEL_CLASS}>Replace With</label>
        <input id={replacementId} type="text" {...register('replacement')} disabled={isLoading} placeholder="Replacement text..." className={INPUT_CLASS} />
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <input type="checkbox" {...register('caseSensitive')} disabled={isLoading} className="rounded border-border" />
          Case Sensitive
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <input type="checkbox" {...register('useRegex')} disabled={isLoading} className="rounded border-border" />
          Use Regex
        </label>
      </div>
    </div>
  )
}

const config: ToolEngineConfig<FindAndReplaceInput, FindAndReplaceResult> = {
  ...findAndReplaceConfig,
  renderInput: (props) => <FindAndReplaceInputView {...props} />,
}

export default function FindAndReplacePage() {
  return <ToolEngine config={config} />
}
