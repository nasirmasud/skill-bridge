import { apiClient } from "./axiosInstance"
import type { ApiResponse, PaginatedData } from "@/types/api.types"
import type { CreateOrderPayload, Order, OrderStatus } from "@/types/order.types"

export interface OrderQuery {
  page?: number
  limit?: number
}

export const orderApi = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await apiClient.post<ApiResponse<Order>>("/orders", payload)
    return data.data
  },

  async getAll(query: OrderQuery = {}): Promise<PaginatedData<Order>> {
    const { data } = await apiClient.get<ApiResponse<Order[]>>("/orders", {
      params: query,
    })
    return { data: data.data, meta: data.meta! }
  },

  async getMyOrders(query: OrderQuery = {}): Promise<PaginatedData<Order>> {
    const { data } = await apiClient.get<ApiResponse<Order[]>>(
      "/orders/my-orders",
      { params: query }
    )
    return { data: data.data, meta: data.meta! }
  },

  async getReceivedOrders(query: OrderQuery = {}): Promise<PaginatedData<Order>> {
    const { data } = await apiClient.get<ApiResponse<Order[]>>(
      "/orders/received-orders",
      { params: query }
    )
    return { data: data.data, meta: data.meta! }
  },

  async getById(id: string): Promise<Order> {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`)
    return data.data
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status }
    )
    return data.data
  },

  async remove(id: string): Promise<Order> {
    const { data } = await apiClient.delete<ApiResponse<Order>>(`/orders/${id}`)
    return data.data
  },
}
