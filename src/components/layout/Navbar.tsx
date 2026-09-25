import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Bell, LayoutDashboard, LogOut, Menu, Search } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "./Logo"
import { ThemeToggle } from "./ThemeToggle"

const NAV_LINKS = [
  { label: "Explore Services", to: "/services" },
  { label: "Browse Categories", to: "/#categories" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Enterprise", to: "/#governance" },
  { label: "Verified Talents", to: "/#verified-talents" },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-outline-variant/30 backdrop-blur-xl",
        "bg-surface-container-lowest/80"
      )}
    >
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 2xl:px-12">
        <Link to="/" aria-label="Skillbridge home">
          <Logo showText={false} imgClassName="h-32 w-32 object-contain" />
        </Link>

        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6" aria-label="Main">
          {NAV_LINKS.map((link) =>
            link.to.startsWith("/#") ? (
              <Link
                key={link.label}
                to={link.to}
                className="font-body-md text-body-md leading-none whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(
                    "font-body-md text-body-md leading-none whitespace-nowrap transition-colors",
                    isActive
                      ? "font-medium text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  )
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <Link
            to="/services"
            className="hidden items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-1.5 leading-none whitespace-nowrap transition-colors focus-within:border-primary md:flex"
          >
            <Search size={16} className="text-outline" />
            <span className="font-body-sm text-body-sm text-outline">
              Search services or skills...
            </span>
            <span className="rounded border border-outline-variant/30 bg-surface-container-high px-1.5 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
              ⌘K
            </span>
          </Link>

          <Link
            to="/#become-a-seller"
            className="hidden px-2 py-1.5 font-body-sm text-body-sm leading-none whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface sm:inline-flex"
          >
            Become a Seller
          </Link>

          <ThemeToggle />

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-tertiary" />
          </button>

          {!isLoading &&
            (isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 px-2"
                    aria-label="Account menu"
                  >
                    <Avatar className="size-7">
                      {user.profileImg && (
                        <AvatarImage src={user.profileImg} alt={user.name} />
                      )}
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate sm:block">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate(getDashboardPath(user.role))}
                    >
                      <LayoutDashboard />
                      Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden px-2 py-1.5 font-body-sm text-body-sm leading-none whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface sm:inline"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="rounded-lg border-0 bg-primary px-5 text-primary-foreground shadow-none transition-opacity hover:opacity-90"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            ))}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                aria-label="Open navigation menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="border-b">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  <Logo showText={false} imgClassName="h-32 w-32 object-contain" />
                </Link>
              </SheetHeader>

              <nav className="flex flex-col gap-4 px-4 pt-4" aria-label="Mobile">
                <Link
                  to="/services"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2 font-body-sm text-body-sm leading-none whitespace-nowrap text-on-surface-variant"
                >
                  <Search size={16} className="text-outline" />
                  Search services or skills...
                  <span className="ml-auto rounded border border-outline-variant/30 bg-surface-container-high px-1.5 py-0.5 font-label-caps text-label-caps text-on-surface-variant">
                    ⌘K
                  </span>
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2 py-1.5 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/#become-a-seller"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-1.5 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                >
                  Become a Seller
                </Link>
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {isAuthenticated && user ? (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      onClick={() => setMenuOpen(false)}
                    >
                      <Link to={getDashboardPath(user.role)}>Dashboard</Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>
                      <LogOut />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      onClick={() => setMenuOpen(false)}
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}