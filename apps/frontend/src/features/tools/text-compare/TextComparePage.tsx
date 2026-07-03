import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { TextCompareInput, TextCompareResult } from './text-compare.config'
import { textCompareConfig } from './text-compare.config'
import { TextCompareInputView, TextCompareResultView } from './TextCompareViews'

const config: ToolEngineConfig<TextCompareInput, TextCompareResult> = {
  ...textCompareConfig,
  renderInput: (props) => <TextCompareInputView {...props} />,
  renderResult: ({ result, onReset }) => (
    <TextCompareResultView result={result} onReset={onReset} />
  ),
}

export default function TextComparePage() {
  return <ToolEngine config={config} />
}
