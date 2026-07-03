import { ToolEngine } from '../engine'
import { markdownToHtmlConfig } from './markdown-to-html.config'

export default function MarkdownToHtmlPage() {
  return <ToolEngine config={markdownToHtmlConfig} />
}
