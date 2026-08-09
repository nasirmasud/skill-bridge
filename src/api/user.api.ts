import { apiClient } from "./axiosInstance"
import type { ApiResponse, PaginatedData } from "@/types/api.types"
import type { UpdateProfilePayload, User } from "@/types/user.types"

export interface UserQuery {
  page?: number
  limit?: number
  role?: string
}

export const userApi = {
  async getAll(query: UserQuery = {}): Promise<PaginatedData<User>> {
    const { data } = await apiClient.get<ApiResponse<User[]>>("/users", {
      params: query,
    })
    return { data: data.data, meta: data.meta! }
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/users/me")
    return data.data
  },

  async getById(id: string): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
    return data.data
  },

  async update(id: string, payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      `/users/${id}`,
      payload
    )
    return data.data
  },

  async remove(id: string): Promise<User> {
    const { data } = await apiClient.delete<ApiResponse<User>>(`/users/${id}`)
    return data.data
  },
}
