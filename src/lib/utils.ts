import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AxiosError } from "axios"
import type { ErrorResponse } from "@/types/api.types"
import type { Role } from "@/types/user.types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ErrorResponse>
  return axiosError.response?.data?.message ?? "Something went wrong"
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "CLIENT":
      return "/dashboard/client/orders"
    case "FREELANCER":
      return "/dashboard/freelancer/services"
    case "ADMIN":
      return "/dashboard/admin/users"
  }
}
