import type { ReactNode } from 'react'

import type { ToolMeta } from '@/registry'

import type { ToolInputConfig } from './tool-input.types'
import type { ToolLifecycleHandlers } from './tool-lifecycle.types'
import type { LayoutMode, ToolResultType } from './tool-result.types'
import type { ToolState } from './tool-state.types'

/**
 * Tool Engine Configuration
 * ══════════════════════════════════════════════════════════════════════════
 *
 * This is the single contract every tool must satisfy.
 *
 * A tool author writes ONLY:
 *  1. ToolMeta reference (from registry)
 *  2. Input configuration (type + validation)
 *  3. Processing function (the actual tool logic)
 *  4. Result type (how to render output)
 *  5. Optionally: layout mode, custom renderers, lifecycle hooks
 *
 * The engine handles:
 *  - Layout and structure
 *  - State machine and transitions
 *  - Loading states and progress
 *  - Error handling and display
 *  - Accessibility (ARIA, focus, live regions)
 *  - SEO (MetaTags + JSON-LD from ToolMeta)
 *  - Related tools section
 *  - Copy/Download/Reset/Cancel actions
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Which execution environment handles the process() function. */
export type ProcessingAdapterType = 'browser' | 'server' | 'worker'

/**
 * Render props passed to a custom input renderer.
 * Provides everything needed to build a custom input UI.
 */
export interface ToolInputRenderProps<TInput> {
  /** Current tool state — use to check isLoading, isError, etc. */
  state: Pick<ToolState<TInput>, 'status' | 'input' | 'error' | 'progress'>
  /** Call when input changes. Triggers the 'input-ready' state. */
  onInputChange: (input: TInput | null) => void
  /** Call to trigger processing. Only valid when canProcess is true. */
  onProcess: () => void
  /** Whether processing can currently be triggered. */
  canProcess: boolean
  /** Whether any loading is in progress. */
  isLoading: boolean
}

/**
 * Render props passed to a custom result renderer.
 */
export interface ToolResultRenderProps<TResult> {
  result: TResult
  /** Reset the tool to idle state. */
  onReset: () => void
}

/**
 * Optional persistent settings for a tool.
 * When provided, settings are stored in localStorage between sessions.
 * Example: JSON formatter indent size, password generator length.
 */
export interface ToolSettingsConfig<TSettings = Record<string, unknown>> {
  /** Storage key — must be unique per tool. Use '{slug}-settings'. */
  storageKey: string
  /** Default values applied on first use. */
  defaults: TSettings
}

/**
 * ToolEngineConfig<TInput, TResult>
 *
 * The complete specification for a single tool.
 * Generic types enforce end-to-end type safety:
 *  - TInput  = the type the process() function receives
 *  - TResult = the type the process() function returns
 *
 * @example
 * // Minimal browser text tool
 * const myConfig: ToolEngineConfig<string, string> = {
 *   tool: getToolBySlug('my-tool')!,
 *   processingMode: 'browser',
 *   input: { type: 'text', validate: (v) => validInput(v) },
 *   process: (input, signal) => input.toUpperCase(),
 *   resultType: 'text',
 * }
 */
export interface ToolEngineConfig<TInput = unknown, TResult = unknown> {
  /**
   * The tool's metadata from the registry.
   * Drives the page title, description, badges, related tools, and SEO.
   */
  tool: ToolMeta

  /**
   * Determines how the process() function is executed.
   *  'browser' — runs synchronously or asynchronously in the main thread.
   *  'server'  — calls the backend API.
   *  'worker'  — runs in a Web Worker (future).
   * @default 'browser'
   */
  processingMode?: ProcessingAdapterType

  /**
   * The input specification — what the tool accepts and how to validate it.
   * The engine renders the correct input component based on this.
   */
  input: ToolInputConfig<TInput>

  /**
   * The tool's processing function.
   * This is the ONLY unique business logic per tool.
   *
   * Rules:
   *  - Must be pure (no DOM references, no React state)
   *  - Must throw a ToolError on failure (use createToolError())
   *  - Must respect the AbortSignal for cancellable async work
   *  - onProgress is called with 0–100 integers to update the progress bar
   *
   * @param input    - The validated, typed input
   * @param signal   - AbortSignal — abort when signal.aborted is true
   * @param onProgress - Call with 0–100 to update progress bar
   */
  process: (
    input: TInput,
    signal: AbortSignal,
    onProgress: (percent: number) => void
  ) => TResult | Promise<TResult>

  /**
   * Tells the engine which built-in result renderer to use.
   * Set to 'custom' if providing renderResult.
   */
  resultType: ToolResultType

  /**
   * The layout mode for the tool page.
   * If omitted, the engine infers a sensible default from input.type:
   *  - text input  → 'split'
   *  - file input  → 'stack'
   *  - form input  → 'form'
   */
  layoutMode?: LayoutMode

  /**
   * Custom input renderer.
   * If provided, replaces the engine's default input component entirely.
   * Use only when the default components genuinely cannot support the UI.
   */
  renderInput?: (props: ToolInputRenderProps<TInput>) => ReactNode

  /**
   * Custom result renderer.
   * If provided, replaces the built-in result component.
   * resultType must be set to 'custom' when using this.
   */
  renderResult?: (props: ToolResultRenderProps<TResult>) => ReactNode

  /**
   * Lifecycle hooks.
   * All optional — only subscribe to what you need.
   * Analytics and monitoring systems will attach here.
   */
  lifecycle?: Partial<ToolLifecycleHandlers<TInput, TResult>>

  /**
   * Persistent settings configuration.
   * When provided, a settings panel is shown and values are persisted
   * between sessions via localStorage.
   */
  settingsConfig?: ToolSettingsConfig
}

/**
 * Extract the TInput type from a ToolEngineConfig.
 * Useful for type inference in hooks that receive the config.
 */
export type InferInput<TConfig> =
  TConfig extends ToolEngineConfig<infer TInput> ? TInput : never

/**
 * Extract the TResult type from a ToolEngineConfig.
 */
export type InferResult<TConfig> =
  TConfig extends ToolEngineConfig<unknown, infer TResult> ? TResult : never

/**
 * Infer the default layout mode from an input config type.
 * Called by the engine when layoutMode is not explicitly set.
 */
export function inferLayoutMode(config: ToolEngineConfig): LayoutMode {
  if (config.layoutMode) return config.layoutMode
  const type = config.input.type
  if (type === 'text') return 'split'
  if (type === 'form') return 'form'
  return 'stack' // file, multi-file
}

/**
 * A type-safe wrapper to define a ToolEngineConfig with full inference.
 * Avoids needing to explicitly annotate generic parameters.
 *
 * @example
 * export const myConfig = defineToolConfig({
 *   tool: getToolBySlug('my-tool')!,
 *   input: { type: 'text', validate: (v) => validInput(v) },
 *   process: (input) => input.toUpperCase(),
 *   resultType: 'text',
 * })
 */
export function defineToolConfig<TInput, TResult>(
  config: ToolEngineConfig<TInput, TResult>
): ToolEngineConfig<TInput, TResult> {
  return config
}
