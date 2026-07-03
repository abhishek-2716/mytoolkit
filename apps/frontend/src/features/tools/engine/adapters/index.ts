/**
 * Processing Adapters — Barrel
 */

import type { ProcessingAdapterType } from '../types/tool-config.types'
import type { ProcessingAdapter } from './adapter.types'
import { browserAdapter } from './browser.adapter'
import { serverAdapter } from './server.adapter'
import { workerAdapter } from './worker.adapter'

export type { AdapterCallbacks, ProcessFn, ProcessingAdapter } from './adapter.types'
export { browserAdapter } from './browser.adapter'
export { serverAdapter } from './server.adapter'
export { workerAdapter } from './worker.adapter'

/**
 * Returns the correct adapter instance for the given processing mode.
 * The engine calls this when composing the execution pipeline.
 */
export function getAdapter(mode: ProcessingAdapterType = 'browser'): ProcessingAdapter {
  switch (mode) {
    case 'browser':
      return browserAdapter
    case 'server':
      return serverAdapter
    case 'worker':
      return workerAdapter
  }
}
