import { apiClient } from "./axiosInstance"
import type { ApiResponse, PaginatedData } from "@/types/api.types"
import type {
  CreateServicePayload,
  Service,
  ServiceDetail,
  ServiceFilters,
} from "@/types/service.types"

export const serviceApi = {
  async getAll(filters: ServiceFilters = {}): Promise<PaginatedData<Service>> {
    const { data } = await apiClient.get<ApiResponse<Service[]>>("/services", {
      params: filters,
    })
    return { data: data.data, meta: data.meta! }
  },

  async getById(id: string): Promise<ServiceDetail> {
    const { data } = await apiClient.get<ApiResponse<ServiceDetail>>(
      `/services/${id}`
    )
    return data.data
  },

  async getByFreelancer(freelancerId: string): Promise<Service[]> {
    const { data } = await apiClient.get<ApiResponse<Service[]>>(
      `/services/freelancer/${freelancerId}`
    )
    return data.data
  },

  async create(payload: CreateServicePayload): Promise<Service> {
    const { data } = await apiClient.post<ApiResponse<Service>>(
      "/services",
      payload
    )
    return data.data
  },

  async update(
    id: string,
    payload: Partial<CreateServicePayload>
  ): Promise<Service> {
    const { data } = await apiClient.patch<ApiResponse<Service>>(
      `/services/${id}`,
      payload
    )
    return data.data
  },

  async remove(id: string): Promise<Service> {
    const { data } = await apiClient.delete<ApiResponse<Service>>(
      `/services/${id}`
    )
    return data.data
  },
}
