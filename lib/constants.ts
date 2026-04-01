export const COLORS = {
  background: '#020504',
  canvasClear: '#020504',
  accent: '#5dffc4',
  accentSecondary: '#2a9d7a',
  accentTertiary: '#6b7cff',
  white: '#FFFFFF',
  muted: '#4A4A6A',
  text: '#C0C0E0',
  border: 'rgba(93, 255, 196, 0.18)',
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
  high:   10000,
  medium: 5000,
  low:    2000,
} as const

export const BLOOM_CONFIG = {
  high:   { intensity: 1.85, luminanceThreshold: 0.62, luminanceSmoothing: 0.88 },
  medium: { intensity: 1.25, luminanceThreshold: 0.72, luminanceSmoothing: 0.88 },
  low:    { intensity: 0,   luminanceThreshold: 1.0, luminanceSmoothing: 0.9 },
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
  { primary: [0.22, 0.92, 0.48], secondary: [0.06, 0.52, 0.28] },
  { primary: [0.14, 0.78, 0.36], secondary: [0.08, 0.42, 0.22] },
  { primary: [0.1, 0.62, 0.32], secondary: [0.18, 0.38, 0.14] },
  { primary: [0.35, 0.55, 1.0], secondary: [0.75, 0.2, 0.95] },
  { primary: [0.5, 0.42, 0.98], secondary: [0.2, 0.65, 0.92] },
  { primary: [0.55, 0.98, 0.62], secondary: [0.15, 0.42, 0.28] },
  { primary: [0.88, 0.95, 0.9], secondary: [0.32, 0.55, 0.4] },
  { primary: [0.16, 0.75, 0.38], secondary: [0.05, 0.4, 0.2] },
] as const

/** Cinematic scroll path: wide mist → forest dolly → intimate shadow → cosmic pullback → galactic god-view → vessel lock-in → garden return */
export const CAMERA_WAYPOINTS = [
  { pos: [0, 0.55, 15.5] as const, lookAt: [0, 0.25, 1.2] as const },
  { pos: [4.2, 0.65, 9.2] as const, lookAt: [0, 0.45, -0.8] as const },
  { pos: [1.4, 0.32, 5.2] as const, lookAt: [-0.35, 0.12, -2.4] as const },
  { pos: [-3.2, 2.8, 24] as const, lookAt: [0, 1.2, 0] as const },
  { pos: [0.5, 19, 0.8] as const, lookAt: [0, 0, 0] as const },
  { pos: [3.1, 0.12, 6.4] as const, lookAt: [0, 0.22, 0] as const },
  { pos: [2.45, -0.08, 5.1] as const, lookAt: [0, 0.32, 0] as const },
  { pos: [-5.2, 0.85, 10.5] as const, lookAt: [0, 0.35, -0.6] as const },
] as const
