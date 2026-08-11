import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCreateService } from "@/hooks/useServices"
import { getErrorMessage } from "@/lib/utils"
import { ServiceForm } from "@/components/service/ServiceForm"
import type { CreateServicePayload } from "@/types/service.types"

export default function CreateService() {
  const navigate = useNavigate()
  const createService = useCreateService()

  const handleSubmit = async (payload: CreateServicePayload) => {
    try {
      await createService.mutateAsync(payload)
      toast.success("Service created successfully")
      navigate("/dashboard/freelancer/services")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new service and start attracting clients.
        </p>
      </div>

      <ServiceForm
        isSubmitting={createService.isPending}
        submitLabel="Publish Service"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard/freelancer/services")}
      />
    </div>
  )
}
