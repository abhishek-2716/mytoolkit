import type { ZodSchema } from 'zod'

/**
 * Tool Input System Types
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The input config is a discriminated union keyed by `type`.
 * The engine renders the appropriate input component automatically.
 *
 * Tools define WHAT input they need.
 * The engine handles HOW it is collected from the user.
 *
 * ══════════════════════════════════════════════════════════════════════════
 */
import type { ToolError } from './tool-error.types'

/** Result of input validation — either a typed value or an error. */
export type ValidationResult<T> =
  | { success: true; value: T }
  | { success: false; error: ToolError }

/** Helper to create a successful validation result. */
export function validInput<T>(value: T): ValidationResult<T> {
  return { success: true, value }
}

/** Helper to create a failed validation result. */
export function invalidInput<T>(error: ToolError): ValidationResult<T> {
  return { success: false, error }
}

/* ─── Text Input ─────────────────────────────────────────────────────────── */

/**
 * Textarea-based input for all text processing tools.
 * Examples: Word Counter, JSON Formatter, Case Converter.
 */
export interface TextInputConfig<TInput> {
  type: 'text'
  /** Shown when the textarea is empty. */
  placeholder?: string
  /** Character limit enforced in the UI. */
  maxLength?: number
  /**
   * Synchronous validation + transformation.
   * Transform the raw string into the tool's typed input.
   * Return an error if the string is invalid.
   */
  validate: (value: string) => ValidationResult<TInput>
}

/* ─── File Input ─────────────────────────────────────────────────────────── */

/**
 * Single file drag-and-drop input.
 * Examples: Image Compress, PDF to Word.
 */
export interface FileInputConfig<TInput> {
  type: 'file'
  /**
   * Accepted MIME types and/or extensions.
   * Passed to <input accept=""> and validated on drop.
   * Example: ['application/pdf', '.pdf']
   */
  accept: string[]
  /** Maximum single file size in megabytes. */
  maxSizeMb: number
  /**
   * Optional custom validator called after size/type checks pass.
   * Use for binary-level validation (magic bytes, file headers).
   */
  validate?: (file: File) => ValidationResult<TInput> | Promise<ValidationResult<TInput>>
}

/* ─── Multi-File Input ───────────────────────────────────────────────────── */

/**
 * Multiple file drag-and-drop input.
 * Examples: PDF Merge (multiple PDFs), Batch Image Compress.
 */
export interface MultiFileInputConfig<TInput> {
  type: 'multi-file'
  accept: string[]
  maxSizeMb: number
  /** Maximum number of files allowed. */
  maxFiles: number
  validate?: (files: File[]) => ValidationResult<TInput> | Promise<ValidationResult<TInput>>
}

/* ─── Form Input ─────────────────────────────────────────────────────────── */

/**
 * Structured form input with Zod schema validation.
 * Examples: Password Generator settings, BMI Calculator fields.
 */
export interface FormInputConfig<TInput> {
  type: 'form'
  /** Zod schema for validation and type inference. */
  schema: ZodSchema<TInput>
  /** Initial form values. */
  defaultValues: TInput
}

/* ─── Discriminated Union ────────────────────────────────────────────────── */

export type ToolInputConfig<TInput = unknown> =
  | TextInputConfig<TInput>
  | FileInputConfig<TInput>
  | MultiFileInputConfig<TInput>
  | FormInputConfig<TInput>

/** Type guard: narrows config to TextInputConfig. */
export function isTextInput<T>(config: ToolInputConfig<T>): config is TextInputConfig<T> {
  return config.type === 'text'
}

/** Type guard: narrows config to FileInputConfig. */
export function isFileInput<T>(config: ToolInputConfig<T>): config is FileInputConfig<T> {
  return config.type === 'file'
}

/** Type guard: narrows config to MultiFileInputConfig. */
export function isMultiFileInput<T>(
  config: ToolInputConfig<T>
): config is MultiFileInputConfig<T> {
  return config.type === 'multi-file'
}

/** Type guard: narrows config to FormInputConfig. */
export function isFormInput<T>(config: ToolInputConfig<T>): config is FormInputConfig<T> {
  return config.type === 'form'
}
