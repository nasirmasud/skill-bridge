import { useEffect, useRef, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { setTokens } from "@/api/axiosInstance"
import { useAuthStore } from "@/store/authStore"
import { getDashboardPath } from "@/lib/utils"

interface OAuthCallbackProps {
  children: ReactNode
}

export function OAuthCallback({ children }: OAuthCallbackProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return

    if (searchParams.get("oauth") === "error") {
      handled.current = true
      setSearchParams({}, { replace: true })
      toast.error("Social login failed. Please try again.")
      return
    }

    const accessToken = searchParams.get("accessToken")
    if (!accessToken) return

    handled.current = true
    const refreshToken = searchParams.get("refreshToken")
    setTokens(accessToken, refreshToken)
    setSearchParams({}, { replace: true })

    useAuthStore.getState().hydrate().then(() => {
      const user = useAuthStore.getState().user
      if (user) {
        toast.success(`Welcome, ${user.name}`)
        navigate(getDashboardPath(user.role), { replace: true })
      } else {
        navigate("/login", { replace: true })
      }
    })
  }, [navigate, searchParams, setSearchParams])

  return <>{children}</>
}
