/* eslint-disable no-console */
import { appConfig } from '@/config'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  data?: unknown
  timestamp: string
}

function buildEntry(level: LogLevel, message: string, context?: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    context,
    data,
    timestamp: new Date().toISOString(),
  }
}

function formatPrefix(entry: LogEntry): string {
  const ctx = entry.context ? ` [${entry.context}]` : ''
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}]${ctx}`
}

const isDev = appConfig.isDev

const logger = {
  /**
   * Verbose diagnostics — only emitted in development.
   * Use for tracing data flow, rendering decisions, etc.
   */
  debug(message: string, data?: unknown, context?: string): void {
    if (!isDev) return
    const entry = buildEntry('debug', message, context, data)
    console.debug(formatPrefix(entry), message, ...(data !== undefined ? [data] : []))
  },

  /**
   * General informational messages — only emitted in development.
   * Use for lifecycle events, successful operations, etc.
   */
  info(message: string, data?: unknown, context?: string): void {
    if (!isDev) return
    const entry = buildEntry('info', message, context, data)
    console.info(formatPrefix(entry), message, ...(data !== undefined ? [data] : []))
  },

  /**
   * Non-fatal issues — always emitted.
   * Use for degraded states, missing optional data, deprecation notices.
   */
  warn(message: string, data?: unknown, context?: string): void {
    const entry = buildEntry('warn', message, context, data)
    console.warn(formatPrefix(entry), message, ...(data !== undefined ? [data] : []))
  },

  /**
   * Unrecoverable errors — always emitted.
   * Use when an operation has failed and user experience is impacted.
   */
  error(message: string, error?: unknown, context?: string): void {
    const entry = buildEntry('error', message, context, error)
    console.error(formatPrefix(entry), message, ...(error !== undefined ? [error] : []))
  },
}

export { logger }
export type { LogEntry, LogLevel }
