import { ToolEngine } from '../engine'
import { palindromeCheckerConfig } from './palindrome-checker.config'

export default function PalindromeCheckerPage() {
  return <ToolEngine config={palindromeCheckerConfig} />
}
