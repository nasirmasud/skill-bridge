import { apiClient } from "./axiosInstance"
import type { ApiResponse } from "@/types/api.types"
import type { CreateReviewPayload, Review } from "@/types/review.types"

export interface UpdateReviewPayload {
  rating?: number
  comment?: string
}

export const reviewApi = {
  async getByService(serviceId: string): Promise<Review[]> {
    const { data } = await apiClient.get<ApiResponse<Review[]>>(
      `/reviews/service/${serviceId}`
    )
    return data.data
  },

  async getById(id: string): Promise<Review> {
    const { data } = await apiClient.get<ApiResponse<Review>>(`/reviews/${id}`)
    return data.data
  },

  async create(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await apiClient.post<ApiResponse<Review>>("/reviews", payload)
    return data.data
  },

  async update(id: string, payload: UpdateReviewPayload): Promise<Review> {
    const { data } = await apiClient.patch<ApiResponse<Review>>(
      `/reviews/${id}`,
      payload
    )
    return data.data
  },

  async remove(id: string): Promise<Review> {
    const { data } = await apiClient.delete<ApiResponse<Review>>(`/reviews/${id}`)
    return data.data
  },
}
