/**
 * Base application error.
 * All custom error classes in ToolNest extend this.
 *
 * Uses `Object.setPrototypeOf` to fix `instanceof` checks in transpiled ES5 output.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Thrown when an API call fails.
 * Carries the HTTP status code and the originating endpoint.
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint?: string,
    code?: string
  ) {
    super(message, code ?? `HTTP_${status}`, { status, endpoint })
    this.name = 'ApiError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Thrown when user input or form data fails validation.
 * `fields` lists the failing field names (e.g. for inline error display).
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields: string[] = [],
    code?: string
  ) {
    super(message, code ?? 'VALIDATION_ERROR', { fields })
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Thrown when a file upload fails (size, MIME type, or server rejection).
 * `maxSizeMb` carries the limit that was violated (when applicable).
 */
export class UploadError extends AppError {
  constructor(
    message: string,
    public readonly file?: string,
    public readonly maxSizeMb?: number,
    code?: string
  ) {
    super(message, code ?? 'UPLOAD_ERROR', { file, maxSizeMb })
    this.name = 'UploadError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Narrow an unknown `catch` value to an `Error`.
 * Returns the original if it is already an Error instance; wraps primitives otherwise.
 */
export function toError(value: unknown): Error {
  if (value instanceof Error) return value
  return new Error(String(value))
}

/**
 * Type guard — returns true when the value is a known AppError subclass.
 */
export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError
}
