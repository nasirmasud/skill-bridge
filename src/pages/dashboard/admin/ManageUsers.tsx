import { useMemo, useState } from "react"
import {
  Users,
  User as UserIcon,
  Shield,
  Search,
  Download,
  Eye,
  SlidersHorizontal,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  useAdminUsers,
  useRoleCount,
  useDeleteUser,
} from "@/hooks/useUsers"
import { getErrorMessage, cn } from "@/lib/utils"
import { formatDate } from "@/lib/format"
import { Pagination } from "@/components/shared/Pagination"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { usePageTitle } from "@/hooks/usePageTitle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Role, User } from "@/types/user.types"

const PAGE_SIZE = 10

const ROLE_STYLES: Record<Role, string> = {
  FREELANCER: "bg-violet-500/15 text-violet-400",
  CLIENT: "bg-sky-500/15 text-sky-400",
  ADMIN: "bg-amber-500/15 text-amber-400",
}

const ROLE_LABELS: Record<Role, string> = {
  FREELANCER: "Freelancer",
  CLIENT: "Client",
  ADMIN: "Admin",
}

const PIE_COLORS = ["var(--primary)", "#38bdf8", "#f59e0b"]

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  delta,
}: {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string | number
  delta: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            iconBg
          )}
        >
          <Icon size={20} className={iconColor} strokeWidth={2} />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
          <TrendingUp size={12} strokeWidth={2.5} />
          {delta}
        </span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">vs last month</div>
    </div>
  )
}

