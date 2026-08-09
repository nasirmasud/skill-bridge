export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  meta?: PaginationMeta
  data: T
}

export type PaginatedResponse<T> = ApiResponse<T[]>

export interface PaginatedData<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ErrorSource {
  path: string
  message: string
}

export interface ErrorResponse {
  success: false
  message: string
  errorSources?: ErrorSource[]
}
