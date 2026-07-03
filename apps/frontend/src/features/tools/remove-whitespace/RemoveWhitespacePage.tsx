import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { RemoveWhitespaceInput, RemoveWhitespaceResult } from './remove-whitespace.config'
import { removeWhitespaceConfig } from './remove-whitespace.config'
import { RemoveWhitespaceInputView } from './RemoveWhitespaceViews'

const config: ToolEngineConfig<RemoveWhitespaceInput, RemoveWhitespaceResult> = {
  ...removeWhitespaceConfig,
  renderInput: (props) => <RemoveWhitespaceInputView {...props} />,
}

export default function RemoveWhitespacePage() {
  return <ToolEngine config={config} />
}
