'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel } from '@/lib/constants'
import { getNarrativePhaseIndex } from '@/lib/narrative'

interface NarrativeWorldsProps {
  progress: number
  quality: QualityLevel
}

const WORLDS: readonly { pos: readonly [number, number, number]; core: string; ring: string }[] = [
  { pos: [6.2, 1.1, 4.2], core: '#6b5cff', ring: '#9d8cff' },
  { pos: [-5.4, 0.9, 5.6], core: '#2ec4b6', ring: '#5eead4' },
  { pos: [4.5, -0.4, -5.8], core: '#ff6b6b', ring: '#ffa07a' },
  { pos: [-5.1, 1.6, -4.5], core: '#ffd166', ring: '#ffee88' },
  { pos: [0.2, 2.8, 7.5], core: '#4cc9f0', ring: '#90e0ef' },
]

export function NarrativeWorlds({ progress, quality }: NarrativeWorldsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const coreMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const ringMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const progressRef = useRef(progress)
  progressRef.current = progress

  const torusGeo = useMemo(() => new THREE.TorusGeometry(0.78, 0.045, 10, 48), [])

  useEffect(() => {
    return () => {
      torusGeo.dispose()
    }
  }, [torusGeo])

  useFrame(({ clock }) => {
    const phase = getNarrativePhaseIndex(progressRef.current)
    const show = phase === 3 || phase === 4
    const t = clock.elapsedTime
    const goal = show ? 0.2 : 0
    coreMats.current.forEach((m) => {
      if (!m) return
      m.opacity += (goal - m.opacity) * 0.05
    })
    ringMats.current.forEach((m) => {
      if (!m) return
      m.opacity += (goal * 0.85 - m.opacity) * 0.05
    })
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Group) {
          child.children.forEach((sub, j) => {
            if (sub instanceof THREE.Mesh) {
              if (j === 0) sub.rotation.y = t * 0.12 + i * 0.5
              else sub.rotation.x = t * 0.09 + i * 0.35
              sub.rotation.z = t * 0.05 + j * 0.2
            }
          })
        }
      })
      const vis =
        coreMats.current.some((m) => (m?.opacity ?? 0) > 0.02) ||
        ringMats.current.some((m) => (m?.opacity ?? 0) > 0.02)
      groupRef.current.visible = vis
    }
  })

  if (quality === 'low') return null

  const segs = quality === 'high' ? 28 : 20

  return (
    <group ref={groupRef}>
      {WORLDS.map((w, i) => (
        <group key={i} position={w.pos}>
          <mesh>
            <sphereGeometry args={[0.42 + (i % 3) * 0.05, segs, segs]} />
            <meshBasicMaterial
              ref={(el) => {
                coreMats.current[i] = el
              }}
              color={w.core}
              transparent
              opacity={0}
              wireframe
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={torusGeo}>
            <meshBasicMaterial
              ref={(el) => {
                ringMats.current[i] = el
              }}
              color={w.ring}
              transparent
              opacity={0}
              wireframe
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
