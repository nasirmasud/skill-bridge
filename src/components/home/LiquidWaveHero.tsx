import { useEffect, useRef } from "react"
import * as THREE from "three"

const DEFAULT_COLORS = [
  "#8B5CF6",
  "#6366F1",
  "#EC4899",
  "#06B6D4",
  "#F59E0B",
  "#10B981",
  "#F97316",
  "#3B82F6",
  "#A855F7",
  "#14B8A6",
]

interface LiquidWaveHeroProps {
  colors?: string[]
  backgroundColor?: string
  speed?: number
  intensity?: number
  rippleStrength?: number
  className?: string
}

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform vec3 uColor5;
  uniform vec3 uColor6;
  uniform vec3 uColor7;
  uniform vec3 uColor8;
  uniform vec3 uColor9;
  uniform vec3 uColor10;
  uniform vec3 uBgColor;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform float uRippleStrength;
  uniform vec2 uMouse;
  uniform float uMouseVelocity;
  uniform float uAspect;
  varying vec2 vUv;

  vec2 aspectSpread(vec2 center) {
    return vec2(center.x * uAspect, center.y);
  }

  vec4 blobField(vec2 point, float t) {
    vec2 c1 = aspectSpread(vec2(sin(t * 0.42) * 0.42, cos(t * 0.53) * 0.38));
    vec2 c2 = aspectSpread(vec2(cos(t * 0.61) * 0.46, sin(t * 0.47) * 0.44));
    vec2 c3 = aspectSpread(vec2(sin(t * 0.35) * 0.40, cos(t * 0.58) * 0.40));
    vec2 c4 = aspectSpread(vec2(cos(t * 0.50) * 0.44, sin(t * 0.39) * 0.42));
    vec2 c5 = aspectSpread(vec2(sin(t * 0.46 + 0.8) * 0.43, cos(t * 0.38 + 1.4) * 0.42));
    vec2 c6 = aspectSpread(vec2(cos(t * 0.33 + 2.1) * 0.45, sin(t * 0.56 + 0.4) * 0.39));
    vec2 c7 = aspectSpread(vec2(sin(t * 0.58 + 1.7) * 0.39, cos(t * 0.31 + 2.5) * 0.44));
    vec2 c8 = aspectSpread(vec2(cos(t * 0.27 + 0.9) * 0.48, sin(t * 0.52 + 1.8) * 0.37));
    vec2 c9 = aspectSpread(vec2(sin(t * 0.24 + 2.8) * 0.41, cos(t * 0.45 + 0.2) * 0.43));
    vec2 c10 = aspectSpread(vec2(cos(t * 0.37 + 1.1) * 0.46, sin(t * 0.29 + 2.2) * 0.41));

    float radius = mix(0.17, 0.25, clamp(uAspect * 0.55, 0.0, 1.0));
    float d1 = 1.0 - smoothstep(0.0, radius, length(point - c1));
    float d2 = 1.0 - smoothstep(0.0, radius, length(point - c2));
    float d3 = 1.0 - smoothstep(0.0, radius, length(point - c3));
    float d4 = 1.0 - smoothstep(0.0, radius, length(point - c4));
    float d5 = 1.0 - smoothstep(0.0, radius, length(point - c5));
    float d6 = 1.0 - smoothstep(0.0, radius, length(point - c6));
    float d7 = 1.0 - smoothstep(0.0, radius, length(point - c7));
    float d8 = 1.0 - smoothstep(0.0, radius, length(point - c8));
    float d9 = 1.0 - smoothstep(0.0, radius, length(point - c9));
    float d10 = 1.0 - smoothstep(0.0, radius, length(point - c10));

    float w1 = d1 * (0.72 + 0.28 * sin(t));
    float w2 = d2 * (0.70 + 0.30 * cos(t * 1.2));
    float w3 = d3 * (0.74 + 0.26 * sin(t * 0.8));
    float w4 = d4 * (0.68 + 0.32 * cos(t * 1.1));
    float w5 = d5 * (0.71 + 0.29 * sin(t * 0.9));
    float w6 = d6 * (0.69 + 0.31 * cos(t * 1.3));
    float w7 = d7 * (0.73 + 0.27 * sin(t * 1.4));
    float w8 = d8 * (0.67 + 0.33 * cos(t * 0.7));
    float w9 = d9 * (0.70 + 0.30 * sin(t * 1.6));
    float w10 = d10 * (0.72 + 0.28 * cos(t * 0.95));
    float total = w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8 + w9 + w10;

    vec3 color = uColor1 * w1
      + uColor2 * w2
      + uColor3 * w3
      + uColor4 * w4
      + uColor5 * w5
      + uColor6 * w6
      + uColor7 * w7
      + uColor8 * w8
      + uColor9 * w9
      + uColor10 * w10;
    float strength = 1.0 - exp(-total * 1.6);
    return vec4(color / max(total, 0.0001), strength);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouseDelta = uv - uMouse;
    vec2 aspectDelta = vec2(mouseDelta.x * uAspect, mouseDelta.y);
    float mouseDistanceSquared = dot(aspectDelta, aspectDelta);
    float distToMouse = sqrt(mouseDistanceSquared);
    float influence = uMouseVelocity * (1.0 - smoothstep(0.0, 0.5, distToMouse));
    vec2 direction = mouseDistanceSquared > 0.0001 ? normalize(aspectDelta) : vec2(0.0);
    direction.x /= uAspect;

    uv += direction * influence * 0.10 * uRippleStrength;

    float ripple = sin(distToMouse * 18.0 - uTime * 3.5) * influence * 0.015 * uRippleStrength;
    uv += direction * ripple;

    float t = uTime * uSpeed;
    vec2 fieldPoint = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    vec4 blob = blobField(fieldPoint, t);
    vec3 color = mix(uBgColor, clamp(blob.rgb * uIntensity, 0.0, 1.0), blob.a);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`

function hexToVector(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16)

  return new THREE.Vector3(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  )
}

export default function LiquidWaveHero({
  colors = DEFAULT_COLORS,
  backgroundColor = "#0a0a1e",
  speed = 1.2,
  intensity = 1.15,
  rippleStrength = 1,
  className = "",
}: LiquidWaveHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const eventTarget = container?.parentElement
    if (!container || !eventTarget) return

    let width = Math.max(container.clientWidth, 1)
    let height = Math.max(container.clientHeight, 1)
    const palette = colors.length > 0 ? colors : DEFAULT_COLORS
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      })
    } catch {
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height, false)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.inset = "0"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    renderer.domElement.style.pointerEvents = "none"
    renderer.domElement.setAttribute("aria-hidden", "true")
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const uniforms = {
      uTime: { value: 0 },
      uColor1: { value: hexToVector(palette[0]) },
      uColor2: { value: hexToVector(palette[1] ?? palette[0]) },
      uColor3: { value: hexToVector(palette[2] ?? palette[0]) },
      uColor4: { value: hexToVector(palette[3] ?? palette[0]) },
      uColor5: { value: hexToVector(palette[4] ?? palette[0]) },
      uColor6: { value: hexToVector(palette[5] ?? palette[0]) },
      uColor7: { value: hexToVector(palette[6] ?? palette[0]) },
      uColor8: { value: hexToVector(palette[7] ?? palette[0]) },
      uColor9: { value: hexToVector(palette[8] ?? palette[0]) },
      uColor10: { value: hexToVector(palette[9] ?? palette[0]) },
      uBgColor: { value: hexToVector(backgroundColor) },
      uSpeed: { value: speed },
      uIntensity: { value: intensity },
      uRippleStrength: { value: rippleStrength },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: 0 },
      uAspect: { value: width / height },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const rawMouse = new THREE.Vector2(0.5, 0.5)
    const smoothMouse = new THREE.Vector2(0.5, 0.5)
    let mouseVelocity = 0
    let hasMoved = false

    const updateMouse = () => {
      const deltaX = rawMouse.x - smoothMouse.x
      const deltaY = rawMouse.y - smoothMouse.y
      smoothMouse.x += deltaX * 0.08
      smoothMouse.y += deltaY * 0.08

      const movement = Math.hypot(deltaX, deltaY)
      mouseVelocity += (Math.min(movement * 6, 1) - mouseVelocity) * 0.15
      if (!hasMoved) mouseVelocity *= 0.96
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      rawMouse.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      )
      hasMoved = true
    }

    const handlePointerLeave = () => {
      hasMoved = false
    }

    eventTarget.addEventListener("pointermove", handlePointerMove)
    eventTarget.addEventListener("pointerleave", handlePointerLeave)

    const handleResize = () => {
      width = Math.max(container.clientWidth, 1)
      height = Math.max(container.clientHeight, 1)
      renderer.setSize(width, height, false)
      uniforms.uAspect.value = width / height
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const clock = new THREE.Clock()
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    let rafId: number | null = null

    const renderFrame = () => {
      renderer.render(scene, camera)
    }

    const animate = () => {
      uniforms.uTime.value += clock.getDelta()
      updateMouse()
      uniforms.uMouse.value.copy(smoothMouse)
      uniforms.uMouseVelocity.value = mouseVelocity
      renderFrame()
      rafId = requestAnimationFrame(animate)
    }

    if (prefersReducedMotion) {
      uniforms.uTime.value = 2.4
      renderFrame()
    } else {
      animate()
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      eventTarget.removeEventListener("pointermove", handlePointerMove)
      eventTarget.removeEventListener("pointerleave", handlePointerLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [backgroundColor, colors, intensity, rippleStrength, speed])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  )
}
