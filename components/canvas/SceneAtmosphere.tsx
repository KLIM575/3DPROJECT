'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getNarrativePhaseIndex, getNarrativePhaseLocalT } from '@/lib/narrative'

interface SceneAtmosphereProps {
  progress: number
}

const FOG_PRESETS: Record<number, { color: number; density: number }> = {
  0: { color: 0x0e0e10, density: 0.02 },
  1: { color: 0x0c0c0f, density: 0.026 },
  2: { color: 0x0b0b0e, density: 0.026 },
  3: { color: 0x0d0e12, density: 0.018 },
  4: { color: 0x0c0d14, density: 0.018 },
  5: { color: 0x101018, density: 0.038 },
  6: { color: 0x0f0f12, density: 0.024 },
  7: { color: 0x0e0e11, density: 0.022 },
}

export function SceneAtmosphere({ progress }: SceneAtmosphereProps) {
  const { scene } = useThree()
  const progressRef = useRef(progress)
  const fogRef = useRef<THREE.FogExp2 | null>(null)
  const colorA = useRef(new THREE.Color())
  const colorB = useRef(new THREE.Color())
  progressRef.current = progress

  useEffect(() => {
    fogRef.current = new THREE.FogExp2(0x0c0c0e, 0.02)
    scene.fog = fogRef.current
    return () => {
      scene.fog = null
      fogRef.current = null
    }
  }, [scene])

  useFrame(() => {
    const p = progressRef.current
    if (!fogRef.current) return
    const phase = getNarrativePhaseIndex(p)
    const t = getNarrativePhaseLocalT(p)
    const nextPhase = Math.min(phase + 1, 7)
    const cfgA = FOG_PRESETS[phase] ?? FOG_PRESETS[0]
    const cfgB = FOG_PRESETS[nextPhase] ?? cfgA
    colorA.current.setHex(cfgA.color)
    colorB.current.setHex(cfgB.color)
    fogRef.current.color.lerpColors(colorA.current, colorB.current, t)
    fogRef.current.density = THREE.MathUtils.lerp(cfgA.density, cfgB.density, t)
  })

  return null
}
