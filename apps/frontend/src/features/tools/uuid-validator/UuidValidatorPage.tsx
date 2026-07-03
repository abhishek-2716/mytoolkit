import { ToolEngine } from '../engine'
import { uuidValidatorConfig } from './uuid-validator.config'

export default function UuidValidatorPage() {
  return <ToolEngine config={uuidValidatorConfig} />
}
