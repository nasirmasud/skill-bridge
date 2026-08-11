import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  ClipboardList,
  CreditCard,
  User,
  Gift,
  Pencil,
  Camera,
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ClipboardCheck,
  CheckCheck,
  SlidersHorizontal,
  Link2,
  ChevronRight,
  CheckCircle2,
  Circle,
  BadgeCheck,
  X,
  Loader2,
  type LucideIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useMyOrders } from "@/hooks/useOrders"
import { userApi } from "@/api/user.api"
import { getErrorMessage, cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { OrderStatus } from "@/types/order.types"

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .max(20, "Phone must be at most 20 characters")
    .optional()
    .or(z.literal("")),
  profileImg: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const stats = [
  {
    icon: ClipboardList,
    label: "Projects Posted",
    color: "text-violet-300",
    bg: "bg-violet-600/20",
  },
  {
    icon: ClipboardCheck,
    label: "Ongoing Projects",
    color: "text-fuchsia-300",
    bg: "bg-fuchsia-600/20",
  },
  {
    icon: CheckCheck,
    label: "Completed Projects",
    color: "text-emerald-300",
    bg: "bg-emerald-600/20",
  },
  {
    icon: CreditCard,
    label: "Total Spent",
    color: "text-amber-300",
    bg: "bg-amber-600/20",
  },
]

const ONGOING_STATUSES: OrderStatus[] = ["PENDING", "ACCEPTED", "IN_PROGRESS"]

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "address", label: "Address", icon: MapPin },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "social", label: "Social Links", icon: Link2 },
] as const

type TabId = (typeof tabs)[number]["id"]

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string
  src?: string | null
  size?: "md" | "lg"
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          size === "lg" ? "h-20 w-20" : "h-12 w-12"
        )}
      />
    )
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-semibold text-white",
        size === "lg" ? "h-20 w-20 text-xl" : "h-12 w-12 text-sm"
      )}
    >
      {initialsOf(name)}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  )
}

