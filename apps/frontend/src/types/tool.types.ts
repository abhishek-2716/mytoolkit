/**
 * Re-export canonical tool types from the registry.
 *
 * ToolMeta is the single source of truth for all tool data.
 */
export type {
  ProcessingMode,
  ToolCategoryMeta,
  ToolDifficulty,
  ToolMeta,
  ToolSeoMeta,
  ToolStatus,
} from '@/registry'

export interface ToolStats {
  totalTools: number
  totalCategories: number
  filesProcessed: number
  monthlyUsers: number
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}
