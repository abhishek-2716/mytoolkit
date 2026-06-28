import { forwardRef } from 'react'
import { MailIcon } from 'lucide-react'

import { Input, type InputProps } from './Input'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type EmailInputProps = Omit<InputProps, 'type' | 'leftIcon'>

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * EmailInput — a text input for email address entry.
 *
 * Sets `type="email"` for mobile keyboard hints and native validation.
 * Use with Zod (`z.string().email()`) or RHF for richer validation.
 *
 * @example
 * <EmailInput placeholder="you@example.com" />
 *
 * @example
 * // With RHF + FormGroup
 * <FormGroup label="Email address" required error={errors.email}>
 *   <EmailInput
 *     {...register('email')}
 *     placeholder="you@example.com"
 *   />
 * </FormGroup>
 */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(function EmailInput(
  { placeholder = 'you@example.com', autoComplete = 'email', ...props },
  ref
) {
  return (
    <Input
      ref={ref}
      type="email"
      leftIcon={MailIcon}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode="email"
      spellCheck={false}
      {...props}
    />
  )
})

EmailInput.displayName = 'EmailInput'
