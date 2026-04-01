'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingGeometryProps {
  count?: number
  color?: string
  opacity?: number
}

interface Shape {
  position: [number, number, number]
  rotation: [number, number, number]
  rotSpeed: [number, number, number]
  floatPhase: number
  floatAmp: number
  scale: number
  type: number
}

export function FloatingGeometry({ count = 12, color = '#00FFFF', opacity = 1 }: FloatingGeometryProps) {
  const groupRef = useRef<THREE.Group>(null)

  const shapes = useMemo<Shape[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const radius = 4 + Math.random() * 6
      return {
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 4,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        rotSpeed: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
        ] as [number, number, number],
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: 0.2 + Math.random() * 0.3,
        scale: 0.2 + Math.random() * 0.4,
        type: i % 3,
      }
    })
  }, [count])

  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const shape = shapes[i]
      mesh.rotation.x += shape.rotSpeed[0]
      mesh.rotation.y += shape.rotSpeed[1]
      mesh.rotation.z += shape.rotSpeed[2]
      mesh.position.y = shape.position[1] + Math.sin(t * 0.5 + shape.floatPhase) * shape.floatAmp
    })
  })

  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
  ], [])

  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [color])

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
          geometry={geometries[shape.type]}
          material={material}
          visible={opacity > 0.01}
        />
      ))}
    </group>
  )
}
