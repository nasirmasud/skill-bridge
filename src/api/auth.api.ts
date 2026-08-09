import { apiClient } from "./axiosInstance"
import type { ApiResponse } from "@/types/api.types"
import type { AuthResponse, User } from "@/types/user.types"

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: "CLIENT" | "FREELANCER"
  phone?: string
  bio?: string
  profileImg?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RefreshResponse {
  user: User
  accessToken: string
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload
    )
    return data.data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload
    )
    return data.data
  },

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await apiClient.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh-token",
      { refreshToken }
    )
    return data.data
  },
}
