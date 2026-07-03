/**
 * Tool Engine — Public API
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The only import path external code should use.
 *
 * @example
 * import { ToolEngine, defineToolConfig, validInput } from '@features/tools/engine'
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

// Main component
export { ToolEngine } from './ToolEngine'

// Types (for tool authors)
export type {
  InferInput,
  InferResult,
  ProcessingAdapterType,
  ToolEngineConfig,
  ToolInputRenderProps,
  ToolResultRenderProps,
  ToolSettingsConfig,
} from './types/tool-config.types'
export { defineToolConfig, inferLayoutMode } from './types/tool-config.types'
export type { ToolError,ToolErrorCode } from './types/tool-error.types'
export { createToolError, normalizeError } from './types/tool-error.types'
export type {
  FileInputConfig,
  FormInputConfig,
  MultiFileInputConfig,
  TextInputConfig,
  ToolInputConfig,
  ValidationResult,
} from './types/tool-input.types'
export { invalidInput, isFileInput, isFormInput,isMultiFileInput, isTextInput, validInput } from './types/tool-input.types'
export type { LifecyclePayload,ToolLifecycleHandlers } from './types/tool-lifecycle.types'
export type {
  FileResult,
  ImageResult,
  LayoutMode,
  MultipleFileResult,
  StructuredResultItem,
  TableResult,
  ToolResultType,
} from './types/tool-result.types'
export type { ToolState, ToolStatus, ToolStatusFlags } from './types/tool-state.types'
export { deriveStatusFlags,INPUT_EDITABLE_STATUSES, LOADING_STATUSES } from './types/tool-state.types'

// Hooks (for custom renderers)
export type { UseFileInputOptions, UseFileInputReturn } from './hooks/useFileInput'
export { useFileInput } from './hooks/useFileInput'
export { useToolActions } from './hooks/useToolActions'
export { useToolResult } from './hooks/useToolResult'
export { useToolState } from './hooks/useToolState'

// Components (for custom tool UIs)
export {
  ToolActions,
  ToolBadge,
  ToolBody,
  ToolEmptyState,
  ToolErrorState,
  ToolFileInput,
  ToolFileResult,
  ToolFooter,
  ToolFormInput,
  ToolHeader,
  ToolProcessingState,
  ToolResultZone,
  ToolSEOHead,
  ToolShell,
  ToolStructuredResult,
  ToolSuccessActions,
  ToolTextInput,
  ToolTextResult,
} from './components/index'
export { ToolEngine as default } from './ToolEngine'
