import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { JsonFormatterInput, JsonFormatterResult } from './json-formatter.config'
import { jsonFormatterConfig } from './json-formatter.config'
import { JsonFormatterResultView } from './JsonFormatterResultView'

// Attach custom result renderer to the config
const config: ToolEngineConfig<JsonFormatterInput, JsonFormatterResult> = {
  ...jsonFormatterConfig,
  resultType: 'custom',
  renderResult: ({ result, onReset }) => (
    <JsonFormatterResultView result={result} onReset={onReset} />
  ),
}

export default function JsonFormatterPage() {
  return <ToolEngine config={config} />
}
