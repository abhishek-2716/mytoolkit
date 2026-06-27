/** Standard shape for every API response */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error'
  message: string
  data: T
  metadata?: ApiMetadata
  errors?: ApiError[]
}

export interface ApiMetadata {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

export interface ApiError {
  field?: string
  message: string
  code?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams extends PaginationParams {
  query: string
  category?: string
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error'
