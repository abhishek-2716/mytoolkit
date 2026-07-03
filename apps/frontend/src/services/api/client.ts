import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { apiConfig } from '@/config'
import { STORAGE_KEYS } from '@/constants'

import type { ApiResponse } from '@/types'

class ApiClient {
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: `${apiConfig.baseUrl}/${apiConfig.version}`,
      timeout: apiConfig.timeout,
      headers: { 'Content-Type': 'application/json' },
    })

    this.attachRequestInterceptor()
    this.attachResponseInterceptor()
  }

  private attachRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )
  }

  private attachResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          // Future: dispatch logout action / redirect to login
        }
        return Promise.reject(this.normalizeError(error))
      }
    )
  }

  private normalizeError(error: AxiosError<ApiResponse>): Error {
    const message = error.response?.data.message ?? error.message
    return new Error(message)
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  /** Upload files with progress tracking */
  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (percent: number) => void
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: apiConfig.uploadTimeout,
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total))
        }
      },
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
