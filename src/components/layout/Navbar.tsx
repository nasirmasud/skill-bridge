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
  { label: "Services", to: "/services" },
  { label: "Categories", to: "/#categories" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Enterprise", to: "/#governance" },
]

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"

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
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 8)
    }

    const handleScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/")
  }

  const idleColor = scrolled
    ? "text-on-surface-variant hover:text-on-surface"
    : "text-white/80 hover:text-white"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200 motion-reduce:transition-none",
        scrolled
          ? "border-outline-variant/30 bg-surface-container-lowest/80 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] px-margin-mobile lg:px-margin-desktop">
        <div className="flex h-16 items-center justify-between gap-3 lg:gap-4">
          <Link
            to="/"
            aria-label="Skillbridge home"
            className={cn("shrink-0 rounded-sm", FOCUS_RING)}
          >
            <Logo showText={false} imgClassName="h-32 w-32 object-contain" />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) =>
              link.to.startsWith("/#") ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    "rounded-sm font-body-sm text-body-sm leading-none whitespace-nowrap transition-colors",
                    idleColor,
                    FOCUS_RING
                  )}
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
                      "rounded-sm font-body-sm text-body-sm leading-none whitespace-nowrap transition-colors",
                      isActive
                        ? scrolled
                          ? "font-medium text-primary"
                          : "font-medium text-white"
                        : idleColor,
                      FOCUS_RING
                    )
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <Link
              to="/#become-a-seller"
              className={cn(
                "hidden px-2 py-1.5 font-body-sm text-body-sm leading-none whitespace-nowrap transition-colors sm:inline-flex",
                idleColor,
                FOCUS_RING
              )}
            >
              Become a Seller
            </Link>

            <span
              className={cn(
                "flex",
                !scrolled &&
                  "[&_button]:text-white/85 [&_button:hover]:bg-white/10"
              )}
            >
              <ThemeToggle />
            </span>

            {isLoading ? (
              <span
                aria-hidden="true"
                className="h-9 w-24 shrink-0 rounded-lg bg-current/10"
              />
            ) : isAuthenticated && user ? (
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
                    <span className="hidden max-w-28 truncate lg:block">
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
                  className={cn(
                    "hidden px-2 py-1.5 font-body-sm text-body-sm leading-none whitespace-nowrap transition-colors sm:inline",
                    idleColor,
                    FOCUS_RING
                  )}
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
            )}

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("lg:hidden", !scrolled && "text-white/85")}
                  aria-label="Open navigation menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="border-b">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    <Logo
                      showText={false}
                      imgClassName="h-32 w-32 object-contain"
                    />
                  </Link>
                </SheetHeader>

                <nav
                  className="flex flex-col gap-4 px-margin-mobile pt-4"
                  aria-label="Mobile"
                >
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
      </div>
    </header>
  )
}
