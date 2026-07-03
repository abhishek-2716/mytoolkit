import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { JsonValidatorInput, JsonValidatorResult } from './json-validator.config'
import { jsonValidatorConfig } from './json-validator.config'
import { JsonValidatorResultView } from './JsonValidatorResultView'

const config: ToolEngineConfig<JsonValidatorInput, JsonValidatorResult> = {
  ...jsonValidatorConfig,
  renderResult: ({ result, onReset }) => (
    <JsonValidatorResultView result={result} onReset={onReset} />
  ),
}

export default function JsonValidatorPage() {
  return <ToolEngine config={config} />
}
