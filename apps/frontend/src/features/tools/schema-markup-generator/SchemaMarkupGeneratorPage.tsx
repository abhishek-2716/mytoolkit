import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { ToolEngineConfig, ToolInputRenderProps } from '../engine'
import { ToolEngine } from '../engine'
import type { SchemaMarkupInput } from './schema-markup-generator.config'
import { schemaMarkupConfig, schemaMarkupSchema } from './schema-markup-generator.config'

const INPUT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
const LABEL_CLASS = 'block text-sm font-medium text-foreground mb-1.5'
const SELECT_CLASS = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'

function SchemaMarkupInputView({ onInputChange, onProcess, isLoading }: ToolInputRenderProps<SchemaMarkupInput>) {
  const typeId = useId()
  const nameId = useId()
  const urlId = useId()
  const descId = useId()
  const logoId = useId()
  const dateId = useId()
  const authorId = useId()

  const { register, watch } = useForm<SchemaMarkupInput>({
    resolver: zodResolver(schemaMarkupSchema),
    defaultValues: schemaMarkupConfig.input.type === 'form' ? schemaMarkupConfig.input.defaultValues : {},
    mode: 'onChange',
  })

  const watched = watch()
  const type = watched.type

  useEffect(() => {
    const parsed = schemaMarkupSchema.safeParse(watched)
    if (parsed.success) {
      onInputChange(parsed.data)
      onProcess()
    }
  }, [watched, onInputChange, onProcess])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={typeId} className={LABEL_CLASS}>Schema Type</label>
        <select id={typeId} {...register('type')} disabled={isLoading} className={SELECT_CLASS}>
          <option value="Website">Website</option>
          <option value="Article">Article</option>
          <option value="Organization">Organization</option>
          <option value="LocalBusiness">LocalBusiness</option>
          <option value="FAQPage">FAQPage</option>
          <option value="BreadcrumbList">BreadcrumbList</option>
        </select>
      </div>
      <div>
        <label htmlFor={nameId} className={LABEL_CLASS}>Name *</label>
        <input id={nameId} type="text" placeholder="My Website" {...register('name')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={urlId} className={LABEL_CLASS}>URL *</label>
        <input id={urlId} type="url" placeholder="https://example.com" {...register('url')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor={descId} className={LABEL_CLASS}>Description</label>
        <input id={descId} type="text" placeholder="Brief description..." {...register('description')} disabled={isLoading} className={INPUT_CLASS} />
      </div>
      {(type === 'Organization' || type === 'LocalBusiness') && (
        <div>
          <label htmlFor={logoId} className={LABEL_CLASS}>Logo URL</label>
          <input id={logoId} type="url" placeholder="https://example.com/logo.png" {...register('logoUrl')} disabled={isLoading} className={INPUT_CLASS} />
        </div>
      )}
      {type === 'Article' && (
        <>
          <div>
            <label htmlFor={dateId} className={LABEL_CLASS}>Date Published</label>
            <input id={dateId} type="date" {...register('datePublished')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
          <div>
            <label htmlFor={authorId} className={LABEL_CLASS}>Author Name</label>
            <input id={authorId} type="text" placeholder="John Doe" {...register('authorName')} disabled={isLoading} className={INPUT_CLASS} />
          </div>
        </>
      )}
    </div>
  )
}

const config: ToolEngineConfig<SchemaMarkupInput, string> = {
  ...schemaMarkupConfig,
  renderInput: (props) => <SchemaMarkupInputView {...props} />,
}

export default function SchemaMarkupGeneratorPage() {
  return <ToolEngine config={config} />
}
