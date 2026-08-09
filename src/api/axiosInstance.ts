import axios, { AxiosError } from "axios"
import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios"
import type { ApiResponse } from "@/types/api.types"

export const ACCESS_TOKEN_KEY = "skillbridge_access_token"
export const REFRESH_TOKEN_KEY = "skillbridge_refresh_token"
export const LOGOUT_EVENT = "auth:logout"
export const TOKENS_EVENT = "auth:tokens"

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setTokens = (accessToken: string, refreshToken?: string | null) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
  window.dispatchEvent(new Event(TOKENS_EVENT))
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.dispatchEvent(new Event(LOGOUT_EVENT))
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string | undefined,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const REFRESH_URL = "/auth/refresh-token"

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
      `${apiClient.defaults.baseURL ?? ""}${REFRESH_URL}`,
      { refreshToken }
    )

    setTokens(data.data.accessToken)
    return data.data.accessToken
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retried?: boolean })
      | undefined

    const isRefreshRequest = original?.url === REFRESH_URL
    const status = error.response?.status

    if (status === 401 && original && !original._retried && !isRefreshRequest) {
      original._retried = true

      try {
        const newToken = await refreshAccessToken()
        return apiClient({
          ...original,
          headers: {
            ...(original.headers ?? {}),
            Authorization: `Bearer ${newToken}`,
          },
        })
      } catch {
        clearTokens()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)
