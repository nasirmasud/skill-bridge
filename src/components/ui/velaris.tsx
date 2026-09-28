import { useEffect, useMemo, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const vertexShaderGLSL = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShaderGLSL = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv - 0.5;
  p.x *= ratio;

  float t = u_time * 0.35;

  float n1 = snoise(p * 1.05 + vec2(t * 0.35, -t * 0.5));
  float n2 = snoise(p * 1.4 + vec2(-t * 0.28, t * 0.42) + n1 * 0.35);
  float n3 = snoise(p * 2.3 + vec2(t * 0.22, -t * 0.38) + n2 * 0.28);

  vec3 col = u_bg;

  float dist = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, dist);

  col = mix(col, u_colors[0], smoothstep(-0.15, 0.28, n1) * 0.9);
  col = mix(col, u_colors[1], smoothstep(-0.05, 0.35, n2) * 0.75);
  col = mix(col, u_colors[2], smoothstep(-0.22, 0.24, n3) * 0.65);
  col = mix(col, u_colors[3], smoothstep(0.02, 0.42, n1 * n2) * 0.55);

  float glow = smoothstep(0.8, 0.0, dist) * 0.16;
  col += u_colors[1] * glow;

  col = mix(col * 0.2, col, vignette);

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.1;

  gl_FragColor = vec4(col, 1.0);
}
`

const PALETTE_SIZE = 4
const MAX_DPR = 1.5

const DEFAULT_COLORS = ["#86efac", "#4ade80", "#059669", "#000000"]

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.trim().replace(/^#/, "")
  const full = raw.length === 3 ? [...raw].map((c) => c + c).join("") : raw
  const safe = /^[0-9a-f]{6}$/i.test(full) ? full : "000000"
  return [
    parseInt(safe.slice(0, 2), 16) / 255,
    parseInt(safe.slice(2, 4), 16) / 255,
    parseInt(safe.slice(4, 6), 16) / 255,
  ]
}

function toPalette(colors: string[]): Float32Array {
  const flat = new Float32Array(PALETTE_SIZE * 3)
  const last = colors[colors.length - 1] ?? "#000000"
  for (let i = 0; i < PALETTE_SIZE; i++) {
    const [r, g, b] = hexToRgb(colors[i] ?? last)
    flat[i * 3] = r
    flat[i * 3 + 1] = g
    flat[i * 3 + 2] = b
  }
  return flat
}

export interface VelarisProps {
  bg?: string
  colors?: string[]
  speed?: number
  grain?: number
  height?: string
  className?: string
  children?: ReactNode
}

function Velaris({
  bg = "#000000",
  colors = DEFAULT_COLORS,
  speed = 2.0,
  grain = 0.3,
  height = "100vh",
  className,
  children,
}: VelarisProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const paletteKey = colors.join(",")
  const palette = useMemo(() => toPalette(paletteKey.split(",")), [paletteKey])
  const bgRgb = useMemo(() => hexToRgb(bg), [bg])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("[Velaris] shader compile failed:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vert = compile(gl.VERTEX_SHADER, vertexShaderGLSL)
    const frag = compile(gl.FRAGMENT_SHADER, fragmentShaderGLSL)
    if (!vert || !frag) return

    const program = gl.createProgram()
    if (!program) {
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      return
    }

    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.deleteShader(vert)
    gl.deleteShader(frag)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[Velaris] program link failed:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const pos = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const locs = {
      res: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      grain: gl.getUniformLocation(program, "u_grain"),
      colors: gl.getUniformLocation(program, "u_colors"),
      bg: gl.getUniformLocation(program, "u_bg"),
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const w = Math.max(1, Math.round(container.clientWidth * dpr))
      const h = Math.max(1, Math.round(container.clientHeight * dpr))
      if (canvas.width === w && canvas.height === h) return
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let raf = 0
    const draw = (t: number) => {
      resize()
      gl.uniform2f(locs.res, canvas.width, canvas.height)
      gl.uniform1f(locs.time, t * 0.001 * speed)
      gl.uniform1f(locs.grain, grain)
      gl.uniform3f(locs.bg, bgRgb[0], bgRgb[1], bgRgb[2])
      gl.uniform3fv(locs.colors, palette)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduced.matches) {
      draw(0)
    } else {
      const render = (t: number) => {
        draw(t)
        raf = requestAnimationFrame(render)
      }
      raf = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [bgRgb, palette, speed, grain])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={cn("relative w-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  )
}

export { Velaris }
