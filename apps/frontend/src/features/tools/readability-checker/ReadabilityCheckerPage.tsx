import { ToolEngine } from '../engine'
import { readabilityCheckerConfig } from './readability-checker.config'

export default function ReadabilityCheckerPage() {
  return <ToolEngine config={readabilityCheckerConfig} />
}
