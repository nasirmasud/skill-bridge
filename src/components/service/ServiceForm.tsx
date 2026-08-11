import { useState } from "react"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  Gem,
  User,
  Lightbulb,
  Tag,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  CreateServicePayload,
  ServiceStatus,
} from "@/types/service.types"

const STEP_LABELS = [
  "Service Details",
  "Pricing & Packages",
  "Gallery & FAQ",
  "Publish",
]

const serviceSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title must be at most 120 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be at most 5000 characters"),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),
  deliveryDays: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Delivery time must be at least 1 day"),
  tools: z.string().optional(),
  thumbnail: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  gallery: z.string().optional(),
  highlights: z.string().optional(),
  whatYouGet: z.string().optional(),
  packageName: z.string().optional(),
  packageFeatures: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).default("DRAFT"),
})

type FormValues = z.infer<typeof serviceSchema>

const TIPS = [
  {
    icon: Lightbulb,
    title: "Create a clear title",
    body: "Make your title specific and client-focused.",
  },
  {
    icon: Tag,
    title: "Write a detailed description",
    body: "Explain the benefits, process, and what you deliver.",
  },
  {
    icon: Sparkles,
    title: "Use high quality visuals",
    body: "Images and previews help clients trust your service.",
  },
  {
    icon: User,
    title: "Set realistic delivery time",
    body: "Be honest about how long it will take.",
  },
]

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function splitList(value?: string): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

interface ServiceFormProps {
  initialValues?: Partial<CreateServicePayload> & { id?: string }
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (payload: CreateServicePayload) => Promise<void> | void
  onCancel: () => void
}

