'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QualityLevel } from '@/lib/constants'

interface ServicesSceneProps {
  opacity: number
  quality: QualityLevel
  sectionProgress: number
}

const NODE_COUNT = 6

export function ServicesScene({ opacity, quality, sectionProgress }: ServicesSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])
  const connectionGroupRef = useRef<THREE.Group>(null)

  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i / NODE_COUNT) * Math.PI * 2
      const r = 3
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(angle * 0.5) * 0.8,
          Math.sin(angle) * r
        ),
        phase: (i / NODE_COUNT) * Math.PI * 2,
      }
    })
  }, [])

  const connections = useMemo(() => {
    const conns: [number, number][] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        conns.push([i, j])
      }
    }
    return conns
  }, [])

  // Build connection lines imperatively
  useEffect(() => {
    if (!connectionGroupRef.current) return
    connectionGroupRef.current.clear()

    connections.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry()
      const pts = new Float32Array([
        nodes[a].position.x, nodes[a].position.y, nodes[a].position.z,
        nodes[b].position.x, nodes[b].position.y, nodes[b].position.z,
      ])
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3))
      const mat = new THREE.LineBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      connectionGroupRef.current!.add(new THREE.Line(geo, mat))
    })
  }, [connections, nodes])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.rotation.y = t * 0.05 + sectionProgress * Math.PI * 0.5
    groupRef.current.scale.setScalar(0.4 + sectionProgress * 0.8)

    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const node = nodes[i]
      mesh.position.y = node.position.y + Math.sin(t * 0.4 + node.phase) * 0.2
      mesh.scale.setScalar(0.8 + Math.sin(t * 0.7 + node.phase) * 0.15)
    })

    // Update connection line opacities
    if (connectionGroupRef.current) {
      connectionGroupRef.current.children.forEach(child => {
        const line = child as THREE.Line
        if (line.material instanceof THREE.LineBasicMaterial) {
          line.material.opacity = opacity * 0.2
        }
      })
    }
  })

  if (opacity < 0.01) return null

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => { nodeRefs.current[i] = el }}
          position={node.position}
        >
          <octahedronGeometry args={[0.25, 0]} />
          <meshBasicMaterial
            color="#00FFFF"
            transparent
            opacity={opacity * 0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Node halos */}
      {nodes.map((node, i) => (
        <mesh key={`halo-${i}`} position={node.position}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial
            color="#00FFFF"
            transparent
            opacity={opacity * 0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Connection lines */}
      <group ref={connectionGroupRef} />

      {/* Central cube */}
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshBasicMaterial
          color="#7B00FF"
          wireframe
          transparent
          opacity={opacity * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.3, 3.4, 64]} />
        <meshBasicMaterial
          color="#00FFFF"
          transparent
          opacity={opacity * 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
