import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AxiosError } from "axios"
import type { ErrorResponse } from "@/types/api.types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ErrorResponse>
  return axiosError.response?.data?.message ?? "Something went wrong"
}
