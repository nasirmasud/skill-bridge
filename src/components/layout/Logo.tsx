import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  textClassName?: string
  imgClassName?: string
  showText?: boolean
}

export function Logo({
  className,
  textClassName,
  imgClassName,
  showText = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 shrink-0", className)}>
      <img
        src="/favicon.ico"
        alt={showText ? "" : "SkillBridge"}
        className={cn("h-10 w-10 object-contain", imgClassName)}
      />
      {showText && (
        <span className={cn("text-xl font-bold tracking-tight", textClassName)}>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Skill
          </span>
          <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
            Bridge
          </span>
        </span>
      )}
    </span>
  )
}
