import { useMemo, useState } from "react"
import {
  Grid,
  Plus,
  Download,
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  FolderOpen,
  Briefcase,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Palette,
  PenTool,
  TrendingUp,
  Video,
  ShieldCheck,
  Sparkles,
  Loader2 as Spinner,
  type LucideIcon,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories"
import { getErrorMessage, cn } from "@/lib/utils"
import { LoadingState } from "@/components/shared/LoadingState"
import { ErrorState } from "@/components/shared/ErrorState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import type { Category } from "@/types/service.types"

const PAGE_SIZE = 8

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Palette,
  PenTool,
  TrendingUp,
  Video,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Grid,
}

const ICON_OPTIONS: { key: string; icon: LucideIcon; bg: string; color: string }[] =
  [
    { key: "Code2", icon: Code2, bg: "bg-indigo-500/15", color: "text-indigo-400" },
    { key: "Palette", icon: Palette, bg: "bg-sky-500/15", color: "text-sky-400" },
    { key: "PenTool", icon: PenTool, bg: "bg-emerald-500/15", color: "text-emerald-400" },
    { key: "TrendingUp", icon: TrendingUp, bg: "bg-amber-500/15", color: "text-amber-400" },
    { key: "Video", icon: Video, bg: "bg-rose-500/15", color: "text-rose-400" },
    { key: "Briefcase", icon: Briefcase, bg: "bg-cyan-500/15", color: "text-cyan-400" },
    { key: "ShieldCheck", icon: ShieldCheck, bg: "bg-emerald-500/15", color: "text-emerald-400" },
    { key: "Sparkles", icon: Sparkles, bg: "bg-fuchsia-500/15", color: "text-fuchsia-400" },
    { key: "Grid", icon: Grid, bg: "bg-slate-500/15", color: "text-slate-400" },
  ]

const PIE_COLORS = [
  "var(--primary)",
  "#38bdf8",
  "#34d399",
  "#22d3ee",
  "#fbbf24",
  "#f472b6",
]

function categoryIcon(category: Category): LucideIcon {
  if (!category.icon) return Grid
  return ICON_MAP[category.icon] ?? Grid
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
}: {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string | number
  sub: string
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
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  )
}

interface CategoryFormProps {
  initial: Category | null
  onCancel: () => void
  onSuccess: () => void
}

