import { useAuthStore } from "@/store/authStore"

export const useAuth = () => {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  const setUser = useAuthStore((s) => s.setUser)
  const hydrate = useAuthStore((s) => s.hydrate)

  return { user, accessToken, isAuthenticated, isLoading, login, logout, setUser, hydrate }
}
