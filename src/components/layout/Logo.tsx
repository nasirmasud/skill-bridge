import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Zap className="size-4" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Skillbridge
      </span>
    </span>
  )
}
