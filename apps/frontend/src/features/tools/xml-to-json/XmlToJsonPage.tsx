import { ToolEngine } from '../engine'
import { xmlToJsonConfig } from './xml-to-json.config'

export default function XmlToJsonPage() {
  return <ToolEngine config={xmlToJsonConfig} />
}
