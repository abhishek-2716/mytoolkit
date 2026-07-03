import { ToolEngine } from '../engine'
import { extractEmailsConfig } from './extract-emails.config'

export default function ExtractEmailsPage() {
  return <ToolEngine config={extractEmailsConfig} />
}
