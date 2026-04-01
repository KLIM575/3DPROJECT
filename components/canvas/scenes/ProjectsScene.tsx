'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ParticleField } from '../objects/ParticleField'
import { GlowingLines } from '../objects/GlowingLines'
import { QualityLevel } from '@/lib/constants'
import { projects } from '@/data/portfolio'

interface ProjectsSceneProps {
  opacity: number
  quality: QualityLevel
  sectionProgress: number
}

function ProjectCard3D({
  project,
  index,
  opacity,
}: {
  project: (typeof projects)[number]
  index: number
  opacity: number
}) {
  const color = useMemo(() => new THREE.Color(project.color), [project.color])
  const angle = index % 2 === 0 ? 1 : -1
  const x = angle * 2.5
  const z = -index * 3.5

  return (
    <group position={[x, 0, z]}>
      {/* Card face */}
      <mesh>
        <planeGeometry args={[3.2, 2]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Card border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2)]} />
        <lineBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Corner accents */}
      {([[-1.5, 0.95], [1.5, 0.95], [-1.5, -0.95], [1.5, -0.95]] as [number, number][]).map(([cx, cy], ci) => (
        <mesh key={ci} position={[cx, cy, 0.01]}>
          <planeGeometry args={[0.2, 0.04]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity * 0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export function ProjectsScene({ opacity, quality, sectionProgress }: ProjectsSceneProps) {
  const cameraGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!cameraGroupRef.current) return
    const targetZ = -sectionProgress * (projects.length * 3.5)
    cameraGroupRef.current.position.z += (targetZ - cameraGroupRef.current.position.z) * 0.05
    cameraGroupRef.current.position.y = Math.sin(sectionProgress * Math.PI * 2) * 0.3
  })

  if (opacity < 0.01) return null

  return (
    <group>
      <ParticleField quality={quality} color="#0088FF" spread={30} opacity={opacity * 0.4} />
      <GlowingLines count={quality === 'high' ? 30 : 15} color="#7B00FF" opacity={opacity * 0.6} />

      <group ref={cameraGroupRef}>
        {projects.map((project, i) => (
          <ProjectCard3D
            key={project.id}
            project={project}
            index={i}
            opacity={opacity}
          />
        ))}
      </group>
    </group>
  )
}
