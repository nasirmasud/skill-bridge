import { create } from "zustand"
import {
  LOGOUT_EVENT,
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/api/axiosInstance"
import { userApi } from "@/api/user.api"
import type { AuthResponse, User } from "@/types/user.types"

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (result: AuthResponse) => void
  logout: () => void
  setUser: (user: User) => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: getAccessToken(),
  isAuthenticated: Boolean(getAccessToken()),
  isLoading: false,

  login: (result) => {
    setTokens(result.accessToken, result.refreshToken)
    set({
      user: result.user,
      accessToken: result.accessToken,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: () => {
    clearTokens()
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  setUser: (user) => set({ user }),

  hydrate: async () => {
    if (!getAccessToken()) {
      set({ isAuthenticated: false, isLoading: false })
      return
    }

    set({ isLoading: true })
    try {
      const user = await userApi.getMe()
      set({
        user,
        accessToken: getAccessToken(),
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      clearTokens()
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },
}))

if (typeof window !== "undefined") {
  window.addEventListener(LOGOUT_EVENT, () => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    })
  })
}
