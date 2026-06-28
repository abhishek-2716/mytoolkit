import { forwardRef, useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { cn } from '@/utils'

import { Input, type InputProps } from './Input'
import { InputIcon } from './InputIcon'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon' | 'rightAddon'> {
  /**
   * Initial visibility state.
   * @default false (password hidden)
   */
  defaultVisible?: boolean
}

/* ─── Component ──────────────────────────────────────────────────────────── */

/**
 * PasswordInput — a text input that toggles between `password` and `text` type.
 *
 * A visibility toggle button (Eye / EyeOff) is placed on the right side.
 * The current state is communicated to screen readers via the button's label.
 *
 * All Input props are supported (variant, size, error, icons, etc.).
 *
 * @example
 * <PasswordInput placeholder="Enter your password" />
 *
 * @example
 * // With RHF
 * <FormGroup label="New password" required error={errors.password}>
 *   <PasswordInput {...register('password')} />
 * </FormGroup>
 *
 * @example
 * // Large, filled variant
 * <PasswordInput variant="filled" size="lg" placeholder="Create a password" />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ defaultVisible = false, className, ...props }, ref) {
    const [visible, setVisible] = useState(defaultVisible)

    const toggleAddon = (
      <InputIcon
        icon={visible ? EyeOffIcon : EyeIcon}
        position="right"
        size={props.size ?? 'md'}
        interactive
        onClick={() => {
          setVisible((v) => !v)
        }}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className={cn('text-foreground-muted hover:text-foreground')}
      />
    )

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        autoComplete={props.autoComplete ?? 'current-password'}
        rightAddon={toggleAddon}
        className={className}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
