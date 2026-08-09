import type { ServiceStatus } from "./service.types"
import type { UserSummary } from "./user.types"

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"

export interface OrderServiceSummary {
  id: string
  title: string
  price: string
  thumbnail: string | null
  status: ServiceStatus
  freelancer: UserSummary
}

export interface Order {
  id: string
  status: OrderStatus
  totalPrice: string
  requirement: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  clientId: string
  serviceId: string
  service: OrderServiceSummary
  client: {
    id: string
    name: string
    profileImg: string | null
    email: string
  }
  review?: { id: string; rating: number } | null
}

export interface CreateOrderPayload {
  serviceId: string
  requirement?: string
}
