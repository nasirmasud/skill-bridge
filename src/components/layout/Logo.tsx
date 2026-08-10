import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center shrink-0", className)}>
      <span className="text-xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Skill
        </span>
        <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          Bridge
        </span>
      </span>
    </span>
  )
}
