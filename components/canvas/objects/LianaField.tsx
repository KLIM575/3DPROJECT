'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel } from '@/lib/constants'
import { getNarrativePhaseIndex } from '@/lib/narrative'

interface LianaFieldProps {
  progress: number
  quality: QualityLevel
}

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function LianaField({ progress, quality }: LianaFieldProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(progress)
  progressRef.current = progress
  const lineCount = quality === 'high' ? 36 : quality === 'medium' ? 20 : 0

  const geometry = useMemo(() => {
    if (lineCount === 0) return null
    const positions: number[] = []
    const segs = quality === 'high' ? 28 : 18
    for (let l = 0; l < lineCount; l++) {
      const ang = l * 1.85 + rand(l * 3.17) * 0.65
      const r = 1.6 + rand(l * 5.71) * 9.5
      const x0 = Math.cos(ang) * r
      const z0 = Math.sin(ang) * r
      const yTop = 2.4 + rand(l * 7.31) * 5.2
      const yLow = 0.35 + rand(l * 8.41) * 1.8
      const mid = new THREE.Vector3(
        x0 + Math.sin(l * 1.1) * 0.9,
        (yTop + yLow) * 0.5 + rand(l * 9.51) * 0.6,
        z0 + Math.cos(l * 0.9) * 0.85,
      )
      const p0 = new THREE.Vector3(x0 + rand(l * 10.1) * 0.25, yTop, z0)
      const p1 = p0.clone().lerp(mid, 0.35).add(new THREE.Vector3(rand(l * 11.2) * 0.5, -0.4, rand(l * 12.3) * 0.5))
      const p2 = mid.clone().add(new THREE.Vector3(Math.sin(l) * 0.7, rand(l * 13.4) * 0.3, Math.cos(l * 0.7) * 0.7))
      const p3 = new THREE.Vector3(x0 * 0.92 + rand(l * 14.5) * 0.2, yLow, z0 * 0.92)
      const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3])
      const pts = curve.getPoints(segs)
      for (let s = 0; s < pts.length - 1; s++) {
        positions.push(pts[s].x, pts[s].y, pts[s].z, pts[s + 1].x, pts[s + 1].y, pts[s + 1].z)
      }
    }
    const merged = new THREE.BufferGeometry()
    merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return merged
  }, [lineCount, quality])

  useEffect(() => {
    if (!geometry) return
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  const matRef = useRef<THREE.LineBasicMaterial>(null)

  useFrame(({ clock }) => {
    const phase = getNarrativePhaseIndex(progressRef.current)
    const show = (phase === 1 || phase === 2) && lineCount > 0
    const target = show ? 0.3 : 0
    if (matRef.current) {
      matRef.current.opacity += (target - matRef.current.opacity) * 0.055
      matRef.current.color.setRGB(
        0.1 + Math.sin(clock.elapsedTime * 0.2) * 0.03,
        0.38 + Math.sin(clock.elapsedTime * 0.15) * 0.05,
        0.16,
      )
    }
  })

  if (!geometry || lineCount === 0) return null

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          ref={matRef}
          color="#1f5c38"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
