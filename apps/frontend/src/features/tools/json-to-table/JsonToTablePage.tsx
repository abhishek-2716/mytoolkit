import { ToolEngine } from '../engine'
import { jsonToTableConfig } from './json-to-table.config'

export default function JsonToTablePage() {
  return <ToolEngine config={jsonToTableConfig} />
}
