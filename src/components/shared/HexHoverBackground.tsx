import { useEffect, useRef } from "react"

const OFFSCREEN = "-999px"

export function HexHoverBackground() {
  const layerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduced.matches) {
      layer.style.setProperty("--x", "50%")
      layer.style.setProperty("--y", "50%")
      return
    }

    let frame = 0
    let pending: { x: number; y: number } | null = null

    const apply = () => {
      frame = 0
      if (!pending) return
      layer.style.setProperty("--x", `${pending.x}px`)
      layer.style.setProperty("--y", `${pending.y}px`)
      pending = null
    }

    const onMove = (event: PointerEvent) => {
      // Page coords, not viewport coords: the layer scrolls with the content,
      // so the spotlight must stay anchored to the same point in the document.
      pending = { x: event.clientX, y: event.clientY + window.scrollY }
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onLeave = () => {
      layer.style.setProperty("--x", OFFSCREEN)
      layer.style.setProperty("--y", OFFSCREEN)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("blur", onLeave)
    document.addEventListener("mouseleave", onLeave)
    onLeave()

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("blur", onLeave)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <div ref={layerRef} aria-hidden="true" className="hex-hover-bg">
      <div className="hex-hover-grid" />
      <div
        className="hex-hover-glow"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle var(--hex-spotlight) at var(--x, -999px) var(--y, -999px), #000 0%, transparent 100%)",
          maskImage:
            "radial-gradient(circle var(--hex-spotlight) at var(--x, -999px) var(--y, -999px), #000 0%, transparent 100%)",
        }}
      />
    </div>
  )
}