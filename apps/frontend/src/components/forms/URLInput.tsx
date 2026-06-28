import { forwardRef } from 'react'
import { LinkIcon } from 'lucide-react'

import { Input, type InputProps } from './Input'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type URLInputProps = Omit<InputProps, 'type' | 'leftIcon'>

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * URLInput — a text input for entering web addresses.
 *
 * Sets `type="url"` for native browser URL validation and shows a link icon.
 * Use with Zod (`z.string().url()`) or RHF for richer validation messages.
 *
 * @example
 * <URLInput placeholder="https://example.com" />
 *
 * @example
 * // With RHF + Zod
 * <FormGroup label="Website URL" error={errors.url}>
 *   <URLInput
 *     {...register('url')}
 *     placeholder="https://your-website.com"
 *   />
 * </FormGroup>
 */
export const URLInput = forwardRef<HTMLInputElement, URLInputProps>(function URLInput(
  { placeholder = 'https://', autoComplete = 'url', ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type="url"
      leftIcon={LinkIcon}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode="url"
      spellCheck={false}
      {...props}
    />
  )
})

URLInput.displayName = 'URLInput'
