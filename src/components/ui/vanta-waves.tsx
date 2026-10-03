import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import type { VantaEffect, VantaWavesOptions } from "@/types/vanta"

export interface VantaWavesProps extends Omit<VantaWavesOptions, "el"> {
  className?: string
  fallbackColor?: string
}

const DEFAULT_FALLBACK_BG = "#031b2e"

function VantaWaves({ className, fallbackColor = DEFAULT_FALLBACK_BG, ...options }: VantaWavesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const key = JSON.stringify(options)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !window.VANTA?.WAVES) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const resolved = JSON.parse(key) as Omit<VantaWavesOptions, "el">

    let effect: VantaEffect
    try {
      effect = window.VANTA.WAVES({ ...resolved, el: container })
    } catch (error) {
      console.warn("[VantaWaves] init failed:", error)
      return
    }

    return () => {
      try {
        effect.destroy()
      } catch (error) {
        console.warn("[VantaWaves] destroy failed:", error)
      }
    }
  }, [key])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ background: fallbackColor }}
      className={cn("absolute inset-0 overflow-hidden", className)}
    />
  )
}

export { VantaWaves }