'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getNarrativePhaseIndex, getNarrativePhaseLocalT } from '@/lib/narrative'

interface SceneAtmosphereProps {
  progress: number
}

/** Exponential fog — light haze, phase-keyed tint. */
const FOG_PRESETS: Record<number, { color: number; density: number }> = {
  0: { color: 0x080a0c, density: 0.0078 },
  1: { color: 0x070907, density: 0.0085 },
  2: { color: 0x090b14, density: 0.0068 },
  3: { color: 0x0b0916, density: 0.0062 },
  4: { color: 0x0e1018, density: 0.0092 },
}

export function SceneAtmosphere({ progress }: SceneAtmosphereProps) {
  const { scene } = useThree()
  const progressRef = useRef(progress)
  const fogRef = useRef<THREE.FogExp2 | null>(null)
  const colorA = useRef(new THREE.Color())
  const colorB = useRef(new THREE.Color())
  progressRef.current = progress

  useEffect(() => {
    fogRef.current = new THREE.FogExp2(0x08080c, 0.0075)
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
    const nextPhase = Math.min(phase + 1, 4)
    const cfgA = FOG_PRESETS[phase] ?? FOG_PRESETS[0]
    const cfgB = FOG_PRESETS[nextPhase] ?? cfgA
    colorA.current.setHex(cfgA.color)
    colorB.current.setHex(cfgB.color)
    fogRef.current.color.lerpColors(colorA.current, colorB.current, t)
    fogRef.current.density = THREE.MathUtils.lerp(cfgA.density, cfgB.density, t)
  })

  return null
}
