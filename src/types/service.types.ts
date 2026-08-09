import type { UserSummary } from "./user.types"
import type { Review } from "./review.types"

export type ServiceStatus = "ACTIVE" | "INACTIVE" | "DRAFT"

export interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CategorySummary {
  id: string
  name: string
  icon: string | null
}

export interface Service {
  id: string
  title: string
  description: string
  price: string
  deliveryDays: number
  thumbnail: string | null
  status: ServiceStatus
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  categoryId: string
  freelancerId: string
  category: CategorySummary
  freelancer: UserSummary
  _count?: { reviews: number }
}

export interface ServiceDetail extends Service {
  avgRating: number
  reviewCount: number
  reviews: Review[]
}

export interface ServiceFilters {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}

export interface CreateServicePayload {
  title: string
  description: string
  price: number
  deliveryDays: number
  categoryId: string
  thumbnail?: string
  status?: ServiceStatus
}
