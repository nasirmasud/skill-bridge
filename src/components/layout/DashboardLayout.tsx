import { useState } from "react"
import { Menu } from "lucide-react"
import { Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DashboardSidebar } from "./DashboardSidebar"
import { Logo } from "./Logo"

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur lg:hidden">
        <Logo />
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open dashboard navigation"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <DashboardSidebar onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:block">
          <DashboardSidebar />
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
