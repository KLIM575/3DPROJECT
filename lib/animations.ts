export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1)
  return lerp(outMin, outMax, t)
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function interpolateColorStages(
  progress: number,
  stages: readonly { primary: readonly number[]; secondary: readonly number[] }[]
): { primary: [number, number, number]; secondary: [number, number, number] } {
  const p = Math.min(progress, 0.999) * (stages.length - 1)
  const idx = Math.floor(p)
  const t = p - idx
  const a = stages[idx]
  const b = stages[Math.min(idx + 1, stages.length - 1)]
  return {
    primary: [
      a.primary[0] + (b.primary[0] - a.primary[0]) * t,
      a.primary[1] + (b.primary[1] - a.primary[1]) * t,
      a.primary[2] + (b.primary[2] - a.primary[2]) * t,
    ],
    secondary: [
      a.secondary[0] + (b.secondary[0] - a.secondary[0]) * t,
      a.secondary[1] + (b.secondary[1] - a.secondary[1]) * t,
      a.secondary[2] + (b.secondary[2] - a.secondary[2]) * t,
    ],
  }
}
