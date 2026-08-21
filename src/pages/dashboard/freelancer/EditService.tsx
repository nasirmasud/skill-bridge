import { useParams, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useService, useUpdateService } from "@/hooks/useServices"
import { usePageTitle } from "@/hooks/usePageTitle"
import { getErrorMessage } from "@/lib/utils"
import { ServiceForm } from "@/components/service/ServiceForm"
import { ErrorState } from "@/components/shared/ErrorState"
import type { CreateServicePayload } from "@/types/service.types"

export default function EditService() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { data: service, isLoading, isError, error, refetch } = useService(id)
  const updateService = useUpdateService()

  usePageTitle(service ? `Edit: ${service.title}` : undefined)

  const handleSubmit = async (payload: CreateServicePayload) => {
    try {
      await updateService.mutateAsync({ id, payload })
      toast.success("Service updated successfully")
      navigate("/dashboard/freelancer/services")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-[1200px]">
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    )
  }

  if (isLoading || !service) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the details of your service.
        </p>
      </div>

      <ServiceForm
        initialValues={{
          title: service.title,
          categoryId: service.categoryId,
          description: service.description,
          price: Number(service.price),
          deliveryDays: service.deliveryDays,
          thumbnail: service.thumbnail ?? "",
          gallery: service.gallery ?? [],
          tools: service.tools ?? [],
          highlights: service.highlights ?? [],
          whatYouGet: service.whatYouGet ?? [],
          packageName: service.packageName ?? "",
          packageFeatures: service.packageFeatures ?? [],
          status: service.status,
        }}
        isSubmitting={updateService.isPending}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard/freelancer/services")}
      />
    </div>
  )
}
