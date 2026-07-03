import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import type { HtmlEncoderInput, HtmlEncoderResult } from './html-encoder.config'
import { htmlEncoderConfig } from './html-encoder.config'
import { HtmlEncoderInputView, HtmlEncoderResultView } from './HtmlEncoderViews'

const config: ToolEngineConfig<HtmlEncoderInput, HtmlEncoderResult> = {
  ...htmlEncoderConfig,
  renderInput: (props) => <HtmlEncoderInputView {...props} />,
  renderResult: ({ result, onReset }) => (
    <HtmlEncoderResultView result={result} onReset={onReset} />
  ),
}

export default function HtmlEncoderPage() {
  return <ToolEngine config={config} />
}
