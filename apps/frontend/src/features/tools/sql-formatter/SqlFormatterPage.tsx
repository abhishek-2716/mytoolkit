import { ToolEngine } from '../engine'
import { sqlFormatterConfig } from './sql-formatter.config'

export default function SqlFormatterPage() {
  return <ToolEngine config={sqlFormatterConfig} />
}
