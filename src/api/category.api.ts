import { apiClient } from "./axiosInstance"
import type { ApiResponse } from "@/types/api.types"
import type { Category } from "@/types/service.types"

export interface CategoryPayload {
  name: string
  description?: string
  icon?: string
}

export const categoryApi = {
  async getAll(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories")
    return data.data
  },

  async getById(id: string): Promise<Category> {
    const { data } = await apiClient.get<ApiResponse<Category>>(
      `/categories/${id}`
    )
    return data.data
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await apiClient.post<ApiResponse<Category>>(
      "/categories",
      payload
    )
    return data.data
  },

  async update(id: string, payload: Partial<CategoryPayload>): Promise<Category> {
    const { data } = await apiClient.patch<ApiResponse<Category>>(
      `/categories/${id}`,
      payload
    )
    return data.data
  },

  async remove(id: string): Promise<Category> {
    const { data } = await apiClient.delete<ApiResponse<Category>>(
      `/categories/${id}`
    )
    return data.data
  },
}
