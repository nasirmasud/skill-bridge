import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { userApi, type UserQuery } from "@/api/user.api"
import { getErrorMessage } from "@/lib/utils"
import type { Role } from "@/types/user.types"

export const useAdminUsers = (query: UserQuery) =>
  useQuery({
    queryKey: ["users", "admin", query],
    queryFn: () => userApi.getAll(query),
  })

export const useRoleCount = (role: Role) =>
  useQuery({
    queryKey: ["users", "count", role],
    queryFn: () => userApi.getAll({ page: 1, limit: 1, role }),
    select: (data) => data.meta.total,
  })

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User deleted successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
