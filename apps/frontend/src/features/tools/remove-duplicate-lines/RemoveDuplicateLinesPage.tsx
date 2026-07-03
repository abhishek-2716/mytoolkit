import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type {
  RemoveDuplicateLinesInput,
  RemoveDuplicateLinesResult,
} from './remove-duplicate-lines.config'
import { removeDuplicateLinesConfig } from './remove-duplicate-lines.config'
import {
  RemoveDuplicateLinesInputView,
  RemoveDuplicateLinesResultView,
} from './RemoveDuplicateLinesViews'

const config: ToolEngineConfig<RemoveDuplicateLinesInput, RemoveDuplicateLinesResult> = {
  ...removeDuplicateLinesConfig,
  renderInput: (props) => <RemoveDuplicateLinesInputView {...props} />,
  renderResult: ({ result, onReset }) => (
    <RemoveDuplicateLinesResultView result={result} onReset={onReset} />
  ),
}

export default function RemoveDuplicateLinesPage() {
  return <ToolEngine config={config} />
}