function VerificationRow({
  icon: Icon,
  label,
  status,
}: {
  icon: LucideIcon
  label: string
  status: "verified" | "pending" | "unverified"
}) {
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-muted-foreground/50" />
        {label}
      </span>
      {status === "verified" && (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      )}
      {status === "pending" && (
        <span className="text-xs font-medium text-amber-400">Pending</span>
      )}
      {status === "unverified" && (
        <span className="text-xs text-muted-foreground/50">Not Verified</span>
      )}
    </li>
  )
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days < 1) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} week(s) ago`
  if (days < 365) return `${Math.floor(days / 30)} month(s) ago`
  return `${Math.floor(days / 365)} year(s) ago`
}

export default function ClientProfile() {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>("personal")
  const [showReferral, setShowReferral] = useState(true)

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useMyOrders({ page: 1, limit: 100 })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      profileImg: user?.profileImg ?? "",
      bio: user?.bio ?? "",
    },
  })

  const bio = useWatch({ control: form.control, name: "bio" }) ?? ""
  const isSaving = form.formState.isSubmitting

  const orders = ordersData?.data ?? []
  const totalOrders = orders.length
  const ongoing = orders.filter((o) => ONGOING_STATUSES.includes(o.status)).length
  const completed = orders.filter((o) => o.status === "COMPLETED").length
  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.totalPrice || 0),
    0
  )

  const statValues = [
    totalOrders,
    ongoing,
    completed,
    `$${totalSpent.toLocaleString()}`,
  ]

  const recentOrders = [...orders]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4)

  const completedProfileFields = [
    Boolean(user?.profileImg),
    Boolean(user?.email),
    Boolean(user?.phone),
    Boolean(user?.bio),
  ]
  const doneCount = completedProfileFields.filter(Boolean).length
  const completionPercent = Math.round((doneCount / completedProfileFields.length) * 100)

  const verification: {
    icon: LucideIcon
    label: string
    status: "verified" | "pending" | "unverified"
  }[] = [
    { icon: Mail, label: "Email Verified", status: "verified" },
    {
      icon: Phone,
      label: "Phone Verified",
      status: user?.phone ? "verified" : "pending",
    },
    { icon: BadgeCheck, label: "Identity Verified", status: "pending" },
    { icon: MapPin, label: "Address Verified", status: "unverified" },
  ]

  const completionItems = [
    { label: "Add profile photo", done: Boolean(user?.profileImg) },
    { label: "Verify email", done: Boolean(user?.email) },
    { label: "Add phone number", done: Boolean(user?.phone) },
    { label: "Add bio", done: Boolean(user?.bio) },
  ]

  const onSubmit = form.handleSubmit(async (values) => {
    if (!user) return
    try {
      const payload: {
        name: string
        phone?: string
        bio?: string
        profileImg?: string
      } = { name: values.name }
      if (values.phone) payload.phone = values.phone
      if (values.bio) payload.bio = values.bio
      if (values.profileImg) payload.profileImg = values.profileImg

      const updated = await userApi.update(user.id, payload)
      setUser(updated)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  })

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-primary/40 text-primary hover:bg-primary/10"
          onClick={() => {
            document
              .getElementById("profile-info-form")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }}
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile summary card */}
      <div className="mb-6 flex flex-col gap-6 rounded-2xl border border-primary/25 bg-card p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar name={user.name} src={user.profileImg} size="lg" />
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("profile-img-field")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground transition-colors hover:bg-primary/80"
              aria-label="Change profile photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-2.5 w-2.5" />
              </span>
            </div>
            <p className="mb-2 text-xs font-medium text-primary">
              {user.role === "CLIENT"
                ? "Client"
                : user.role === "FREELANCER"
                  ? "Freelancer"
                  : "Administrator"}
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {user.phone ?? "—"}
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Member since{" "}
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 md:ml-auto md:w-auto sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  s.bg
                )}
              >
                <s.icon className={cn("h-4 w-4", s.color)} />
              </div>
              <div>
                <p className="text-lg leading-none font-bold">
                  {ordersLoading ? "—" : statValues[i]}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {ordersError && (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Unable to load your order stats.
        </p>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-border">
        <div className="flex items-center gap-8 overflow-x-auto text-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-2 border-b-2 pb-3 whitespace-nowrap transition-colors",
                activeTab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          {activeTab === "personal" && (
            <div
              id="profile-info-form"
              className="rounded-2xl border border-border bg-card p-6 scroll-mt-24"
            >
              <h3 className="mb-1 text-base font-semibold">
                Personal Information
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Update your personal details and how we can contact you.
              </p>

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full Name" hint={form.formState.errors.name?.message}>
                    <Input
                      className="bg-muted/50"
                      {...form.register("name")}
                      aria-invalid={Boolean(form.formState.errors.name)}
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      className="bg-muted/50"
                      {...form.register("email")}
                      disabled
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Phone Number" hint={form.formState.errors.phone?.message}>
                    <Input
                      className="bg-muted/50"
                      placeholder="+880 1XXX XXX XXX"
                      {...form.register("phone")}
                      aria-invalid={Boolean(form.formState.errors.phone)}
                    />
                  </Field>
                  <Field
                    label="Profile Image URL"
                    hint={form.formState.errors.profileImg?.message}
                  >
                    <Input
                      id="profile-img-field"
                      className="bg-muted/50"
                      placeholder="https://..."
                      {...form.register("profileImg")}
                      aria-invalid={Boolean(form.formState.errors.profileImg)}
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Bio
                  </label>
                  <Textarea
                    rows={3}
                    maxLength={500}
                    className="resize-none bg-muted/50"
                    placeholder="Tell clients a little about yourself..."
                    {...form.register("bio")}
                  />
                  <p className="text-right text-[11px] text-muted-foreground/70">
                    {bio.length}/500
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={isSaving} className="px-5">
                    {isSaving && <Loader2 className="animate-spin" />}
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== "personal" && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-1 text-base font-semibold">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "address" &&
                  "Manage your saved addresses here."}
                {activeTab === "preferences" &&
                  "Manage notification and display preferences here."}
                {activeTab === "social" &&
                  "Connect your social profiles here."}
              </p>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Recent Activity</h3>
              <span className="text-xs text-primary">View All</span>
            </div>

            {ordersLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-muted/50"
                  />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No recent activity yet. Place your first order to get started.
              </p>
            ) : (
              <div className="space-y-1">
                {recentOrders.map((o, i) => (
                  <div
                    key={o.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40",
                      i !== recentOrders.length - 1 && "border-b border-border/60"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        o.status === "COMPLETED"
                          ? "bg-emerald-600/15 text-emerald-300"
                          : "bg-violet-600/15 text-violet-300"
                      )}
                    >
                      {o.status === "COMPLETED" ? (
                        <CheckCheck className="h-4 w-4" />
                      ) : (
                        <ClipboardList className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        {o.status === "COMPLETED"
                          ? `Your order "${o.service.title}" was completed`
                          : `You placed an order for "${o.service.title}"`}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {timeAgo(o.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Account verification */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-1 text-base font-semibold">Account Verification</h3>
            <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
              Complete your profile verification to build trust.
            </p>
            <ul className="mb-5 space-y-3">
              {verification.map((v) => (
                <VerificationRow key={v.label} {...v} />
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full border-primary/40 text-primary hover:bg-primary/10"
            >
              Verify Identity
            </Button>
          </div>

          {/* Profile completion */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-1 text-base font-semibold">Profile Completion</h3>
            <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
              Complete your profile to get better recommendations.
            </p>

            <div className="mb-6 flex justify-center">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-muted/30"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="10"
                    strokeDasharray="326.7"
                    strokeDashoffset={326.7 - (326.7 * completionPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{completionPercent}%</span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">
                    {completionPercent === 100 ? "Complete!" : "Almost there!"}
                  </span>
                </div>
              </div>
            </div>

            <ul className="space-y-2.5">
              {completionItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Refer & Earn */}
          {showReferral && (
            <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-indigo-600/15 p-4">
              <button
                type="button"
                onClick={() => setShowReferral(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="mb-2 text-3xl">
                <Gift className="h-8 w-8 text-primary" />
              </p>
              <h4 className="mb-1 text-sm font-semibold">Refer &amp; Earn</h4>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                Invite your friends and earn exciting rewards.
              </p>
              <button
                type="button"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Invite Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
