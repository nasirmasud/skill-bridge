import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  reviewApi,
  type UpdateReviewPayload,
} from "@/api/review.api"
import { getErrorMessage } from "@/lib/utils"

export const useServiceReviews = (serviceId: string) =>
  useQuery({
    queryKey: ["reviews", "service", serviceId],
    queryFn: () => reviewApi.getByService(serviceId),
    enabled: Boolean(serviceId),
  })

export const useReview = (id: string) =>
  useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewApi.getById(id),
    enabled: Boolean(id),
  })

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      queryClient.invalidateQueries({ queryKey: ["services", variables.serviceId] })
      toast.success("Review submitted successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateReviewPayload
    }) => reviewApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Review updated successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success("Review deleted successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
