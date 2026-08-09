import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import type { Role } from "@/types/user.types"

interface ProtectedRouteProps {
  allowedRoles?: Role[]
  redirectTo?: string
  deniedRedirect?: string
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
  deniedRedirect = "/",
}: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <span className="text-muted-foreground">Loading...</span>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={deniedRedirect} replace />
  }

  return <Outlet />
}
