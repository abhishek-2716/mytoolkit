import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { UrlEncoderInput, UrlEncoderResult } from './url-encoder.config'
import { urlEncoderConfig } from './url-encoder.config'
import { UrlEncoderInputView, UrlEncoderResultView } from './UrlEncoderViews'

const config: ToolEngineConfig<UrlEncoderInput, UrlEncoderResult> = {
  ...urlEncoderConfig,
  renderInput: (props) => <UrlEncoderInputView {...props} />,
  renderResult: ({ result, onReset }) => <UrlEncoderResultView result={result} onReset={onReset} />,
}

export default function UrlEncoderPage() {
  return <ToolEngine config={config} />
}
