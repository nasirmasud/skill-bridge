import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { serviceApi } from "@/api/service.api"
import { getErrorMessage } from "@/lib/utils"
import type {
  CreateServicePayload,
  ServiceFilters,
} from "@/types/service.types"

export const useServices = (filters: ServiceFilters) =>
  useQuery({
    queryKey: ["services", filters],
    queryFn: () => serviceApi.getAll(filters),
  })

export const useService = (id: string) =>
  useQuery({
    queryKey: ["services", id],
    queryFn: () => serviceApi.getById(id),
    enabled: Boolean(id),
  })

export const useFreelancerServices = (freelancerId: string) =>
  useQuery({
    queryKey: ["services", "freelancer", freelancerId],
    queryFn: () => serviceApi.getByFreelancer(freelancerId),
    enabled: Boolean(freelancerId),
  })

export const useCreateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Service created successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CreateServicePayload>
    }) => serviceApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Service updated successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: serviceApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Service deleted successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
