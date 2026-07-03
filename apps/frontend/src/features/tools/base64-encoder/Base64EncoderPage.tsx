import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { Base64Input, Base64Result } from './base64-encoder.config'
import { base64Config } from './base64-encoder.config'
import { Base64InputView, Base64ResultView } from './Base64EncoderViews'

const config: ToolEngineConfig<Base64Input, Base64Result> = {
  ...base64Config,
  renderInput: (props) => <Base64InputView {...props} />,
  renderResult: ({ result, onReset }) => <Base64ResultView result={result} onReset={onReset} />,
}

export default function Base64EncoderPage() {
  return <ToolEngine config={config} />
}
