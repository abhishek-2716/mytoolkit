import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { JsonMinifierInput, JsonMinifierResult } from './json-minifier.config'
import { jsonMinifierConfig } from './json-minifier.config'
import { JsonMinifierResultView } from './JsonMinifierResultView'

const config: ToolEngineConfig<JsonMinifierInput, JsonMinifierResult> = {
  ...jsonMinifierConfig,
  renderResult: ({ result, onReset }) => (
    <JsonMinifierResultView result={result} onReset={onReset} />
  ),
}

export default function JsonMinifierPage() {
  return <ToolEngine config={config} />
}
