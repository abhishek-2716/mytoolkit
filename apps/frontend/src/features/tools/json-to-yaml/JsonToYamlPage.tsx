import { ToolEngine } from '../engine'
import { jsonToYamlConfig } from './json-to-yaml.config'

export default function JsonToYamlPage() {
  return <ToolEngine config={jsonToYamlConfig} />
}
