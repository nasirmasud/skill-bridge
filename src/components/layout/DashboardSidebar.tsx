import { Link, NavLink, useNavigate } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ShoppingBag,
  ShoppingCart,
  Tags,
  User,
  Users,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"
import type { Role } from "@/types/user.types"

interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  CLIENT: [
    {
      label: "Overview",
      to: "/dashboard/client/overview",
      icon: LayoutDashboard,
    },
    { label: "My Orders", to: "/dashboard/client/orders", icon: ShoppingBag },
    { label: "Profile", to: "/dashboard/client/profile", icon: User },
  ],
  FREELANCER: [
    {
      label: "My Services",
      to: "/dashboard/freelancer/services",
      icon: Briefcase,
    },
    {
      label: "Create Service",
      to: "/dashboard/freelancer/services/new",
      icon: PlusCircle,
    },
    {
      label: "Received Orders",
      to: "/dashboard/freelancer/orders",
      icon: Inbox,
    },
  ],
  ADMIN: [
    { label: "Users", to: "/dashboard/admin/users", icon: Users },
    { label: "Categories", to: "/dashboard/admin/categories", icon: Tags },
    { label: "Orders", to: "/dashboard/admin/orders", icon: ShoppingCart },
  ],
}

interface DashboardSidebarProps {
  onNavigate?: () => void
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = user ? NAV_ITEMS[user.role] : []

  const handleLogout = () => {
    logout()
    onNavigate?.()
    navigate("/")
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex h-9 items-center"
        aria-label="Skillbridge home"
      >
        <Logo />
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <Home className="size-4" />
          Home
        </NavLink>

        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Button
        variant="ghost"
        className="justify-start text-muted-foreground hover:text-foreground"
        onClick={handleLogout}
      >
        <LogOut />
        Logout
      </Button>
    </div>
  )
}
