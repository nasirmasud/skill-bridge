import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { categoryApi, type CategoryPayload } from "@/api/category.api"
import { getErrorMessage } from "@/lib/utils"

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  })

export const useCategory = (id: string) =>
  useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryApi.getById(id),
    enabled: Boolean(id),
  })

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category created successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CategoryPayload>
    }) => categoryApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category updated successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category deleted successfully")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
