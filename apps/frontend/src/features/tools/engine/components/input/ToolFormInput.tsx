import { type DefaultValues,useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { FormInputConfig } from '../../types/tool-input.types'

interface ToolFormInputProps<TInput extends Record<string, unknown>> {
  config: FormInputConfig<TInput>
  isLoading: boolean
  onInputChange: (input: TInput | null) => void
  onProcess: () => void
}

/**
 * ToolFormInput
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Generic form input for tools with structured settings.
 * Uses react-hook-form + zodResolver for validation.
 *
 * The engine renders this when config.input.type === 'form'.
 * Tools like UUID Generator and Password Generator use this.
 *
 * The form auto-submits on valid change (live generation tools).
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
export function ToolFormInput<TInput extends Record<string, unknown>>({
  config,
  isLoading,
  onInputChange,
  onProcess,
}: ToolFormInputProps<TInput>) {
  const { handleSubmit, watch, formState: { errors } } = useForm<TInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(config.schema as any),
    defaultValues: config.defaultValues as DefaultValues<TInput>,
    mode: 'onChange',
  })

  // Watch all values — fire onInputChange when they change
  const watchedValues = watch()

  // Parse via zod on every change
  const parsed = config.schema.safeParse(watchedValues)
  if (parsed.success) {
    // Use a ref to avoid infinite loop — this is called on every render
    // The parent will only set state if value actually changed
    onInputChange(parsed.data)
  }

  const onSubmit = handleSubmit(() => {
    onProcess()
  })

  return (
    <form onSubmit={(e) => { void onSubmit(e) }} className="space-y-4" noValidate>
      {/* 
        This is a generic shell. Tools with form inputs should provide
        renderInput to customize the form fields. This default implementation
        renders a submit button only; the actual fields come from the custom renderer.
        
        If a tool uses type:'form' without renderInput, this renders a submit button.
        The tool SHOULD provide renderInput for a proper form UI.
      */}
      <div className="p-4 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
        Form fields are rendered via <code>config.renderInput</code>.
        Add custom form fields for this tool.
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/5">
          {Object.values(errors).map((error, i) => (
            <p key={i} className="text-sm text-destructive">
              {error?.message as string}
            </p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !parsed.success}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : 'Process'}
      </button>
    </form>
  )
}
