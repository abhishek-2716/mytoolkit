import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { JsonCompareInput, JsonCompareResult } from './json-compare.config'
import { jsonCompareConfig } from './json-compare.config'
import { JsonCompareInputView, JsonCompareResultView } from './JsonCompareViews'

const config: ToolEngineConfig<JsonCompareInput, JsonCompareResult> = {
  ...jsonCompareConfig,
  renderInput: (props) => <JsonCompareInputView {...props} />,
  renderResult: ({ result, onReset }) => (
    <JsonCompareResultView result={result} onReset={onReset} />
  ),
}

export default function JsonComparePage() {
  return <ToolEngine config={config} />
}
