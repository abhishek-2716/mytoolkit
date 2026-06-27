import type { ToolCategorySlug } from '../constants/tools.constants'

export interface Tool {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  category: ToolCategorySlug
  icon: string
  tags: string[]
  isNew?: boolean
  isPopular?: boolean
  isFeatured?: boolean
  isComingSoon?: boolean
  supportedFormats?: string[]
  createdAt: string
  updatedAt: string
}

export interface ToolCategoryInfo {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  toolCount: number
  color?: string
}

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
