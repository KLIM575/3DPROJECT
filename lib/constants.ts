export const COLORS = {
  background: '#050510',
  accent: '#00FFFF',
  accentSecondary: '#0088FF',
  accentTertiary: '#7B00FF',
  white: '#FFFFFF',
  muted: '#4A4A6A',
  text: '#C0C0E0',
  border: 'rgba(0, 255, 255, 0.15)',
} as const

export const SCENE_RANGES = {
  hero:      { start: 0.0,  end: 0.18 },
  projects:  { start: 0.15, end: 0.45 },
  about:     { start: 0.42, end: 0.62 },
  services:  { start: 0.59, end: 0.78 },
  contact:   { start: 0.75, end: 1.0  },
} as const

export const TOTAL_SCROLL_HEIGHT = '700vh'

export const PARTICLE_COUNTS = {
  high:   10000,
  medium: 5000,
  low:    2000,
} as const

export const BLOOM_CONFIG = {
  high:   { intensity: 1.5, luminanceThreshold: 0.7, luminanceSmoothing: 0.9 },
  medium: { intensity: 1.0, luminanceThreshold: 0.8, luminanceSmoothing: 0.9 },
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
