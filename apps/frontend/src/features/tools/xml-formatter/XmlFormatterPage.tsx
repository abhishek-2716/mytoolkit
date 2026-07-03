import { ToolEngine } from '../engine'
import { xmlFormatterConfig } from './xml-formatter.config'

export default function XmlFormatterPage() {
  return <ToolEngine config={xmlFormatterConfig} />
}
