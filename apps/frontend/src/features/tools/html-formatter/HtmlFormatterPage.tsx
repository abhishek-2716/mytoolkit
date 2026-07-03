import { ToolEngine } from '../engine'
import { htmlFormatterConfig } from './html-formatter.config'

export default function HtmlFormatterPage() {
  return <ToolEngine config={htmlFormatterConfig} />
}
