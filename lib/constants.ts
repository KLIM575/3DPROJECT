export const COLORS = {
  background: '#030304',
  canvasClear: '#030304',
  accent: '#c8b896',
  accentSecondary: '#9aa8c4',
  accentTertiary: '#5c6470',
  white: '#f2f0ec',
  muted: '#6b6966',
  text: '#d8d6d3',
  border: 'rgba(255, 255, 255, 0.08)',
} as const

/** Scroll journey: five 0.2 bands map to particle morph segments 0→4 (six keyforms). */
export const JOURNEY_BOUNDS = [0, 0.2, 0.4, 0.6, 0.8, 1.0] as const

export const TOTAL_SCROLL_HEIGHT = '700vh'

/** Bloom tuned for anchor-only highlights: high threshold, sharp luminance knee. */
export const BLOOM_CONFIG = {
  high: { intensity: 0.95, luminanceThreshold: 0.72, luminanceSmoothing: 0.18 },
  medium: { intensity: 0.82, luminanceThreshold: 0.76, luminanceSmoothing: 0.22 },
  low: { intensity: 0, luminanceThreshold: 1.0, luminanceSmoothing: 0.3 },
} as const

export const DPR = {
  high: [1, 2] as [number, number],
  medium: [1, 1.5] as [number, number],
  low: [1, 1] as [number, number],
}

export type QualityLevel = 'high' | 'medium' | 'low'

/** Particle counts: high / medium / low — dense field like Active Theory. */
export const PARTICLE_COUNTS: Record<QualityLevel, number> = {
  high: 60000,
  medium: 30000,
  low: 15000,
}

export const SECTIONS = ['hero', 'projects', 'about', 'services', 'team', 'testimonials', 'contact'] as const
export type SectionId = (typeof SECTIONS)[number]

/** Aliased for hero / UI that reference narrative bands. */
export const NARRATIVE_PHASE_BOUNDS = JOURNEY_BOUNDS

export const NARRATIVE_PHASE_IDS = [
  'cloud',
  'forest',
  'universe',
  'galaxy',
  'vessel',
  'garden',
] as const

export type NarrativePhaseId = (typeof NARRATIVE_PHASE_IDS)[number]

export const SECTION_SCROLL_ANCHORS: Record<SectionId, number> = {
  hero: JOURNEY_BOUNDS[0],
  projects: 0.22,
  about: 0.38,
  services: 0.58,
  team: 0.68,
  testimonials: 0.76,
  contact: 0.94,
}

/** RGB 0–1 pairs for vertex color mix along morph. */
export const COLOR_STAGES = [
  { primary: [0.12, 0.72, 0.38], secondary: [0.04, 0.28, 0.14] },
  { primary: [0.18, 0.52, 0.28], secondary: [0.35, 0.28, 0.12] },
  { primary: [0.22, 0.35, 0.85], secondary: [0.65, 0.15, 0.42] },
  { primary: [0.45, 0.2, 0.75], secondary: [0.12, 0.55, 0.88] },
  { primary: [0.75, 0.82, 0.88], secondary: [0.15, 0.42, 0.48] },
  { primary: [0.14, 0.68, 0.36], secondary: [0.05, 0.32, 0.18] },
] as const

const MORPH_SEGMENTS = 5

/** Camera keyframes: wide → forest passage → cosmic → galaxy → vessel → garden return. */
export const CAMERA_WAYPOINTS = [
  { pos: [0, 3.2, 22.5] as const, lookAt: [0, 0.4, 0] as const },
  { pos: [12.5, 2.0, 9.5] as const, lookAt: [1.5, 0.6, -5] as const },
  { pos: [-4.5, 1.0, 30] as const, lookAt: [0, 0, 0] as const },
  { pos: [0, 16, 5.5] as const, lookAt: [0, 0, 0] as const },
  { pos: [0, 0.35, 5.8] as const, lookAt: [0, 0, 0] as const },
  { pos: [0, 2.6, 15.5] as const, lookAt: [0, 0.25, 0] as const },
] as const

export const MORPH_SEGMENT_COUNT = MORPH_SEGMENTS
