import { useEffect, useRef } from "react"

interface LiquidWaveHeroProps {
  waveColors?: string[]
  baseColor?: string
  blurAmount?: number
  className?: string
}

export default function LiquidWaveHero({
  waveColors = [
    "rgba(7,211,251,0.4)",
    "rgba(83,34,169,0.4)",
    "rgba(7,211,251,0.55)",
    "rgba(83,34,169,0.55)",
    "rgba(45,130,220,0.35)",
  ],
  baseColor = "#031b2e",
  blurAmount = 14,
  className = "",
}: LiquidWaveHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ px: -1000, py: -1000, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const parent = canvas.parentElement
    if (!ctx || !parent) return
    let width: number
    let height: number
    let dpr: number

    const CELL = 10
    let cols: number
    let rows: number
    let current: Float32Array
    let previous: Float32Array
    let next: Float32Array

    const setupGrid = () => {
      cols = Math.max(20, Math.floor(width / CELL))
      rows = Math.max(20, Math.floor(height / CELL))
      current = new Float32Array(cols * rows)
      previous = new Float32Array(cols * rows)
      next = new Float32Array(cols * rows)
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent.clientWidth
      height = parent.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      setupGrid()
    }
    resize()
    window.addEventListener("resize", resize)

    const rippleCanvas = document.createElement("canvas")
    const rippleCtx = rippleCanvas.getContext("2d")
    if (!rippleCtx) return

    const disturb = (x: number, y: number, strength: number) => {
      const gx = Math.floor((x / width) * cols)
      const gy = Math.floor((y / height) * rows)
      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const cx = gx + ox
          const cy = gy + oy
          if (cx > 0 && cx < cols - 1 && cy > 0 && cy < rows - 1) {
            current[cy * cols + cx] += strength
          }
        }
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const m = mouseRef.current
      const dist = Math.hypot(x - m.px, y - m.py)
      if (m.active) {
        const strength = Math.min(dist * 0.7, 16)
        if (strength > 0.3) disturb(x, y, strength)
      }
      m.px = x
      m.py = y
      m.active = true
    }
    const handlePointerLeave = () => {
      mouseRef.current.active = false
    }

    parent.addEventListener("pointermove", handlePointerMove)
    parent.addEventListener("pointerleave", handlePointerLeave)

    let t = 0
    const damping = 0.985

    const stepSimulation = () => {
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x
          next[i] =
            ((current[i - 1] +
              current[i + 1] +
              current[i - cols] +
              current[i + cols]) /
              2 -
              previous[i]) *
            damping
        }
      }
      const tmp = previous
      previous = current
      current = next
      next = tmp
    }

    const drawWaveBackground = () => {
      ctx.fillStyle = baseColor
      ctx.fillRect(0, 0, width, height)

      waveColors.forEach((color, idx) => {
        const speed = 22 + idx * 12
        const amplitude = 14 + idx * 8
        const wavelength = 220 - idx * 30
        const yOffset = ((t * speed) % (height + 160)) - 80

        ctx.beginPath()
        ctx.moveTo(0, 0)
        for (let x = 0; x <= width; x += 12) {
          const y =
            yOffset +
            Math.sin(x / wavelength + t * 1.3 + idx) * amplitude +
            idx * 45
          ctx.lineTo(x, y)
        }
        ctx.lineTo(width, 0)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      })
    }

    const drawRippleOverlay = () => {
      rippleCanvas.width = cols
      rippleCanvas.height = rows
      const imgData = rippleCtx.createImageData(cols, rows)
      const data = imgData.data

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const left = x > 0 ? current[i - 1] : current[i]
          const right = x < cols - 1 ? current[i + 1] : current[i]
          const up = y > 0 ? current[i - cols] : current[i]
          const down = y < rows - 1 ? current[i + cols] : current[i]

          const dx = (right - left) * 0.5
          const dy = (down - up) * 0.5
          const light = 128 + dx * 14 - dy * 14

          const p = i * 4
          const v = Math.max(0, Math.min(255, light))
          data[p] = v
          data[p + 1] = v
          data[p + 2] = 255
          data[p + 3] = Math.min(255, Math.abs(dx + dy) * 45)
        }
      }
      rippleCtx.putImageData(imgData, 0, 0)

      ctx.save()
      ctx.globalCompositeOperation = "overlay"
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(rippleCanvas, 0, 0, cols, rows, 0, 0, width, height)
      ctx.restore()
    }

    const animate = () => {
      t += 0.016
      stepSimulation()
      drawWaveBackground()
      drawRippleOverlay()
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      parent.removeEventListener("pointermove", handlePointerMove)
      parent.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [waveColors, baseColor])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        filter: `blur(${blurAmount}px)`,
        transform: "scale(1.08)",
        transformOrigin: "center",
      }}
    />
  )
}