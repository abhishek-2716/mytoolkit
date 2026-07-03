import { ToolEngine } from '../engine'
import { passwordStrengthConfig } from './password-strength-checker.config'

export default function PasswordStrengthCheckerPage() {
  return <ToolEngine config={passwordStrengthConfig} />
}
