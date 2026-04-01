'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GlowingLinesProps {
  count?: number
  color?: string
  opacity?: number
}

export function GlowingLines({ count = 20, color = '#00FFFF', opacity = 1 }: GlowingLinesProps) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.Line[]>([])

  const lineData = useMemo(() => {
    return Array.from({ length: count }, () => {
      const startAngle = Math.random() * Math.PI * 2
      const endAngle = startAngle + (Math.random() - 0.5) * Math.PI
      const r = 3 + Math.random() * 10
      const y = (Math.random() - 0.5) * 6
      return {
        points: [
          new THREE.Vector3(Math.cos(startAngle) * r * 0.2, y, Math.sin(startAngle) * r * 0.2),
          new THREE.Vector3(Math.cos(endAngle) * r, y + (Math.random() - 0.5) * 2, Math.sin(endAngle) * r),
        ],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
      }
    })
  }, [count])

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.clear()
    linesRef.current = lineData.map(({ points }) => {
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const line = new THREE.Line(geo, mat)
      groupRef.current!.add(line)
      return line
    })
    return () => { linesRef.current = [] }
  }, [lineData, color])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    linesRef.current.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial
      mat.opacity = (0.3 + 0.4 * Math.sin(t * lineData[i].speed + lineData[i].phase)) * opacity
    })
  })

  return <group ref={groupRef} />
}
