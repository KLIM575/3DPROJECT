import { smoothstep } from '@/lib/animations'
import { MORPH_SEGMENT_COUNT } from '@/lib/constants'

const SEGMENTS = MORPH_SEGMENT_COUNT

/** 0–1 scroll, eased slightly for cinematic camera. */
export function narrativeCameraParam(scrollProgress: number): number {
  const p = Math.min(Math.max(scrollProgress, 0), 1)
  return smoothstep(0, 1, p)
}

/** Drive particle morph: 0–1 across five blends between six keyforms. */
export function narrativeMorphProgress(scrollProgress: number): number {
  return Math.min(Math.max(scrollProgress, 0), 1)
}

/** Segment index 0..SEGMENTS-1 (five segments along scroll). */
export function getNarrativePhaseIndex(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1)
  return Math.min(SEGMENTS - 1, Math.floor(p * SEGMENTS + 1e-5))
}

/** Local 0–1 within current morph segment. */
export function getNarrativePhaseLocalT(progress: number): number {
  const idx = getNarrativePhaseIndex(progress)
  const a = idx / SEGMENTS
  const b = (idx + 1) / SEGMENTS
  if (b <= a) return 0
  return smoothstep(a, b, progress)
}

/** Chaos offset inside glass vessel — strongest mid–late vessel band. */
export function getVesselEffectStrength(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1)
  const enter = smoothstep(0.76, 0.84, p)
  const exit = 1 - smoothstep(0.9, 0.995, p)
  return enter * exit
}

/** Extra emissive punch on metal / glass beat. */
export function getVesselEmeraldHighlight(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1)
  return smoothstep(0.8, 0.88, p) * (1 - smoothstep(0.94, 1, p))
}

/** Legacy helper — maps 0–1 for color staging (uses same bounds as morph). */
export function narrativeProgress(scrollProgress: number): number {
  return narrativeMorphProgress(scrollProgress)
}
