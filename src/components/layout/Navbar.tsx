import { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  ChevronRight,
  Compass,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Route,
  ShieldCheck,
  Store,
} from "lucide-react"
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
  { label: "Services", to: "/services", icon: Compass },
  { label: "Categories", to: "/#categories", icon: LayoutGrid },
  { label: "How It Works", to: "/#how-it-works", icon: Route },
  { label: "Enterprise", to: "/#governance", icon: ShieldCheck },
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
  const location = useLocation()

  const isLinkActive = (to: string) =>
    to.startsWith("/#")
      ? location.hash === to.slice(1)
      : location.pathname === to

  const overDarkHero =
    location.pathname === "/" && location.hash === "" && !scrolled

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

  const idleColor = overDarkHero
    ? "text-white/80 hover:text-white"
    : "text-on-surface-variant hover:text-on-surface"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200 motion-reduce:transition-none",
        overDarkHero
          ? "border-transparent bg-transparent"
          : "border-outline-variant/30 bg-surface-container-lowest/80 shadow-sm backdrop-blur-xl"
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
            className="hidden items-center gap-5 lg:flex xl:gap-6"
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
                        ? overDarkHero
                          ? "font-medium text-white"
                          : "font-medium text-primary"
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
                overDarkHero &&
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
                  className={cn(
                    "lg:hidden",
                    overDarkHero && "text-white/85"
                  )}
                  aria-label="Open navigation menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(21rem,88vw)] gap-0 p-0">
                <SheetHeader className="shrink-0 border-b p-4">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <Link to="/" onClick={() => setMenuOpen(false)}>
                    <Logo
                      showText={false}
                      imgClassName="h-32 w-32 object-contain"
                    />
                  </Link>
                </SheetHeader>

                <nav
                  className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-margin-mobile py-5"
                  aria-label="Mobile"
                >
                  <p className="px-2 pb-1 font-label-caps text-label-caps text-on-surface-variant/60">
                    Explore
                  </p>
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon
                    const active = isLinkActive(link.to)

                    return (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2.5 font-body-md text-body-md transition-colors",
                          FOCUS_RING,
                          active
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-outline-variant/20 bg-surface-container-low text-on-surface hover:border-primary/40 hover:bg-surface-container-high"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                            active
                              ? "bg-primary/15 text-primary"
                              : "bg-surface-container-highest text-primary group-hover:bg-primary/10"
                          )}
                        >
                          <Icon size={18} />
                        </span>
                        {link.label}
                        <ChevronRight
                          size={16}
                          className="ml-auto shrink-0 text-outline transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </Link>
                    )
                  })}

                  <div className="my-2 h-px bg-outline-variant/20" />

                  <Link
                    to="/#become-a-seller"
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 font-body-md text-body-md font-medium text-primary-foreground transition-opacity hover:opacity-90",
                      FOCUS_RING
                    )}
                  >
                    <Store size={18} />
                    Become a Seller
                  </Link>
                </nav>

                <div className="mt-auto flex shrink-0 flex-col gap-2 border-t p-4">
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
