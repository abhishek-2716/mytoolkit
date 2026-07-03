import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { JsonToCsvInput, JsonToCsvResult } from './json-to-csv.config'
import { jsonToCsvConfig } from './json-to-csv.config'
import { JsonToCsvResultView } from './JsonToCsvResultView'

const config: ToolEngineConfig<JsonToCsvInput, JsonToCsvResult> = {
  ...jsonToCsvConfig,
  renderResult: ({ result, onReset }) => (
    <JsonToCsvResultView result={result} onReset={onReset} />
  ),
}

export default function JsonToCsvPage() {
  return <ToolEngine config={config} />
}
