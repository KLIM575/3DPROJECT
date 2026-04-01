'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getNarrativePhaseIndex, getNarrativePhaseLocalT } from '@/lib/narrative'

interface SceneAtmosphereProps {
  progress: number
}

const FOG_PRESETS: Record<number, { color: number; density: number }> = {
  0: { color: 0x041208, density: 0.024 },
  1: { color: 0x050f0a, density: 0.032 },
  2: { color: 0x050f0a, density: 0.032 },
  3: { color: 0x040818, density: 0.022 },
  4: { color: 0x040818, density: 0.022 },
  5: { color: 0x061a0e, density: 0.056 },
  6: { color: 0x05140c, density: 0.028 },
  7: { color: 0x05140c, density: 0.026 },
}

export function SceneAtmosphere({ progress }: SceneAtmosphereProps) {
  const { scene } = useThree()
  const progressRef = useRef(progress)
  const fogRef = useRef<THREE.FogExp2 | null>(null)
  const colorA = useRef(new THREE.Color())
  const colorB = useRef(new THREE.Color())
  progressRef.current = progress

  useEffect(() => {
    fogRef.current = new THREE.FogExp2(0x020504, 0.02)
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
