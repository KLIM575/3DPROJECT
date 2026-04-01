export const COLORS = {
  background: '#0c0c0e',
  canvasClear: '#0c0c0e',
  accent: '#c4a574',
  accentSecondary: '#8b9bb4',
  accentTertiary: '#6a7380',
  white: '#f5f3f0',
  muted: '#6b6a68',
  text: '#d8d6d3',
  border: 'rgba(255, 255, 255, 0.08)',
} as const

export const SCENE_RANGES = {
  hero:      { start: 0.0,  end: 0.18 },
  projects:  { start: 0.2,  end: 0.45 },
  about:     { start: 0.4,  end: 0.62 },
  services:  { start: 0.56, end: 0.78 },
  contact:   { start: 0.82, end: 1.0  },
} as const

export const TOTAL_SCROLL_HEIGHT = '700vh'

export const PARTICLE_COUNTS = {
  high:   7500,
  medium: 4000,
  low:    1800,
} as const

export const BLOOM_CONFIG = {
  high:   { intensity: 0.72, luminanceThreshold: 0.78, luminanceSmoothing: 0.92 },
  medium: { intensity: 0.48, luminanceThreshold: 0.84, luminanceSmoothing: 0.92 },
  low:    { intensity: 0, luminanceThreshold: 1.0, luminanceSmoothing: 0.9 },
} as const

export const DPR = {
  high:   [1, 2] as [number, number],
  medium: [1, 1.5] as [number, number],
  low:    [1, 1] as [number, number],
}

export type QualityLevel = 'high' | 'medium' | 'low'

export const SECTIONS = ['hero', 'projects', 'about', 'services', 'team', 'testimonials', 'contact'] as const
export type SectionId = typeof SECTIONS[number]

/**
 * Scroll 0–1: phase i spans [B[i], B[i+1]) for i = 0..7 (mist → coda).
 * NARRATIVE_PHASE_IDS[i] matches COLOR_STAGES[i]. SECTION_SCROLL_ANCHORS picks story-aligned jump targets.
 */
export const NARRATIVE_PHASE_BOUNDS = [
  0,
  0.11,
  0.22,
  0.32,
  0.44,
  0.56,
  0.72,
  0.86,
  1.0,
] as const

export const NARRATIVE_PHASE_IDS = [
  'mist',
  'forest',
  'forestShadow',
  'universe',
  'galaxy',
  'vessel',
  'gardenReturn',
  'coda',
] as const

export type NarrativePhaseId = (typeof NARRATIVE_PHASE_IDS)[number]

/** Jump targets for nav / CTAs (0–1). Phases: projects=forest, about=universe, services=galaxy, contact=gardenReturn start. */
export const SECTION_SCROLL_ANCHORS: Record<SectionId, number> = {
  hero: NARRATIVE_PHASE_BOUNDS[0],
  projects: NARRATIVE_PHASE_BOUNDS[1],
  about: NARRATIVE_PHASE_BOUNDS[3],
  services: NARRATIVE_PHASE_BOUNDS[4],
  team: 0.66,
  testimonials: 0.78,
  contact: NARRATIVE_PHASE_BOUNDS[7],
}

/** Particle morph: 8 target formations, 7 interpolation segments */
export const PARTICLE_KEY_COUNT = 8 as const

/** One colour stop per narrative phase (NARRATIVE_PHASE_IDS); sampled with narrativeMorphProgress. */
export const COLOR_STAGES = [
  { primary: [0.72, 0.62, 0.48], secondary: [0.35, 0.32, 0.3] },
  { primary: [0.55, 0.5, 0.42], secondary: [0.28, 0.26, 0.24] },
  { primary: [0.42, 0.4, 0.38], secondary: [0.22, 0.2, 0.2] },
  { primary: [0.48, 0.52, 0.62], secondary: [0.32, 0.36, 0.48] },
  { primary: [0.55, 0.58, 0.68], secondary: [0.38, 0.4, 0.52] },
  { primary: [0.62, 0.58, 0.48], secondary: [0.4, 0.36, 0.3] },
  { primary: [0.78, 0.74, 0.68], secondary: [0.48, 0.45, 0.4] },
  { primary: [0.58, 0.52, 0.44], secondary: [0.32, 0.28, 0.26] },
] as const

/** Cinematic scroll path — slower dolly / crane, less aggressive jumps */
export const CAMERA_WAYPOINTS = [
  { pos: [0, 0.5, 14.5] as const, lookAt: [0, 0.2, 1.0] as const },
  { pos: [2.8, 0.55, 10.0] as const, lookAt: [0, 0.35, -0.4] as const },
  { pos: [1.2, 0.38, 6.2] as const, lookAt: [-0.25, 0.15, -1.8] as const },
  { pos: [-2.4, 2.2, 20] as const, lookAt: [0, 0.9, 0] as const },
  { pos: [0.4, 14, 1.2] as const, lookAt: [0, 0, 0] as const },
  { pos: [2.4, 0.18, 6.8] as const, lookAt: [0, 0.2, 0] as const },
  { pos: [2.0, 0.05, 5.4] as const, lookAt: [0, 0.28, 0] as const },
  { pos: [-3.6, 0.72, 11.0] as const, lookAt: [0, 0.3, -0.5] as const },
] as const