function Sparkline() {
  const points =
    "0,28 15,22 30,25 45,15 60,18 75,8 90,14 105,6 120,10 135,2 150,7"
  return (
    <svg
      viewBox="0 0 150 34"
      className="h-10 w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,34 ${points} 150,34`}
        fill="url(#sparkFill)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ManageUsers() {
  usePageTitle("Manage Users")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<"ALL" | Role>("ALL")
  const [viewTarget, setViewTarget] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    page: 1,
    limit: 100,
  })
  const { data: freelancerTotal } = useRoleCount("FREELANCER")
  const { data: clientTotal } = useRoleCount("CLIENT")
  const { data: adminTotal } = useRoleCount("ADMIN")
  const deleteUser = useDeleteUser()

  const users = useMemo(() => data?.data ?? [], [data])

  const stats = useMemo(
    () => ({
      total: freelancerTotal! + clientTotal! + adminTotal!,
      freelancers: freelancerTotal ?? 0,
      clients: clientTotal ?? 0,
      admins: adminTotal ?? 0,
    }),
    [freelancerTotal, clientTotal, adminTotal]
  )

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase()
        const matchesSearch =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        const matchesRole = role === "ALL" || u.role === role
        return matchesSearch && matchesRole
      }),
    [users, search, role]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  const pieData = useMemo(
    () =>
      [
        { name: "Freelancers", value: stats.freelancers },
        { name: "Clients", value: stats.clients },
        { name: "Admins", value: stats.admins },
      ].filter((d) => d.value > 0),
    [stats]
  )

  const newUsersThisMonth = useMemo(
    () =>
      users.filter((u) => {
        const d = new Date(u.createdAt)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
    [users]
  )

  const handleExport = () => {
    const rows = [
      ["Name", "Email", "Role", "Joined"],
      ...filtered.map((u) => [u.name, u.email, ROLE_LABELS[u.role], formatDate(u.createdAt)]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteUser.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  const loadingStats =
    freelancerTotal === undefined ||
    clientTotal === undefined ||
    adminTotal === undefined

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, search and manage all users on the platform.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download size={16} />
          Export Users
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        {/* Left: stats + table */}
        <div>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              iconBg="bg-violet-500/15"
              iconColor="text-violet-400"
              label="Total Users"
              value={loadingStats ? "—" : stats.total.toLocaleString()}
              delta="+12.5%"
            />
            <StatCard
              icon={UserIcon}
              iconBg="bg-sky-500/15"
              iconColor="text-sky-400"
              label="Freelancers"
              value={loadingStats ? "—" : stats.freelancers.toLocaleString()}
              delta="+8.3%"
            />
            <StatCard
              icon={UserIcon}
              iconBg="bg-emerald-500/15"
              iconColor="text-emerald-400"
              label="Clients"
              value={loadingStats ? "—" : stats.clients.toLocaleString()}
              delta="+15.7%"
            />
            <StatCard
              icon={Shield}
              iconBg="bg-amber-500/15"
              iconColor="text-amber-400"
              label="Admins"
              value={loadingStats ? "—" : stats.admins.toLocaleString()}
              delta="+2.7%"
            />
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative flex min-w-[240px] flex-1 items-center">
              <Search
                size={15}
                className="absolute left-3 text-muted-foreground"
              />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v as "ALL" | Role)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="FREELANCER">Freelancer</SelectItem>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearch("")
                setRole("ALL")
                setPage(1)
              }}
            >
              <SlidersHorizontal size={14} />
              Reset
            </Button>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
            {isError ? (
              <div className="p-6">
                <ErrorState
                  message={getErrorMessage(error)}
                  onRetry={() => refetch()}
                />
              </div>
            ) : isLoading ? (
              <div className="p-6">
                <LoadingState count={5} variant="rows" />
              </div>
            ) : pageItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <Users className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">No users found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-4 font-medium">User</th>
                    <th className="px-4 py-4 font-medium">Role</th>
                    <th className="px-4 py-4 font-medium">Joined</th>
                    <th className="px-4 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            {u.profileImg ? (
                              <AvatarImage src={u.profileImg} alt={u.name} />
                            ) : null}
                            <AvatarFallback>{initials(u.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium",
                            ROLE_STYLES[u.role]
                          )}
                        >
                          {ROLE_LABELS[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setViewTarget(u)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-rose-400 hover:text-rose-300"
                            disabled={u.role === "ADMIN"}
                            title={
                              u.role === "ADMIN"
                                ? "Admin accounts cannot be deleted"
                                : undefined
                            }
                            onClick={() => setDeleteTarget(u)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Showing {pageItems.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}{" "}
              to {(safePage - 1) * PAGE_SIZE + pageItems.length} of{" "}
              {filtered.length} users
            </span>
            <Pagination
              meta={{ page: safePage, limit: PAGE_SIZE, total: filtered.length }}
              onPageChange={setPage}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* User overview */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">User Overview</h3>
            {loadingStats ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="relative mt-2 flex justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={70}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">
                      {stats.total.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {pieData.map((it, i) => (
                    <div
                      key={it.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                          }}
                        />
                        {it.name}
                      </span>
                      <span>
                        {it.value.toLocaleString()} (
                        {stats.total > 0
                          ? ((it.value / stats.total) * 100).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* New users */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">New Users</h3>
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{newUsersThisMonth}</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                <TrendingUp size={12} strokeWidth={2.5} />
                18.6%
              </span>
            </div>
            <div className="mt-3">
              <Sparkline />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>May 1</span>
              <span>May 15</span>
              <span>May 31</span>
            </div>
          </div>

          {/* Recent signups */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Recent Signups</h3>
            <div className="mt-3 space-y-2.5">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <Avatar className="size-8">
                    {u.profileImg ? (
                      <AvatarImage src={u.profileImg} alt={u.name} />
                    ) : null}
                    <AvatarFallback>{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_LABELS[u.role]}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View dialog */}
      <Dialog
        open={Boolean(viewTarget)}
        onOpenChange={(open) => {
          if (!open) setViewTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          {viewTarget && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    {viewTarget.profileImg ? (
                      <AvatarImage src={viewTarget.profileImg} alt={viewTarget.name} />
                    ) : null}
                    <AvatarFallback>{initials(viewTarget.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{viewTarget.name}</DialogTitle>
                    <DialogDescription>{viewTarget.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium",
                      ROLE_STYLES[viewTarget.role]
                    )}
                  >
                    {ROLE_LABELS[viewTarget.role]}
                  </span>
                </div>
                {viewTarget.phone ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={14} />
                    {viewTarget.phone}
                  </div>
                ) : null}
                {viewTarget.bio ? (
                  <p className="text-sm text-muted-foreground">
                    {viewTarget.bio}
                  </p>
                ) : null}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={14} />
                  Joined {formatDate(viewTarget.createdAt)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} />
                  {viewTarget.email}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium">{deleteTarget?.name}</span> from the
              platform. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