function CategoryForm({ initial, onCancel, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [icon, setIcon] = useState(initial?.icon ?? "Code2")

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const saving = createCategory.isPending || updateCategory.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const payload = { name: name.trim(), description: description.trim() || undefined, icon }
    if (initial) {
      await updateCategory.mutateAsync({ id: initial.id, payload })
    } else {
      await createCategory.mutateAsync(payload)
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Category" : "Add New Category"}</DialogTitle>
        <DialogDescription>
          {initial
            ? "Update the details of this category."
            : "Create a new category for services on the platform."}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="category-name">Name</Label>
          <Input
            id="category-name"
            placeholder="e.g. Web Development"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category-desc">Description</Label>
          <Textarea
            id="category-desc"
            placeholder="Short description of the category"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Icon</Label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setIcon(opt.key)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                  opt.bg,
                  opt.color,
                  icon === opt.key
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:bg-muted"
                )}
                title={opt.key}
              >
                <opt.icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? <Spinner size={15} className="animate-spin" /> : null}
          {initial ? "Save Changes" : "Create Category"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function ManageCategories() {
  const { data, isLoading, isError, error, refetch } = useCategories()
  const deleteCategory = useDeleteCategory()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const categories = useMemo(() => data ?? [], [data])

  const stats = useMemo(
    () => ({
      total: categories.length,
      withServices: categories.filter((c) => (c.serviceCount ?? 0) > 0).length,
      totalServices: categories.reduce(
        (sum, c) => sum + (c.serviceCount ?? 0),
        0
      ),
      empty: categories.filter((c) => (c.serviceCount ?? 0) === 0).length,
    }),
    [categories]
  )

  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  const sortedByServices = useMemo(
    () => [...categories].sort((a, b) => (b.serviceCount ?? 0) - (a.serviceCount ?? 0)),
    [categories]
  )
  const topCategories = sortedByServices.slice(0, 5)

  const recentlyAdded = useMemo(
    () =>
      [...categories]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    [categories]
  )

  const donutData = useMemo(
    () =>
      topCategories.map((c, i) => ({
        name: c.name,
        value: c.serviceCount ?? 0,
        color: PIE_COLORS[i % PIE_COLORS.length],
      })),
    [topCategories]
  )

  const handleExport = () => {
    const rows = [
      ["Name", "Description", "Services", "Created"],
      ...filtered.map((c) => [
        c.name,
        c.description ?? "",
        String(c.serviceCount ?? 0),
        formatDate(c.createdAt),
      ]),
    ]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "categories.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteCategory.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] font-sans">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize and manage all service categories on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download size={16} />
            Export Categories
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={16} />
            Add New Category
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        {/* Left: stats + table */}
        <div>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Grid}
              iconBg="bg-violet-500/15"
              iconColor="text-violet-400"
              label="Total Categories"
              value={isLoading ? "—" : stats.total}
              sub="On the platform"
            />
            <StatCard
              icon={Briefcase}
              iconBg="bg-sky-500/15"
              iconColor="text-sky-400"
              label="Categories with Services"
              value={isLoading ? "—" : stats.withServices}
              sub="Have at least one listing"
            />
            <StatCard
              icon={Eye}
              iconBg="bg-amber-500/15"
              iconColor="text-amber-400"
              label="Total Services"
              value={isLoading ? "—" : stats.totalServices.toLocaleString()}
              sub="Across all categories"
            />
            <StatCard
              icon={FolderOpen}
              iconBg="bg-emerald-500/15"
              iconColor="text-emerald-400"
              label="Empty Categories"
              value={isLoading ? "—" : stats.empty}
              sub="No services yet"
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
                placeholder="Search categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setSearch("")
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
                <Grid className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium">No categories found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Services</th>
                    <th className="px-4 py-4 font-medium">Created</th>
                    <th className="px-4 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c) => {
                    const Icon = categoryIcon(c)
                    const hasServices = (c.serviceCount ?? 0) > 0
                    return (
                      <tr
                        key={c.id}
                        className="border-b last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                              <Icon size={18} strokeWidth={2} />
                            </div>
                            <div>
                              <div className="font-medium">{c.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {c.description || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                              hasServices
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-slate-500/15 text-slate-400"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                hasServices
                                  ? "bg-emerald-400"
                                  : "bg-slate-400"
                              )}
                            />
                            {c.serviceCount ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setEditing(c)
                                setFormOpen(true)
                              }}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-rose-400 hover:text-rose-300"
                              onClick={() => setDeleteTarget(c)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Showing {pageItems.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}{" "}
              to {(safePage - 1) * PAGE_SIZE + pageItems.length} of{" "}
              {filtered.length} categories
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={safePage === n ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon-sm"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Categories overview */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Categories Overview</h3>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            ) : donutData.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">
                No categories yet.
              </p>
            ) : (
              <>
                <div className="relative mt-2 flex justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={70}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {donutData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{stats.total}</span>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {donutData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="max-w-[140px] truncate">{d.name}</span>
                      </span>
                      <span>{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Top categories */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Top Categories</h3>
            <div className="mt-3 space-y-3">
              {sortedByServices.slice(0, 5).map((c) => {
                const Icon = categoryIcon(c)
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Icon size={14} className="text-primary" />
                      <span className="max-w-[140px] truncate">{c.name}</span>
                    </span>
                    <span>{c.serviceCount ?? 0}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recently added */}
          <div className="rounded-2xl border bg-card p-5">
            <h3 className="text-sm font-semibold">Recently Added</h3>
            <div className="mt-3 space-y-3.5">
              {recentlyAdded.map((c) => {
                const Icon = categoryIcon(c)
                return (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon size={15} strokeWidth={2} />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false)
            setEditing(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {formOpen && (
            <CategoryForm
              initial={editing}
              onCancel={() => {
                setFormOpen(false)
                setEditing(null)
              }}
              onSuccess={() => {
                setFormOpen(false)
                setEditing(null)
              }}
            />
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
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
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