export function ServiceForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const [step, setStep] = useState(0)
  const { data: categories = [] } = useCategories()

  const form = useForm<FormValues>({
    resolver: zodResolver(serviceSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: initialValues?.title ?? "",
      categoryId: initialValues?.categoryId ?? "",
      description: initialValues?.description ?? "",
      price: initialValues?.price ?? undefined,
      deliveryDays: initialValues?.deliveryDays ?? undefined,
      tools: initialValues?.tools?.join(", ") ?? "",
      thumbnail: initialValues?.thumbnail ?? "",
      gallery: initialValues?.gallery?.join(", ") ?? "",
      highlights: initialValues?.highlights?.join(", ") ?? "",
      whatYouGet: initialValues?.whatYouGet?.join(", ") ?? "",
      packageName: initialValues?.packageName ?? "",
      packageFeatures: initialValues?.packageFeatures?.join(", ") ?? "",
      status: initialValues?.status ?? "DRAFT",
    },
  })

  const { register, formState } = form
  const errors = formState.errors

  const values = useWatch({ control: form.control })

  const canContinue = (stepNumber: number) => {
    switch (stepNumber) {
      case 0:
        return (
          !errors.title &&
          !errors.categoryId &&
          !errors.description &&
          !errors.deliveryDays &&
          Boolean(
            values.title?.trim() &&
              values.categoryId &&
              values.description?.trim() &&
              values.deliveryDays
          )
        )
      case 1:
        return !errors.price && Boolean(values.price && values.price > 0)
      default:
        return true
    }
  }

  const handleContinue = async () => {
    if (step === 0) {
      const ok = await form.trigger([
        "title",
        "categoryId",
        "description",
        "deliveryDays",
      ])
      if (ok) setStep(1)
      return
    }
    if (step === 1) {
      const ok = await form.trigger(["price"])
      if (ok) setStep(2)
      return
    }
    setStep(3)
  }

  const handlePublish = form.handleSubmit(async (formValues) => {
    const payload: CreateServicePayload = {
      title: formValues.title,
      categoryId: formValues.categoryId,
      description: formValues.description,
      price: Number(formValues.price),
      deliveryDays: Number(formValues.deliveryDays),
      status: formValues.status as ServiceStatus,
      thumbnail: formValues.thumbnail || undefined,
      tools: splitList(formValues.tools),
      gallery: splitList(formValues.gallery),
      highlights: splitList(formValues.highlights),
      whatYouGet: splitList(formValues.whatYouGet),
      packageName: formValues.packageName || undefined,
      packageFeatures: splitList(formValues.packageFeatures),
    }
    await onSubmit(payload)
  })

  const categoryName =
    categories.find((c) => c.id === values.categoryId)?.name ?? "—"

  return (
    <div>
      {/* Stepper */}
      <div className="mb-8 flex items-center overflow-x-auto">
        {STEP_LABELS.map((label, idx) => (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => step > idx && setStep(idx)}
              disabled={step <= idx}
              className={cn(
                "flex shrink-0 items-center gap-2.5",
                step > idx ? "cursor-pointer" : "cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  step === idx
                    ? "border-primary bg-primary text-primary-foreground"
                    : step > idx
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                )}
              >
                {step > idx ? <Check size={16} /> : idx + 1}
              </span>
              <span
                className={cn(
                  "hidden whitespace-nowrap text-sm sm:block",
                  step === idx ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
            {idx < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px w-10 sm:w-16",
                  step > idx ? "bg-primary/50" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="rounded-2xl border bg-card p-6">
          <form
            onSubmit={handlePublish}
            className={cn(step !== 3 && "flex flex-col gap-5")}
          >
            {step === 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Service Title"
                    required
                    hint={errors.title?.message}
                  >
                    <Input
                      className="bg-muted/50"
                      placeholder="e.g. I will design a modern and responsive website"
                      {...register("title")}
                      aria-invalid={Boolean(errors.title)}
                    />
                  </Field>
                  <Field
                    label="Category"
                    required
                    hint={errors.categoryId?.message}
                  >
                    <Select
                      value={values.categoryId}
                      onValueChange={(v) => form.setValue("categoryId", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field
                  label="Service Tags"
                  hint="Add comma-separated tags to help clients find your service."
                >
                  <Input
                    className="bg-muted/50"
                    placeholder="e.g. react, tailwind, responsive"
                    {...register("tools")}
                  />
                </Field>

                <Field
                  label="Service Description"
                  required
                  hint={errors.description?.message}
                >
                  <div className="relative">
                    <Textarea
                      rows={6}
                      maxLength={5000}
                      className="resize-none bg-muted/50"
                      placeholder="Describe your service in detail. Explain how you will solve the client's problem and what they will get."
                      {...register("description")}
                      aria-invalid={Boolean(errors.description)}
                    />
                    <span className="absolute bottom-2.5 right-3.5 text-xs text-muted-foreground">
                      {(values.description ?? "").length} / 5000
                    </span>
                  </div>
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Delivery Time (days)"
                    required
                    hint={errors.deliveryDays?.message}
                  >
                    <Input
                      type="number"
                      min={1}
                      className="bg-muted/50"
                      placeholder="e.g. 2"
                      {...register("deliveryDays")}
                      aria-invalid={Boolean(errors.deliveryDays)}
                    />
                  </Field>
                  <div className="flex items-end rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <Gem
                      size={20}
                      className="mr-3 shrink-0 text-primary"
                    />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Stand out with great service details.{" "}
                      </span>
                      Well-written descriptions with clear benefits get more
                      orders.
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Starting Price ($)"
                    required
                    hint={errors.price?.message}
                  >
                    <Input
                      type="number"
                      min={1}
                      step="0.01"
                      className="bg-muted/50"
                      placeholder="e.g. 50"
                      {...register("price")}
                      aria-invalid={Boolean(errors.price)}
                    />
                  </Field>
                  <Field label="Package Name">
                    <Input
                      className="bg-muted/50"
                      placeholder="e.g. Basic / Standard / Premium"
                      {...register("packageName")}
                    />
                  </Field>
                </div>
                <Field
                  label="Package Features"
                  hint="Comma-separated list of what's included in the package."
                >
                  <Textarea
                    rows={4}
                    className="resize-none bg-muted/50"
                    placeholder="e.g. responsive design, source code, 2 revisions"
                    {...register("packageFeatures")}
                  />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Thumbnail URL"
                    hint={errors.thumbnail?.message}
                  >
                    <Input
                      className="bg-muted/50"
                      placeholder="https://..."
                      {...register("thumbnail")}
                      aria-invalid={Boolean(errors.thumbnail)}
                    />
                  </Field>
                  <Field
                    label="Gallery URLs"
                    hint="Comma-separated image URLs."
                  >
                    <Input
                      className="bg-muted/50"
                      placeholder="https://..., https://..."
                      {...register("gallery")}
                    />
                  </Field>
                </div>
                <Field
                  label="Highlights"
                  hint="Comma-separated key strengths of your service."
                >
                  <Input
                    className="bg-muted/50"
                    placeholder="e.g. 5 years experience, fast delivery"
                    {...register("highlights")}
                  />
                </Field>
                <Field
                  label="What You Get"
                  hint="Comma-separated deliverables."
                >
                  <Textarea
                    rows={4}
                    className="resize-none bg-muted/50"
                    placeholder="e.g. full source code, design files, documentation"
                    {...register("whatYouGet")}
                  />
                </Field>
              </>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Field
                  label="Publish Status"
                  hint="Draft services are hidden from clients."
                >
                  <Select
                    value={values.status}
                    onValueChange={(v) =>
                      form.setValue("status", v as ServiceStatus)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active (publish now)</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <div className="overflow-hidden rounded-xl border">
                  <div className="bg-muted/50 px-4 py-3 text-sm font-medium">
                    Service Preview
                  </div>
                  <div className="p-4">
                    {values.thumbnail ? (
                      <img
                        src={values.thumbnail}
                        alt="Preview"
                        className="aspect-video w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
                        <ImageIcon size={36} className="text-muted-foreground/40" />
                      </div>
                    )}
                    <p className="mt-3 text-sm font-semibold">
                      {values.title || "Service Title"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {values.description || "Service description will appear here."}
                    </p>
                    <div className="mt-4 space-y-2.5 border-t pt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium text-primary">
                          {categoryName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium">
                          {values.deliveryDays || "—"} day(s)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">From</span>
                        <span className="font-medium">
                          ${values.price ? Number(values.price).toLocaleString() : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step !== 3 && (
              <div className="mt-7 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      <ChevronLeft />
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    disabled={!canContinue(step)}
                    onClick={handleContinue}
                  >
                    Save & Continue
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-7 flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    <ChevronLeft />
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    {submitLabel}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="mb-4 text-base font-semibold">Service Tips</h3>
            <ul className="space-y-4">
              {TIPS.map((tip) => (
                <li key={tip.title} className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <tip.icon size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tip.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {tip.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
