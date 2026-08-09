export type Role = "ADMIN" | "CLIENT" | "FREELANCER"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  phone: string | null
  profileImg: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}

export interface UserSummary {
  id: string
  name: string
  profileImg: string | null
  bio?: string | null
  email?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  bio?: string
  profileImg?: string
}
