import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu } from "lucide-react"
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
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Categories", to: "/#categories" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Become a Seller", to: "/#become-a-seller" },
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
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur transition-colors duration-200",
        "border-black/5 bg-white/80 dark:border-white/5 dark:bg-[#07070c]/80",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Skillbridge home">
                  <Logo showText={false} imgClassName="h-36 w-36" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) =>
            link.to.startsWith("/#") ? (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
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
                    "text-sm transition-colors",
                    isActive
                      ? "font-semibold text-black dark:text-white"
                      : "font-medium text-black/60 hover:text-black dark:text-white/70 dark:hover:text-white"
                  )
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-5">
          <ThemeToggle />

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
                  className="hidden text-sm font-medium text-black/80 transition-colors hover:text-black sm:inline dark:text-white/85 dark:hover:text-white"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="rounded-lg border-0 bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-5 text-white shadow-none transition-opacity hover:opacity-90"
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
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="border-b">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <Link to="/" onClick={() => setMenuOpen(false)}>
          <Logo showText={false} imgClassName="h-36 w-36" />
                </Link>
              </SheetHeader>

              <nav
                className="flex flex-col gap-1 px-4"
                aria-label="Mobile"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
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
