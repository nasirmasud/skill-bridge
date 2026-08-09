import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { orderApi, type OrderQuery } from "@/api/order.api"
import { getErrorMessage } from "@/lib/utils"
import type { OrderStatus } from "@/types/order.types"

export const useMyOrders = (query: OrderQuery) =>
  useQuery({
    queryKey: ["orders", "my", query],
    queryFn: () => orderApi.getMyOrders(query),
  })

export const useReceivedOrders = (query: OrderQuery) =>
  useQuery({
    queryKey: ["orders", "received", query],
    queryFn: () => orderApi.getReceivedOrders(query),
  })

export const useAdminOrders = (query: OrderQuery) =>
  useQuery({
    queryKey: ["orders", "admin", query],
    queryFn: () => orderApi.getAll(query),
  })

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApi.getById(id),
    enabled: Boolean(id),
  })

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order placed successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order status updated")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: orderApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order deleted successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
