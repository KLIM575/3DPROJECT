'use client'

import { useMemo } from 'react'
import { SCENE_RANGES } from '@/lib/constants'
import { smoothstep } from '@/lib/animations'

export type SceneName = keyof typeof SCENE_RANGES

interface SceneVisibility {
  opacity: number
  active: boolean
}

export function useSceneTransition(progress: number): Record<SceneName, SceneVisibility> {
  return useMemo(() => {
    const FADE = 0.04 // fade zone width

    function computeVisibility(start: number, end: number): SceneVisibility {
      const fadeIn = smoothstep(start, start + FADE, progress)
      const fadeOut = 1 - smoothstep(end - FADE, end, progress)
      const opacity = Math.min(fadeIn, fadeOut)
      return {
        opacity,
        active: opacity > 0.01,
      }
    }

    return {
      hero:     computeVisibility(SCENE_RANGES.hero.start, SCENE_RANGES.hero.end),
      projects: computeVisibility(SCENE_RANGES.projects.start, SCENE_RANGES.projects.end),
      about:    computeVisibility(SCENE_RANGES.about.start, SCENE_RANGES.about.end),
      services: computeVisibility(SCENE_RANGES.services.start, SCENE_RANGES.services.end),
      contact:  computeVisibility(SCENE_RANGES.contact.start, SCENE_RANGES.contact.end),
    }
  }, [progress])
}
