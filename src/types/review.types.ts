export interface Review {
  id: string
  rating: number
  comment: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  clientId: string
  serviceId: string
  orderId: string
  client: {
    id: string
    name: string
    profileImg: string | null
  }
  service?: { id: string; title: string }
}

export interface CreateReviewPayload {
  orderId: string
  serviceId: string
  rating: number
  comment?: string
}
