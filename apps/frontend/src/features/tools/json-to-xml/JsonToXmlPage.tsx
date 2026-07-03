import { ToolEngine } from '../engine'
import { jsonToXmlConfig } from './json-to-xml.config'

export default function JsonToXmlPage() {
  return <ToolEngine config={jsonToXmlConfig} />
}
