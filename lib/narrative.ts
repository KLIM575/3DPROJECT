import { smoothstep } from '@/lib/animations'
import { NARRATIVE_PHASE_BOUNDS, PARTICLE_KEY_COUNT } from '@/lib/constants'

const B = NARRATIVE_PHASE_BOUNDS
const MORPH_SEGMENTS = PARTICLE_KEY_COUNT - 1

/**
 * Maps raw page scroll (0–1) to particle/core morph progress (0–1) so each narrative phase
 * spans one of the 7 interpolation segments between 8 particle keys.
 * At phase boundary B[i] (i = 0..7), value is i/7; last phase [B[7], 1] holds at full morph.
 */
export function narrativeMorphProgress(scrollProgress: number): number {
  const p = Math.min(Math.max(scrollProgress, 0), 1)
  for (let i = 0; i < MORPH_SEGMENTS; i++) {
    const a = B[i]
    const b = B[i + 1]
    if (p >= a && p < b) {
      const t = (p - a) / (b - a)
      return Math.min((i + t) / MORPH_SEGMENTS, 0.999999)
    }
  }
  if (p >= B[MORPH_SEGMENTS]) return 0.999999
  return 0
}

/** Same timeline as morph: 8 camera waypoints align with phase starts B[0]..B[7]. */
export function narrativeCameraParam(scrollProgress: number): number {
  const p = Math.min(Math.max(scrollProgress, 0), 1)
  for (let i = 0; i < MORPH_SEGMENTS; i++) {
    const a = B[i]
    const b = B[i + 1]
    if (p >= a && p < b) {
      const t = (p - a) / (b - a)
      return (i + t) / MORPH_SEGMENTS
    }
  }
  return p >= B[MORPH_SEGMENTS] ? 1 : 0
}

/** Segment index 0..(PARTICLE_KEY_COUNT-2), local t 0..1 with smoothstep */
export function getParticleMorphSegment(progress: number): { segment: number; t: number } {
  const p = Math.min(Math.max(narrativeMorphProgress(progress), 0), 0.999999)
  const maxSeg = PARTICLE_KEY_COUNT - 1
  const x = p * maxSeg
  const segment = Math.floor(x)
  let t = x - segment
  t = t * t * (3 - 2 * t)
  return { segment: Math.min(segment, maxSeg - 1), t }
}

/** Which narrative phase (0..bounds.length-2) we're in, for props visibility */
export function getNarrativePhaseIndex(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1)
  const last = NARRATIVE_PHASE_BOUNDS.length - 2
  for (let i = 0; i <= last; i++) {
    if (p >= NARRATIVE_PHASE_BOUNDS[i] && (i === last || p < NARRATIVE_PHASE_BOUNDS[i + 1])) return i
  }
  return last
}

/** Local progress within current narrative phase */
export function getNarrativePhaseLocalT(progress: number): number {
  const idx = getNarrativePhaseIndex(progress)
  const a = NARRATIVE_PHASE_BOUNDS[idx]
  const b = NARRATIVE_PHASE_BOUNDS[idx + 1]
  if (b <= a) return 0
  return smoothstep(a, b, progress)
}

/** 0–1 strength for vessel confinement / escape pulse (peaks mid-vessel phase) */
export function getVesselEffectStrength(progress: number): number {
  const a = NARRATIVE_PHASE_BOUNDS[5]
  const b = NARRATIVE_PHASE_BOUNDS[6]
  if (progress < a || progress > b) return 0
  const t = (progress - a) / (b - a)
  return Math.sin(t * Math.PI)
}

/** 0–1: particle core glow / white-emerald read (Active Theory vessel shot) */
export function getVesselEmeraldHighlight(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1)
  const enter = NARRATIVE_PHASE_BOUNDS[5] - 0.04
  const core = NARRATIVE_PHASE_BOUNDS[5]
  const exit = NARRATIVE_PHASE_BOUNDS[6]
  const end = NARRATIVE_PHASE_BOUNDS[7]
  if (p < enter) return 0
  if (p < core) return smoothstep(enter, core, p)
  if (p <= exit) return 1
  return Math.max(0, 1 - smoothstep(exit, end, p))
}
