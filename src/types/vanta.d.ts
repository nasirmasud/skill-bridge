export interface VantaWavesOptions {
  el: HTMLElement | string
  color?: number
  shininess?: number
  waveHeight?: number
  waveSpeed?: number
  zoom?: number
  mouseControls?: boolean
  touchControls?: boolean
  gyroControls?: boolean
  minHeight?: number
  minWidth?: number
  scale?: number
  scaleMobile?: number
  speed?: number
  backgroundColor?: number
  backgroundAlpha?: number
  mouseEase?: boolean
  forceAnimate?: boolean
  THREE?: unknown
}

export interface VantaEffect {
  destroy: () => void
  setOptions: (options: Partial<VantaWavesOptions>) => void
  restart: () => void
}

export interface VantaNamespace {
  WAVES: (options: VantaWavesOptions) => VantaEffect
}

declare global {
  interface Window {
    VANTA?: VantaNamespace
    THREE?: unknown
  }
}