import type { ToolEngineConfig } from '../engine'
import { ToolEngine } from '../engine'
import { htmlPreviewConfig } from './html-preview.config'

const config: ToolEngineConfig<string, string> = {
  ...htmlPreviewConfig,
  renderResult: ({ result, onReset }) => (
    <div className="space-y-3">
      <iframe
        srcDoc={result}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-96 rounded-lg border border-border bg-white"
        title="HTML Preview"
      />
      <button
        onClick={onReset}
        className="text-sm text-foreground-muted hover:text-foreground transition-colors"
      >
        ← Reset
      </button>
    </div>
  ),
}

export default function HtmlPreviewPage() {
  return <ToolEngine config={config} />
}
