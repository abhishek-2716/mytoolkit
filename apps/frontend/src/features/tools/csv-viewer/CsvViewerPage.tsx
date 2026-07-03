import { ToolEngine } from '../engine'
import { csvViewerConfig } from './csv-viewer.config'

export default function CsvViewerPage() {
  return <ToolEngine config={csvViewerConfig} />
}
