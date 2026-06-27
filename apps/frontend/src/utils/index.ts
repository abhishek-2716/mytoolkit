import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS class names without conflicts.
 * Combines clsx (conditional logic) and tailwind-merge (conflict resolution).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format bytes into a human-readable file size string */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2)).toString()} ${units[i] ?? 'B'}`
}

/** Convert a string to a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text at a maximum length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}

/** Capitalize the first letter of a string */
export function capitalize(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Check if a file size is within the allowed limit (in MB) */
export function isFileSizeValid(bytes: number, maxMb: number): boolean {
  return bytes <= maxMb * 1024 * 1024
}

/** Check if a MIME type is in an allowed list */
export function isMimeTypeAllowed(mimeType: string, allowed: readonly string[]): boolean {
  return allowed.includes(mimeType)
}
