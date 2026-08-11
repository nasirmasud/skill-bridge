import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { getDashboardPath } from "@/lib/utils"

export default function DashboardIndex() {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getDashboardPath(user.role)} replace />
}
