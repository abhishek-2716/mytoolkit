import { ToolEngine } from '../engine'
import { yamlToJsonConfig } from './yaml-to-json.config'

export default function YamlToJsonPage() {
  return <ToolEngine config={yamlToJsonConfig} />
}
